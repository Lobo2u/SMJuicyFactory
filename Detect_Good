if($System.C1_1==="True"){
    
     //제품 감지(양품) 되었을때  tb_prd_conv에 생산 내역 insert
    var s_sql = `select seq FROM tb_prd_conv WHERE FLOW_CODE='F01' and PRD_CODE= ${System.p_PRD_CODE} and wo_CODE = '${$System.w_WO_CODE}' order by wo_CODE desc LIMIT 1;`;
    var new_seq = '';
    console.log("sql:",s_sql);
    
    // $$p_PRD_CNT += 1;
    // console.log('$$p_PRD_CNT : ', $$p_PRD_CNT);
    
    SQLExecute1('smsql',0,s_sql, function(data){
        if(data.errorCode === 0){
            var dataArray = data.data.records;
                if(dataArray.length!==0){   // seq가 있는지
                    console.log(dataArray[0].seq);
                    var lastseq=Number(dataArray[0].seq);
                        new_seq = lastseq+1;
                        console.log("lastseq : ", lastseq);
                        insertQuery();
                }
                else{  // seq가 없다
                    new_seq = 1;
                    console.log('prd_conv not exist, new seq made : ',seq);
                    insertQuery();
                }
            }
    });  
}

function insertQuery(){
    console.log($System.w_WO_CODE);
    var flowcode_in="F01";
    var prdcode_in=$System.p_PRD_CODE;
    var wocode_in=$System.w_WO_CODE;
    var seq_in=seq;
    var prod_type=$System.Sort_1;
    var path_in=$System.File_Name_1;
    console.log("prdcode_in", prdcode_in,"wocode_in", wocode_in,"seq_in", seq_in,"prod_type", prod_type,"path_in", path_in);
    var i_sql = `insert into tb_prd_conv values ('${flowcode_in}','${prdcode_in}','${wocode_in}','${seq_in}','${prod_type}','${path_in}',now());`;
    console.log('i_sql :',  i_sql );
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
    
    var add_good_sql = `update tb_prd set GOOD_CNT = (select GOOD_CNT from(select GOOD_CNT + 1 as GOOD_CNT from tb_prd where WO_CODE = '${wocode_in}') a )   where WO_CODE = '${wocode_in}';`;
    var checked_good_sql = `select GOOD_CNT from tb_prd where WO_CODE = '${wocode_in}';`
    SQLExecute1("smsql",1,add_good_sql,function(db){
        if(db.errorCode===0){
        //   dataArray_1 = data.data.records;
           
        //   var good_cnt = [];
           
        //   good_cnt.push(dataArray_1.GOOD_CNT);
           
        //   $System.p_PRD_CNT = good_cnt[0];
           
        }
        else alert(db.message);
});
    

    
}
function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


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
