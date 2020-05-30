let indicators = []
let weights = []

function execute(){
  fetchIndicatorWeights().then(renderPieChart())
}

function fetchIndicatorWeights(){
  return new Promise((resolve, reject)=>{
    $.get('/happy/api/getIndicatorWeights', function render(indicatorWeights){
      let indicatorWeightsJson = JSON.parse(indicatorWeights)
      indicators = indicatorWeightsJson["indicators"]
      weights = indicatorWeightsJson["weights"]
      if (indicators && weights){
        resolve()
      }
      else{
        reject()
      }
    })
  })
  
}

function renderPieChart() {
  var ctx = document.getElementById("myPieChart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
          labels: indicators,
          datasets: [{
              label: 'Happiness Factors',
              data: weights,
              backgroundColor: ["#ff99cc", "#dd99ff", "#b3e6ff", "#b3ffb3", "#ffff80", "#aaff80"]
          }]
      },
  });
}


