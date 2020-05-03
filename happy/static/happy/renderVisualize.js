var indicatorData={}

function renderLineChart(){
    addButtons()
    setColors()
    var dateData = {
        data: [],
        filteredData: [],
        color: '',
        state: false,
        loaded: false
    }
    indicatorData["date"] = dateData
    getIndicatorData("date")
    convertDates()
}

function convertDates(){
    let dates = indicatorData["date"]
    for (index in dates){
        let date = moment(dates[index], 'YYYYMMDD')
        dates[index] = date
    }
}

function addButtons(){
    $.get('/happy/api/getIndicatorNames', function(data){
        indicator_names = JSON.parse(data);
        buttonParent = document.getElementById("indicatorbuttons")
        for (const [key, value] of Object.entries(indicator_names)){
            let button = document.createElement("button");
            button.id=key
            button.addEventListener("click", buttonClick)
            button.innerHTML=value;
            buttonParent.appendChild(button);

            var indicator={
                data: [],
                filteredData: [],
                color: '',
                state: false,
                loaded: false
            }

            indicatorData[key]= indicator
        }

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
            getIndicatorData(id)
        }
    }
    else{
        button.style.backgroundColor = indicatorData[id].color
        button.style.color = "white"
        indicatorData[id].state = false

    }
    
}

function getIndicatorData(name){
    var param = {indicator_name: name}
    $.get("/happy/api/singleindicatordata", param, function setIndicatorData(data){
        console.log(data)
        console.log("horse")

        for (const [key, value] of Object.entries(data["indicator_data"])){
            indicatorData[name].data.push(value[name])
        }        
    })
}