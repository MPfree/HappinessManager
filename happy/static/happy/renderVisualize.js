var indicatorData={}
var indicatorNames = {}
var indicatorPositions = {}
let lineChartCanvas = document.getElementById('lineChart').getContext('2d');
var lineChart = null

async function renderLineChart(){
    await addIndicatorButtons()
    await getIndicatorData("date")
    setColors()
    convertDates()
    renderChart()
}

function renderChart(){
    
    lineChart = new Chart(lineChartCanvas, {
        type:'line',
        data:{
            labels: indicatorData["date"].filteredData,
            datasets:createDataSets(),
        },
        options:{
            scales: {
                yAxes:[
                    {
                        display:true,
                        scaleLabel: {
                            display:true,
                            labelString: "Rating"
                        },
                        id: 'hours',
                        type: 'linear',
                        position: 'left',
                        ticks:{
                            beginAtZero: true,
                            suggestedMax: 10
                        }
                    }
                ]
            }
        }

    });

    createIndicatorPositions()
    updateChart("happy")
    button = document.getElementById("happy")
    button.style.backgroundColor = "white";
    button.style.color = "black"
    indicatorData["happy"].state = true
    indicatorData["happy"].loaded = true
}

function createDataSets(){
    let dataSets = []
    for (const [key, value] of Object.entries(indicatorData)){
        let dataSet = {
            label: indicatorNames[key],
            data:[],
            showLine: false,
            fill: false,
            pointRadius: 3,
            borderColor: "rgb(247,247,235,0.5)",
            yAxisID: "hours"
        }
        dataSets.push(dataSet)
    }
    return dataSets
}

function createIndicatorPositions(){
    let datasets = lineChart.data.datasets
    var i;
    for(i=0; i<datasets.length; i++){
        let indicatorLabel = datasets[i].label
        indicatorPositions[indicatorLabel]= i
    }
}

function convertDates(){
    let dates = indicatorData["date"].data
    let formattedDates = indicatorData["date"].filteredData
    for (index in dates){
        let date = moment(dates[index])
        let formattedDate = moment(dates[index]).format('MMMM DD, YYYY')
        dates[index] = date
        formattedDates[index] = formattedDate
    }
    
    
}

function addIndicatorButtons(){
    return new Promise((resolve, reject) => {
        $.get('/happy/api/getIndicatorNames', function(data){
            if(data){
                indicator_names = JSON.parse(data);
            indicatorNames = indicator_names
            buttonParent = document.getElementById("buttonsList")
            for (const [key, value] of Object.entries(indicator_names)){
                let button = document.createElement("button");
                button.id=key
                button.className = "ui button listButton"
                button.addEventListener("click", buttonClick)
                button.innerHTML=value;
                let listElement = document.createElement("li")
                listElement.appendChild(button)
                buttonParent.appendChild(listElement);
    
                var indicator={
                    data: [],
                    filteredData: [],
                    color: '',
                    state: false,
                    loaded: false
                }
    
                indicatorData[key]= indicator
            }
    
            var dateData = {
                data: [],
                filteredData: [],
                color: '',
                state: false,
                loaded: false
            }
            indicatorData["date"] = dateData
            resolve();

            }
            else{
                reject();
            }
            
        })
    })
    
}

function setColors(labels){
    var colors = []

    $.get("/static/happy/happiness_indicators_metadata.json", function parse(indicators){
        console.log(typeof(indicators))
        /* Match the indicators to their label using their verbose names. Add the corresponding color */
        for (const [key, value] of Object.entries(indicators)){
            indicatorData[key].color = value["color"]
            let button = document.getElementById(key)
            button.style.backgroundColor = value["color"]
            button.style.borderColor = value["color"]
            button.style.borderWidth = "1px"
            button.style.borderStyle = "solid"
        }
    })
}

function buttonClick(event){
    let id = event.currentTarget.id
    let state = indicatorData[id].state
    let button = document.getElementById(event.currentTarget.id);
    if(!state){
        button.style.backgroundColor = "white";
        button.style.color = "black"
        indicatorData[id].state = true
        let loaded = indicatorData[id].loaded
        if(!loaded){
            indicatorData[id].loaded = true
            updateChart(id)
        }
        else{
            let label = indicatorNames[id]
            let indicatorPosition = indicatorPositions[label]
            lineChart.data.datasets[indicatorPosition].showLine = true
            lineChart.data.datasets[indicatorPosition].pointRadius = 3
            lineChart.update()
        }
        
    }
    else{
        button.style.backgroundColor = indicatorData[id].color
        button.style.color = "white"
        indicatorData[id].state = false
        let label = indicatorNames[id]
        let indicatorPosition = indicatorPositions[label]
        lineChart.data.datasets[indicatorPosition].showLine = false
        lineChart.data.datasets[indicatorPosition].pointRadius = 0
        lineChart.update()

    }
    
}

async function updateChart(name){
    await getIndicatorData(name);
    let label = indicatorNames[name]
    let indicatorPosition = indicatorPositions[label]
    setTimeout(()=>{
        lineChart.data.datasets[indicatorPosition].data = indicatorData[name].data
        lineChart.data.datasets[indicatorPosition].borderColor = indicatorData[name].color
        lineChart.data.datasets[indicatorPosition].showLine = true
        lineChart.update()
    }, 250)
    
}

function getIndicatorData(name){
    return new Promise((resolve, reject) => {
        var param = {indicator_name: name}
        $.get("/happy/api/singleindicatordata", param, function setIndicatorData(data){
            if(data){
                console.log(data)

                for (const [key, value] of Object.entries(data["indicator_data"])){
                    indicatorData[name].data.push(value[name])
                }   
                resolve();
            }
            else{
                reject();
            }
                 
        })
    })
    
}

function applyDateFilter(){
    let range = getDateIndexes()
    let lowerRangeIndex = range[0]
    let upperRangeIndex = range[1]
    let nonFilteredDate = indicatorData["date"].filteredData
    let filteredDate = nonFilteredDate.slice(lowerRangeIndex, upperRangeIndex+1)
    lineChart.data.labels = filteredDate
    lineChart.update()
    
}

function getDateIndexes(){
    let startDateString = document.getElementById("start").value
    let startDate = moment(startDateString)
    let endDateString = document.getElementById("end").value
    let endDate = moment(endDateString)
    let dates = indicatorData["date"].data
    let upperRangeIndex = dates.length - 1
    let lowerRangeIndex = 0
    let index;
    for (index = dates.length - 1;index>0; index--){
        let date = dates[index]
        let diff = date.diff(endDate)
        if(diff<=0){
            upperRangeIndex = index
            break
        }
    }
    
    for(index = 0; index<dates.length; index++){
        let date = dates[index]
        let diff = startDate.diff(date)
        if(diff <=0){
            lowerRangeIndex = index
            break;
        }
    }

    return [lowerRangeIndex, upperRangeIndex]

}
//not being used right now. Save it in case
function updateChartWithDateFilteredData(){
    for(const [key, value] of Object.entries(indicatorData)){
        let label = indicatorNames[key]
        let chartDataPosition = indicatorPositions[label]
        lineChart.data.datasets[chartDataPosition].data = indicatorData[key].filteredData
    }
    let range = getDateIndexes()
    let lowerRangeIndex = range[0]
    let upperRangeIndex = range[1]
    let nonFilteredDate = indicatorData["date"].filteredData
    let filteredDate = nonFilteredDate.slice(lowerRangeIndex, upperRangeIndex)
    lineChart.data.labels = filteredDate
    lineChart.update()
}