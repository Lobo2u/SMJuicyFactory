PRD_STATUS = $System.p_PRD_STATUS ;
console.log('PRD_STATUS', 'PRD_STATUS');
if(PRD_STATUS === '진행'){
    $System.STOP_1=false;

    if($System.START_1 === false){
        $System.START_1 = true;
    }
    
    

    //설비 제어
    $System.Conveyor_Topic_1 = 'kocham/1/raspberry';
    $System.Conveyor_1  = 'stop';
    console.log("$System.Conveyor_1 : ",$System.Conveyor_1)

    
    click__conv_stop=time();
    //console.log(click__conv_stop);
    
    
    var flowcode_in="F01";
    var prdcode_in=$System.p_PRD_CODE;
    var wocode_in=current_wocode;
    var goodcnt_in=0;
    var badcnt_in=0;
    var wo_Status=1;
    //console.log("wocode_in", wocode_in,"prdcode_in", prdcode_in);
    var u_sql = `update tb_prd set wo_Status= 0, END_DATETIME="${click__conv_stop}" where flow_code='${flowcode_in}' and wo_code='${wocode_in}' and prd_code='${prdcode_in}';`;
    console.log(u_sql);
    SQLExecute1("smsql",1,u_sql,function(db){
        if(db.errorCode===0){
             $.messager.show({
                    title:'Message',
                    msg:'수정완료',
                    timeout:1000,
                    showType:'slide'
                });
        }
        else alert(db.message);
    });

} else{
    
    $.messager.show({
        title:'Message',
        msg:`오류입니다 상태가 '${PRD_STATUS}' 중 입니다. 이전 작업을 종료하여주세요.`,
        timeout:1000,
        showType:'slide'
    });

}




//표시 제어


//공백 0
function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

//오늘 날짜
function today(){
    var date = new Date();
    var year = date.getFullYear();
    var month =date.getMonth()+1;
    var day = date.getDate();
    if(month === 13) {
        year = year+1;
        month = 1;
    }
    month = pad(month,2);
    day = pad(day,2);
    var dt=year+''+month+''+day+'';
    return dt;
}

//현재 시간
function time(){
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var hours = ('0' + today.getHours()).slice(-2); 
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 
    var now_time = year + '-' + month  + '-' + day + ' ' + hours + ':' + minutes  + ':' + seconds; 
    return now_time;
}


