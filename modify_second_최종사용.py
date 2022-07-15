#!/usr/bin/env python3

# Transport
import paho.mqtt.client as mqtt
import serial
import minimalmodbus
from PIL import Image, ImageOps
import ftplib
import threading

# Control
import RPi.GPIO as GPIO
import pigpio

# Vision
import tensorflow.keras
import cv2
import numpy as np

# etc
import time
from picamera import PiCamera
from datetime import datetime

# GPIO 세팅
relay_1 =17
relay_2 =4
sensor_front =27
sensor_abnormal =18
sensor_normal =23

GPIO.setmode(GPIO.BCM)
GPIO.setup(17 ,GPIO.OUT) # Relay_1
GPIO.setup(4 ,GPIO.OUT) # Relay_2
GPIO.setup(27 ,GPIO.IN, pull_up_down = GPIO.PUD_UP) # sensor_front
GPIO.setup(23 ,GPIO.IN, pull_up_down = GPIO.PUD_UP) # sensor_abnormal
GPIO.setup(18 ,GPIO.IN, pull_up_down = GPIO.PUD_UP) # sensor_normal

GPIO.output(relay_1, False)
GPIO.output(relay_2, False)

# 제품 카운트 세팅
pro1_count =0
pro2_count =0

# RUN check
conv =False 
setval=False
itemin =False
conv_state1='stop'
conv_state2='stop'
call =0



# 온습도 센서 세팅
instrument = minimalmodbus.Instrument('/dev/ttyUSB0' ,1)
instrument.serial.port = '/dev/ttyUSB0'
instrument.serial.baudrate = 4800
instrument.serial.timeout = 1
instrument.address =1
instrument.mode =minimalmodbus.MODE_RTU
instrument.clear_buffers_before_each_transaction = True


# 파이캠 세팅
pi =pigpio.pi()
camera = PiCamera()
# Disable scientific notation for clarity
np.set_printoptions(suppress=True)

# 모델 세팅
# Load the model
model = tensorflow.keras.models.load_model('/home/pi/keras_model.h5')
# Create the array of the right shape to feed into the keras model
# The 'length' or number of images you can put into the array is determined by the first position in the shape tuple, in this case 1.
data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
#time.sleep(5)

print("setup")



# def emerstop():
#     if conv==False:
#         GPIO.output(relay_1, False)
#         GPIO.output(relay_2, False)
#         threading.Timer(1.0, emerstop).start()


def getsensor():
    ##여기부터 온습도 센서 작동##
    humi =instrument.read_register(0 ,1) # adress : 0 , decimal : .0
    temp =instrument.read_register(1 ,1)
    lux =instrument.read_register(2 ,0)  # address : 2, decimal : 0
    
    global call
    call+=1
    if call > 5:
        call =1

    print("")
    print("humi : ",humi)
    print("temp : ",temp)
    print("lux : ",lux)
    print(call)
    print("conv_1 : ",conv_state1)
    print("conv_2 : ",conv_state2)

    client.publish('kocham/1/Connect' ,call)
    client.publish('kocham/1/temp' ,str(temp))
    client.publish('kocham/1/humi' ,str(humi))
    client.publish('kocham/1/lux' ,str(lux))
    client.publish('kocham/1/conveyor_state2', conv_state2)
    client.publish('kocham/1/conveyor_state1', conv_state1)

    threading.Timer(1.0, getsensor).start()


# 분류작업
def classificate(prec):  # prediction[0,0,0]
    datas =prec[0]
    max_v =datas[0]
    max_i =0

    for i in range(len(datas)):
        if max_v < datas[i]:
            max_v = datas[i]
            max_i = i
    return max_i


def callname(max_i):
    name =''
    if max_i==0:
        name ='abnormal'
    elif max_i==1:
        name ='juice'
    elif max_i==2:
        name ='empty'

    return name


# 서보각도
def serv(sv):
    pi.set_servo_pulsewidth(21 ,sv)


# 사진촬영, 모델 돌리기
def picam():
    camera.start_preview(fullscreen=False ,window=(200 ,200 ,640 ,480))
    print("capture_start")
    camera.capture("/home/pi/work/image.jpg")   # 캡쳐

def imgsend():
    print("send_start")
    session = ftplib.FTP('192.168.0.100' ,'user' ,'1234')
    print("sending")
    file =open('/home/pi/work/image.jpg' ,'rb')  # rb== read by binary
    now =datetime.now()
    filename =now.strftime("%Y%m%d_%H%M%S") +"_F01" + ".jpg"
    session.storbinary("STOR " + filename, file)
    client.publish("kocham/1/filename", filename)
    print("uploaded")
    file.close()
    session.quit()


