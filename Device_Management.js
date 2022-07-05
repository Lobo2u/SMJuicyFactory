
$(FLOW_CODE.id).textbox('textbox').bind('keydown',function(e){
    if(e.key==='Enter')$(device_read.id).click();
});
$(EQU_NAME.id).textbox('textbox').bind('keydown',function(e){
    if(e.key==='Enter')$(device_read.id).click();
});

$('#' + id).datagrid({
   columns: [[
      { field: 'ck',checkbox:true},
      { field: 'FLOW_CODE', title: '공정코드', width: 250, align:'center',sortable:true,
           sorter:function(a,b){
                a = a.split('/');
                b = b.split('/');
                if (a[2] == b[2]){
                    if (a[0] == b[0]){
                        return (a[1]>b[1]?1:-1);
                    } else {
                        return (a[0]>b[0]?1:-1);
                    }
                } else {
                    return (a[2]>b[2]?1:-1);
                }
            }
      },
      { field: 'EQU_CODE', title: '설비코드', width: 250, align:'center',sortalbe:true },
      { field: 'FLOW_NAME', title: '공정명', width: 250, align:'center',sortable:true},
      { field: 'EQU_NAME', title: '설비명', width: 250, align:'center',sortable:true},
      { field: 'IF_INFO', title: 'I/F 정보', width: 250, align:'center',sortable:true},
      { field: 'RMK', title: '비고', width: 250, align:'center',sortable:true},
   ]],
   singleSelect:true,
})

