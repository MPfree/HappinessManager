

function renderChart(data, labels) {
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
          labels: labels,
          datasets: [{
              label: 'Happiness Factors',
              data: data,
              backgroundColor: ["#ff99cc", "#dd99ff", "#b3e6ff", "#b3ffb3", "#ffff80", "#aaff80"]
          }]
      },
  });
}

/// GET THE PYTHON OUTPUT AND USE HERE 

$( document ).ready(
  function () {
    labels = ['Weather', 'Social', 'Metime', 'Exercise', 'Sleep', 'SocialMedia'];
    data = [25.5, 22.6, 17.0, 14.8, 11.2, 8.9];
    renderChart(data, labels);
  }
);

