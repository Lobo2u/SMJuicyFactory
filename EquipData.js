let FLOW_CODE_1 = $(Combobox1.id).combobox('getText');

console.log('FLOW_CODE_1 : ', FLOW_CODE_1);


//날짜 값 
let startDate = $('#' + DateBox1.id).datebox('getValue');
let endDate = $('#' + DateBox2.id).datebox('getValue');

console.log('startDate : ', startDate);
console.log('endDate : ', endDate);


// sql 문

var sql = `select FLOW_CODE as "공정코드", date_format(DATA_TIME, '%y-%m-%d') as "날짜",round(TEMP,2) as "온도", round(HUMI,2) as "습도", LUX as "조도" from tb_data `;

var sqlw = `where TEMP != 0 and HUMI != 0 and LUX != 0 `;

var and = `and `;

var sql1 = `FLOW_CODE = '${FLOW_CODE_1}' `;

var sql2 = `DATE(DATA_TIME) BETWEEN '${startDate}' AND '${endDate}' `;

var sql2_1 = `DATE(DATA_TIME) >= '${startDate}' `;

var sql2_2 = `DATE(DATA_TIME) <= '${endDate}' `;

var sqlg = `group by date_format(DATA_TIME, '%y-%m-%d'), FLOW_CODE order by 날짜 `;

var end = `;`;

// sql = `select FLOW_CODE as "공정코드", date_format(DATA_TIME, '%y-%m-%d') as "날짜",round(TEMP,2) as "온도", round(HUMI,2) as "습도", LUX as "조도" from tb_data 
//     where FLOW_CODE = '${FLOW_CODE_1}' and TEMP != 0 and HUMI != 0 
//     and LUX != 0 and DATE(DATA_TIME) BETWEEN '${startDate}' AND '${endDate}'
//     group by date_format(DATA_TIME, '%y-%m-%d');`;
	

if(FLOW_CODE_1.length <= 0){
    sql = sql + sqlw;
    if(startDate.length > 0 && endDate.length <= 0){
        sql = sql + and + sql2_1;
    } else if(startDate.length <= 0 && endDate.length > 0){
        sql = sql + and + sql2_2;
    } else if(startDate.length > 0 && endDate.length > 0){
        sql = sql + and + sql2;
    }
    sql = sql + sqlg + end;
}
else if(FLOW_CODE_1.length > 0){
    sql = sql + sqlw + and + sql1;
    
    if(startDate.length > 0 && endDate.length <= 0){
        sql = sql + and + sql2_1;
    } else if(startDate.length <= 0 && endDate.length > 0){
        sql = sql + and + sql2_2;
    } else if(startDate.length > 0 && endDate.length > 0){
        sql = sql + and + sql2;
    }
    sql = sql + sqlg + end;
    
}

    console.log('sql : ', sql);

    SQLExecute1('smsql', 0, sql, function(data){
    var dataArray = data.data.records;
    console.log('data : ', dataArray);
    
    
    var xaxisArray = [];
    var FlowArray = [];
    var TempArray = [];
    var HumiArray = []; 
    var LuxArray = []; 
    
    if(data.errorCode === 0){
        for(const row of dataArray){
        xaxisArray.push(row.날짜);
        FlowArray.push(row.공정코드);
        TempArray.push(row.온도);
        HumiArray.push(row.습도);
        LuxArray.push(row.조도 / 10);
    }
        console.log('xaxisArray = ', xaxisArray);
        console.log('FlowArray = ', FlowArray);
        console.log('TempArray = ', TempArray);
        console.log('HumiArray = ', HumiArray);
        console.log('LuxArray = ', LuxArray);
        
        $(Datagrid1.id).datagrid({
            data: dataArray
        });
        
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
              data: ['온도','습도', '조도 / 10']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xaxisArray
            },
            yAxis: [
                {
                  type: 'value'
                }
            ],

            series: [
                {
                  name: '온도',
                  type: 'line',
                  data: TempArray
                },
                {
                  name: '습도',
                  type: 'line',
                  data: HumiArray
                },
                {
                  name: '조도 / 10',
                  type: 'line',
                  data: LuxArray
                }
            ]
        };
        CustomCharts1.$Children.echart.setOption(option);
    }
    else alert(data.message);
});
