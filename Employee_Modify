const pn = $System.$PicManager['직원관리'].$Children;
const selectedRow = $(pn.Datagrid1.id).datagrid('getSelected');
console.log('selectedRow',selectedRow);

FLOW_CODE.Text=selectedRow.FLOW_CODE;
LAB_NAME.Text=selectedRow.LAB_NAME;
ID.Text=selectedRow.ID;
AUTH.Text=selectedRow.AUTH;
PHONE_NUM.Text=selectedRow.PHONE_NUM;
EMAIL.Text=selectedRow.EMAIL;

const inputFlowCode=FLOW_CODE.Text;
const inputLabName=LAB_NAME.Text;
const inputId=ID.Text;
const inputPw=PW.Text;
const inputAuth=AUTH.Text;
const inputPhoneNum=PHONE_NUM.Text;
const inputEmail=EMAIL.Text;

const sql = `UPDATE tb_employee SET ID='${inputId}',PW='${inputPw}',AUTH='${inputAuth}',PHONE_NUM='${inputPhoneNum}',EMAIL='${inputEmail}' WHERE FLOW_CODE='${inputFlowCode}' AND LAB_NAME='${inputLabName}';`;

console.log(sql);
SQLExecute1("smsql",1,sql,function(db){
    if(db.errorCode===0){
         $.messager.show({
                title:'Message',
                msg:'수정완료',
                timeout:1000,
                showType:'slide'
            });
            console.log($System.$PicManager['직원관리'].$Children);
            $($System.$PicManager['직원관리'].$Children.emp_select.id).click();
        ClosePicture("직원정보수정");
    }
    else alert(db.message);
})
