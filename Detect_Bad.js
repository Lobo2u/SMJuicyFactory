if($System.C2_1==="True"){
 //제품 감지(불량) 되었을때  tb_prd_conv에 생산 내역 insert
var s_sql = `select seq FROM tb_prd_conv WHERE FLOW_CODE='F01' and PRD_CODE= ${System.p_PRD_CODE} and wo_CODE = '${current_wocode}' order by wo_CODE desc LIMIT 1;`;
var new_seq = '';
console.log("sql:",s_sql);
SQLExecute1('smsql',0,s_sql, function(data){
    if(data.errorCode === 0){
        var dataArray = data.data.records;
            if(dataArray.length!==0){   // seq가 있는지
                console.log(dataArray[0].seq);
                var lastseq=Number(dataArray[0].seq);
                    new_seq = lastseq+1;
                    console.log("lastseq : ", lastseq)
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

    var add_bad_sql = `update tb_prd set BAD_CNT = (select BAD_CNT from(select BAD_CNT + 1 as BAD_CNT from tb_prd where WO_CODE = '${wocode_in}') a )   where WO_CODE = '${wocode_in}';`;
    
    SQLExecute1("smsql",1,add_bad_sql,function(db){
        if(db.errorCode===0){
           dataArray = data.data.records;
           
           var bad_cnt = [];
           
           bad_cnt.push(dataArray.BAD_CNT);
           
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
