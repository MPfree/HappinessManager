let myChart = document.getElementById('myChart').getContext('2d');
var happyChart = null

function renderChart(indicatorNames){
        var indicatorLabels = []
        for (const [key, value] of Object.entries(indicatorNames)){
            indicatorLabels.push(value)
        }
        let colors = getColors(indicatorLabels)

        happyChart = new Chart(myChart, {
        type:'bar',
        data:{
            labels: indicatorLabels,
            datasets:[{
                label:'Indicators',
                data:[],
                backgroundColor: colors
                
    
            }],
        },
        options:{}
    
    });
}

function getColors(labels){
    var colors = []

    $.get("/static/happy/happiness_indicators_metadata.json", function parse(indicators){
        console.log(typeof(indicators))
        
        for (const [key, value] of Object.entries(indicators)){
            let verbose = value["name"]
            let position = labels.indexOf(verbose) 
            colors[position]= value["color"]
        }

    })
    return colors
}


function updateData(period_name){
    var param = {period_name: period_name}
    $.get("/happy/api/datefiltereddata", param, function convertData(indicators){
        console.log(indicators)
        var indicators_obj = JSON.parse(indicators)
        var indicator_array = []
        var labelNames = happyChart.data.labels

        for (const [key, value] of Object.entries(indicators_obj)){
            let position = labelNames.indexOf(key)
            indicator_array[position]= value
        }
        console.log(indicator_array.length)
        changeChartData(indicator_array)

    })

    function changeChartData(newData){
        happyChart.data.datasets[0].data = newData
        happyChart.update();
    }
    
}
    
    