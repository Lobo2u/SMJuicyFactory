const sql = `select FLOW_CODE,FLOW_NAME from tb_flow;`;

SQLExecute1('smsql',0,sql,function(data){
    let dataArray = data.data.records;
    var newItem = [];
    var newName = [];
    console.log("newItem:",newItem)
    
    for(let i in dataArray){
      newItem.push({label:dataArray[i].FLOW_NAME, value:dataArray[i].FLOW_CODE});
      console.log("data:",data);
    }
    
    
    if(data.errorCode===0){
        $(FLOW_CODE.id).combobox({
            value:'FLOW_CODE 선택',
            valueField:'value',
            textField:'value',
            panelHeight:'auto',
            data:newItem,
            onSelect:function(rec){
                console.log(rec);
                FLOW_NAME.Text=rec.label;
            }            
        });
        
    }
        else alert(data.message);
        
    });

var s_sql=`select EQU_CODE FROM tb_device WHERE FLOW_CODE='f01' order by equ_code desc LIMIT 1;` 
var ecode = '';
console.log("sql:",s_sql);
SQLExecute1('smsql',0,s_sql, function(data){
    if(data.errorCode === 0){
        var dataArray = data.data.records;
        console.log(dataArray);
        if(dataArray.length===0){
            console.log('not exist')
            ecode = 'E001';
            $Variable.ECODE = ecode;
            insertQuery();
        }
        else{
            console.log(Number(dataArray[0].EQU_CODE.slice(1,4)));
            var code=Number(dataArray[0].EQU_CODE.slice(1,4));
            code++;
            n = 'E'+pad(code,3);
            console.log(n);
            $Variable.ECODE = n;
            insertQuery();
        }
        
    }
    
})
function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

