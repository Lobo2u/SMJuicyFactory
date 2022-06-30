const checked = $(Datagrid2.id).datagrid('getChecked');
console.log("checked:",checked);
var sql=``;

for(const row of checked){
    console.log("row:",row);
    sql+=`delete from tb_device where flow_code='${row.FLOW_CODE}'and equ_code='${row.EQU_CODE}';`;
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
        $(device_read.id).click();
    }
    else alert(data.message);
})
