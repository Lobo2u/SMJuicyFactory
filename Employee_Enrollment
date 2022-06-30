const sql = `select FLOW_CODE,FLOW_NAME from tb_flow;`;

SQLExecute1('smsql',0,sql,function(data){
    let dataArray = data.data.records;
    var newItem = [];
    console.log("newItem:",newItem)
    
    for(let i in dataArray){
      newItem.push({value:dataArray[i].FLOW_CODE});
      console.log("data:",data);
    }
    
    
    if(data.errorCode===0){
        $(FLOW_COD.id).combobox({
            value:'FLOW_CODE 선택',
            valueField:'value',
            textField:'value',
            panelHeight:'auto',
            data:newItem,           
            onSelect:function(rec){
                console.log(rec);
            }
        });
        
    }
        else alert(data.message);
        
    });
    
    
const insertFlowCode=FLOW_COD.combobox.getValue();
console.log("insertFlowCode:",insertFlowCode);
const insertLabName=LAB_NAME.Text;
const insertId=ID.Text;
const insertPw=PW.Text;
const insertAuth=AUTH.Text;
const insertPhoneNum=PHONE_NUM.Text;
const insertEmail=EMAIL.Text;

const sql = `insert into tb_employee values('${insertFlowCode}','${insertLabName}','${insertId}','${insertPw}','${insertAuth}','${insertPhoneNum}','${insertEmail}');`;
console.log(sql);

SQLExecute1('smsql',1,sql,function(data){
    if(data.errorCode === 0){
        console.log("성공")
        $.messager.show({
            title:'Message',
            msg:'추가 완료',
            timeout:1000,
            showType:'slide'
        });
        $($System.$PicManager['직원관리'].$Children.emp_select.id).click();
        ClosePicture('직원정보등록');
    }
    else alert(data.message);
    console.log("실패");
});
