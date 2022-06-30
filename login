var user =  Textbox1.Text;
console.log('user : ', user);

var pw = Textbox2.Text;

var sql = select * from tb_employee where ID = '${user}' and PW = '${pw}';;
console.log(sql);

SQLExecute1('smsql', 0, sql, function(data) {
    var dataArray = data.data.records;

    if(data.errorCode === 0){
        console.log('data', dataArray);
        if(dataArray.length !==0){
            console.log('exist');
            sessionStorage.setItem('user', user);
            ShowPage('메인프레임', 0);
        }
        else{
            console.log('not exist');
            $.messager.alert('로그인정보에러','로그인 정보가 맞지 않습니다!!!', 'error');
        }
    }
    else alert(data.message);
});
