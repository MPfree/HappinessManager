var indicators = []
var weights = []
var colors = []

function executePieChart(){
  fetchIndicatorWeights().then(setPieChartColors).then(renderPieChart)
}

function fetchIndicatorWeights(){
  return new Promise((resolve, reject)=>{
    $.get('/happy/api/getIndicatorWeights', function render(indicatorWeights){
      indicators = indicatorWeights["indicators"]
      weights = indicatorWeights["weights"]
      if (indicators && weights){
        resolve()
      }
      else{
        reject()
      }
    })
  })
}

function setPieChartColors(){
  return new Promise((resolve, reject)=>{
    $.get("/static/happy/happiness_indicators_metadata.json", function parse(indicatorColors){
      console.log(typeof(indicatorColors))
      /* Match the indicators to their label using their verbose names. Add the corresponding color */
      for (let i=0; i<indicators.length; i++){
          let indicator = indicators[i].toLowerCase()
          let indicatorMetadata = indicatorColors[indicator]
          colors[i] = indicatorMetadata["color"]
      }
      if(colors.length>0){
        resolve()
      }else{
        reject()
      }
  })
  })

  
}

function renderPieChart() {
  var ctx = document.getElementById("myPieChart").getContext('2d');
  let indicatorWeights = weights
  let indicatorLabels = indicators
  let indicatorColors = colors
  var myPieChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
          labels: indicatorLabels,
          datasets: [{
              label: 'Happiness Factors',
              data: indicatorWeights,
              backgroundColor: indicatorColors
          }]
      },
  });
  myPieChart.update()
}