def getprec():
    global pro2_count
    global pro1_count
    
    testimg = cv2.imread("/home/pi/work/image.jpg")
    x = 200;
    y = 200;
    w = 1400;
    h = 800;
    reimg = testimg[y:y + h, x:x + w]
    testimg2 = reimg.copy()

    cv2.imwrite("/home/pi/work/image.jpg", testimg2)
    camera.stop_preview()
    print("done")

    # Replace this with the path to your image
    image = Image.open('/home/pi/work/image.jpg')
    # resize the image to a 224x224 with the same strategy as in TM2:
    # resizing the image to be at least 224x224 and then cropping from the center
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.ANTIALIAS)
    # turn the image into a numpy array
    image_array = np.asarray(image)
    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    # Load the image into the array
    data[0] = normalized_image_array
    # run the inference
    prediction = model.predict(data)

    print("prediction ", prediction)
    max_i = classificate(prediction)  # 분류 결과(분류코드)
#   Image.close() 없어도 되나,,?

    if max_i == 0:
        serv(1150)  # 0 == 불량
    elif max_i == 1:
        serv(1000)
    else:
        serv(1100)

    name = callname(max_i)  # 분류 결과 (상품명)
    print("item_code : ", max_i)
    print("name :", name)

    if (max_i != 2):        # empty 가 아닐 때
        imgsend()
        client.publish('kocham/1/sort', name)
#        client.publish('kocham/1/sort_percent',str(pro1_count/(pro1_count+pro2_count)*100)+"%")
    


# mqtt 연결
def on_connect(client, userdata, flags, rc):
    print("Connected with result code" + str(rc))
    client.subscribe("kocham/1/raspberry")


# mqtt 설정
def on_message(client, userdata, msg):
    msg.payload = msg.payload.decode("utf-8")
    global conv
    global pro2_count
    global pro1_count
    
    if str(msg.payload) == "run":
        conv = True

    elif str(msg.payload) == "stop":
        pro2_count=0
        pro1_count=0
        conv = False








# RUN 신호 받기,컨베이어 작동

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

#client.connect("broker.mqttdashboard.com", 1883)
client.connect("192.168.0.113", 1883)  # Check this address is right
client.loop_start()

#### main ####

# 서보 초기화
serv(1100)
getsensor()

try:
    while True:
        if(conv):
            GPIO.output(relay_1, True)  # conveyor_1
            GPIO.output(relay_2, True)  # conveyor_2
            conv_state1="run"
            conv_state2="run"			
            setval=True
        else:
            GPIO.output(relay_1, False)  # conveyor_1
            GPIO.output(relay_2, False)  # conveyor_2
            conv_state1="stop"
            conv_state2="stop"			
            setval=False

        if(setval):
            if(GPIO.input(sensor_front)):  # sensor_front 감지
                client.publish('kocham/1/Detect', "True")
                
                print("item Detect")
                itemin = True
                time.sleep(0.6)
                GPIO.output(relay_1, False)
                picam()  # 캡쳐시작
                GPIO.output(relay_1, True)
                getprec()
                time.sleep(2)
                client.publish('kocham/1/Detect', "False")
        if(itemin):
            #print("item in")
            if(GPIO.input(sensor_abnormal)):  # sensor_abnormal 감지
                print("abnormal_Detect")
                time.sleep(0.5)
                pro2_count += 1
                print("Abnormal", pro2_count)
                client.publish('kocham/1/count2', "True")
                print("count2_true")
                time.sleep(3)
                client.publish('kocham/1/count2', "False")
                print("count2_false") # 다음 품목 투입 가능 시점
                itemin = False

            elif(GPIO.input(sensor_normal)):  # sensor_normal 감지
                print("Juice_Detect")
                time.sleep(0.5)
                pro1_count += 1
                print("Juice ", pro1_count)
                client.publish('kocham/1/count1', "True")
                print("count1_true")
                time.sleep(3)
                client.publish('kocham/1/count1', "False")
                print("count1_false")
                itemin = False
                
###        client.publish('kocham/1/count2', pro2_count)
###        client.publish('kocham/1/count1', pro1_count)

except KeyboardInterrupt:
    # Ctrl+C 입력시
    GPIO.output(relay_1, False)
    GPIO.output(relay_2, False)
    serv(1100)
    session.quit()  # 서버 나가기
    instrument.serial.close()
    GPIO.cleanup()
    print("cleanup")






