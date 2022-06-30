const checked = $(Datagrid1.id).datagrid('getChecked');
console.log("checked:",checked);
var sql=``;

for(const row of checked){
    console.log("row:",row);
    sql+=`delete from tb_employee where flow_code='${row.FLOW_CODE}'and ID='${row.ID}';`;
}

console.log(sql);

SQLExecute1('smsql',0,sql,function(data){
    if(data.errorCode === 0){
        $.messager.show({
            title:'Message',
            msg:'삭제 완료',
            timeout:1000,
            showType:'slide'
        });
        $(emp_select.id).click();
    }
    else alert(data.message);
})
