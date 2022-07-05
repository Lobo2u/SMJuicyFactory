

$('#' + id).datagrid({
   columns: [[
      { field: 'ck',checkbox:true},
      { field: 'FLOW_CODE', title: '공정코드', width: 250, align:'center',sortable:true},
      { field: 'LAB_NAME', title: '작업자명', width: 250, align:'center',sortable:true },
      { field: 'ID', title: 'ID', width: 250, align:'center',sortable:true},
      { field: 'AUTH', title: '권한', width: 250, align:'center',sortable:true},
      { field: 'PHONE_NUM', title: '전화번호', width: 250, align:'center',sortable:true},
      { field: 'EMAIL', title: '이메일', width: 250, align:'center',sortable:true},
   ]],
   singleSelect:true,
})

//직원코드 Select
inputFlowCode = FLOW_CODE.Text;
console.log("FLOW_CODE.Text",FLOW_CODE);
var sql = `select FLOW_CODE,LAB_NAME, ID, AUTH, PHONE_NUM, EMAIL from tb_employee where FLOW_CODE="F01" `;

// var sql1= ` FLOW_CODE="${inputFlowCode}" `;

// if(inputFlowCode.length>0){
//     sql+=sqlw;
//     if((inputFlowCode.length>0)){
//         sql+=sql1; 
//     }
// }
console.log(sql);
SQLExecute1('smsql',0,sql,function(data){
    var dataArray = data.data.records;
    console.log("dataArray:",dataArray);
    if(data.errorCode === 0){
        console.log("오류없음");
        console.log('data',dataArray);
        $(Datagrid1.id).datagrid({
            data:dataArray
        });
    }
    else alert(data.message);
    console.log("오류 발생");
})

$(FLOW_CODE.id).textbox('textbox').bind('keydown',function(e){
    if(e.key==='Enter')$(emp_select.id).click();
});

