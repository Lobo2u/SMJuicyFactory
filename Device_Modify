const pn = $System.$PicManager['디바이스관리'].$Children;
const selectedRow = $(pn.Datagrid2.id).datagrid('getSelected');
console.log('selectedRow',selectedRow);

FLOW_CODE.Text=selectedRow.FLOW_CODE;
FLOW_NAME.Text=selectedRow.FLOW_NAME;
EQU_NAME.Text=selectedRow.EQU_NAME;
IF_INFO.Text=selectedRow.IF_INFO;
RMK.Text=selectedRow.RMK;


 selectedRow = $($System.$PicManager['디바이스관리'].$Children.Datagrid2.id).datagrid('getSelected');
console.log('selectedRow',selectedRow);

const inputFlowCode=FLOW_CODE.Text;
const newFlowName = FLOW_NAME.Text;
//const EQUCODE;
const inputEquCode=selectedRow.EQU_CODE;
const newEquName = EQU_NAME.Text;
const newIfInfo = IF_INFO.Text;
const newRmk = RMK.Text;


const sql = `update tb_device set FLOW_NAME='${newFlowName}',EQU_NAME='${newEquName}',IF_INFO='${newIfInfo}',RMK='${newRmk}' where FLOW_CODE='${inputFlowCode}' and EQU_CODE='${inputEquCode}';`;
console.log("sql:",sql)
SQLExecute1('smsql',0,sql,function(data){
    if(data.errorCode===0){
        $.messager.show({
            title:'Message',
            msg:'수정 완료',
            timeout:1000,
            showType:'slide'
        });
        $($System.$PicManager['디바이스관리'].$Children.device_read.id).click();
        ClosePicture('디바이스수정');
    }
});
