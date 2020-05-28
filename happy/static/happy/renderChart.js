let myChart = document.getElementById('myChart').getContext('2d');
var happyChart = null
var indicator_names = null

/* Use the verbose UserHappinessModel fields to render the chart with labels and colors */
function initializeChart(){
    $.get('/happy/api/getIndicatorNames', function(data){
        indicator_names = JSON.parse(data)
        renderChart(indicator_names)
        updateData('yesterday')
    })
    
}

function renderChart(){
        var indicatorLabels = []
        for (const [key, value] of Object.entries(indicator_names)){
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
        options:{
            scales: {
                yAxes:[{
                    ticks:{
                        beginAtZero: true,
                        suggestedMax: 10
                    }
                }]
            }
        }
    
    });
}

/* Use the indicator metadata json file to add colors to the graph */
function getColors(labels){
    var colors = []

    $.get("/static/happy/happiness_indicators_metadata.json", function parse(indicators){
        console.log(typeof(indicators))
        /* Match the indicators to their label using their verbose names. Add the corresponding color */
        for (const [key, value] of Object.entries(indicators)){
            let verbose = value["name"]
            let position = labels.indexOf(verbose) 
            colors[position]= value["color"]
        }

    })
    return colors
}

/* Use the verbose names of the indicators and labels to place the indicator value in the correct indicator array indices */
function updateData(period_name){
    var param = {period_name: period_name}
    $.get("/happy/api/datefiltereddata", param, function convertData(indicators){
        console.log(indicators)
        var indicators_obj = indicators
        var verbose_indicators_obj = {}

        for (const [key, value] of Object.entries(indicators_obj)){
            let verbose_name = indicator_names[key]
            verbose_indicators_obj[verbose_name]= value
        }


        var indicator_array = []
        var labelNames = happyChart.data.labels

        for (const [key, value] of Object.entries(verbose_indicators_obj)){
            let position = labelNames.indexOf(key)
            indicator_array[position]= value
        }
        console.log(indicator_array.length)
        changeChart(indicator_array, period_name)
    })
}
    
/* change the chart data */
function changeChart(newData, period_name){
    if(newData.length>0){
        happyChart.data.datasets[0].data = newData
        updateChartTitle(period_name)
        happyChart.update();
    }
    else{
        let noDataMessage = document.getElementById("noDataMessage")
        noDataMessage.style.display = "block"
    }
   
}

function updateChartTitle(periodName){
    if (periodName.includes('past')){
        periodName = periodName.replace('past', 'past ')
    }
    if (periodName.includes('all')){
        periodName = periodName.replace('all', 'all ')
    }
    let chartTitle = document.getElementById("chartTitle")
    chartTitle.innerHTML = `Showing data for: ${periodName}`
}

function getDateData(){
    let date = document.getElementById("date").value
    let formattedDate = moment(date).format("YYYY-MM-DD")
    console.log(formattedDate)
    updateData(formattedDate)
}

function closeNoDataMessage(){
    let noDataMessage = document.getElementById("noDataMessage")
    noDataMessage.style.display = "none"
}
        
    

    
    