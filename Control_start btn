PRD_STATUS = $System.p_PRD_STATUS ;
console.log('PRD_STATUS', PRD_STATUS);

var flowcode_in="F01";
var prdcode_in=$System.p_PRD_CODE;
var wocode_in=$System.w_WO_CODE;
var goodcnt_in=0;
var badcnt_in=0;
var wo_Status=1;
    
if(PRD_STATUS === '진행'){

    $System.Conveyor_Topic_1 = 'kocham/1/raspberry';
    $System.Conveyor_1  = 'run';
    
    console.log("$System.Conveyor_Topic_1 : ",$System.Conveyor_Topic_1);
    console.log("$System.Conveyor_1 : ",$System.Conveyor_1);

    
    console.log('들어감');
    $System.START_1=false;
    
    if($System.STOP_1 === false){
        $System.STOP_1 = true;
    }
    

    
    
    
    click_conv_start=time();
    //console.log(click_conv_start);
    a = today();
    //tb_prd에 있는 마지막 wo_code select
    var s_sql=`select wo_code FROM tb_prd WHERE FLOW_CODE='F01' order by wo_CODE desc LIMIT 1;` 
    var wcode = '';
    console.log("s_sql:",s_sql);
    SQLExecute1('smsql',0,s_sql, function(data){
        if(data.errorCode === 0){
            var dataArray = data.data.records;
                if(dataArray.length!==0){
                    //console.log(dataArray[0].wo_code);
                    var lastpcode=Number(dataArray[0].wo_code.slice(1,9));
                    if(String(lastpcode) !== a){
                        wcode = 'w'+a+'001';
                        //console.log('notexist',wcode);
                        insertQuery(wcode);
                    }
                    else{
                        var wseq =Number(dataArray[0].wo_code.slice(10,13));
                        wseq ++;
                        wcode = 'w'+a+pad(wseq,3);
                        //console.log('exist',wcode);
                        insertQuery(wcode);
                        }
                    }
                else{
                    wcode = 'w'+a+'001';
                    //console.log('new_wcode',wcode);
                    insertQuery(wcode);
                }
            current_wocode=wcode;
            $System.w_WO_CODE=wcode;
            selectSeqSql();
    
        }
    });

}else{
     $.messager.show({
            title:'Message',
            msg:`오류입니다 상태가 '${PRD_STATUS}' 입니다.`,
            timeout:1000,
            showType:'slide'
        });

}


//seq 조회
function selectSeqSql(){    
    //console.log("wcode : ",wcode);
    //console.log("current_wocode : ",current_wocode);
    
    
    
    //tb_conv 에 가동정보 insert
    var s_sql = `select seq FROM tb_conv WHERE FLOW_CODE='F01' and WO_CODE = '${wocode_in}' and equ_code=E001 order by seq desc LIMIT 1;`;
    var new_seq = '';
    console.log("sql:",s_sql);
    SQLExecute1('smsql',0,s_sql, function(data){
        if(data.errorCode === 0){
            var dataArray = data.data.records;
                if(dataArray.length!==0){   // seq가 있는지
                    //console.log(dataArray[0].seq);
                    var lastseq=Number(dataArray[0].seq);
                        new_seq = lastseq+1;
                        //console.log("lastseq : ", lastseq)
                        insertQuery2(new_seq);
                }
                else{  // seq가 없다
                    new_seq = 1;
                    //console.log('conv not exist, new seq made : ',new_seq);
                    insertQuery2(new_seq);
                }
            seq_in=new_seq;
            }
        });  
    
}




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


//tb_prd에 insert
function insertQuery(wcode){
    //console.log("wocode_in", wcode,"prdcode_in", prdcode_in);
    var i_sql = `insert into tb_prd values ('${flowcode_in}','${prdcode_in}','${wcode}','${goodcnt_in}','${badcnt_in}','${wo_Status}','${time()}',0);`;
    console.log(i_sql);
    SQLExecute1("smsql",1,i_sql,function(db){
        if(db.errorCode===0){
             $.messager.show({
                    title:'Message',
                    msg:'추가완료',
                    timeout:1000,
                    showType:'slide'
                });
        }
        else alert(db.message);
    });
}





function insertQuery2(new_seq){
   // console.log("prdcode_in", prdcode_in,"wocode_in", current_wocode,"seq_in", new_seq);
    var i_sql = `insert into tb_conv values ('${flowcode_in}','${current_wocode}','E001','${a}','${new_seq}',now());`;
    console.log(i_sql);
    SQLExecute1("smsql",1,i_sql,function(db){
    if(db.errorCode===0){
         $.messager.show({
                title:'Message',
                msg:'추가완료',
                timeout:1000,
                showType:'slide'
            });
    }
    else alert(db.message);
});
}

