/**
 * =============================================================================
 * Functions:
 * =============================================================================
 * Exported:
 * ---------------------------------------------------------------------------- 
 * chartData(theData, ...element)
 * 
 * pieData = (theData, element)
 * =============================================================================
*/
export const chartData = (theData, ...element) => {
  // element[0]: canvas element
  // element[1]: 0 por year, 1 global
  // element[2]: tipo de gráfico 'bar' o 'horizontalBar'
  // element[3]: options
  const labels = Object.keys(theData);
  const values = Object.values(theData);
  const graph = element[0];
  const ctx = graph.getContext('2d');
  let colorBg, borderColor, chartOptions;
  if(element[1] === 0){ // Gini Index per year
    colorBg = Array(Object.keys(theData).length).fill('rgba(54, 162, 235, 0.7)');
    borderColor = Array(Object.keys(theData).length).fill('rgba(54, 162, 235, 1)'); // Color del borde
    chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
      },
    };
  } else if (element[1] === 1){ // Gini Index Global
    colorBg = ctx.createLinearGradient(0,0, 0, 2500);
    colorBg.addColorStop(0, 'red');
    colorBg.addColorStop(0.4, 'lightyellow');
    colorBg.addColorStop(0.7, 'lightyellow');
    colorBg.addColorStop(1, 'green');
    borderColor = 'rgba(54, 162, 235, 1)';
    chartOptions = {
      scales: {
        yAxes: [{
          barPercentage: 0.5
        }]
      },
      elements: {
        rectangle: {
          borderSkipped: 'left',
        }
      }
    };
  } else if (element[1] === 2){ // Tipo de gráfico
    colorBg = [
      'lightblue',
      'lightgreen',
      'lightpink',
      'lightseagreen',
      'lightyellow',
      'lightcoral',
    ],// Color de fondo
    borderColor = [
      'lightblue',
      'lightgreen',
      'lightpink',
      'lightseagreen',
      'lightyellow',
      'lightcoral',
    ],// Color del borde
    chartOptions = {};
  }

  const dataGini = {
    label: "Gini Index",
    data: values, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
    backgroundColor: colorBg, // Color de fondo
    borderColor: borderColor, // Color del borde
    borderWidth: 1,// Ancho del borde
    hoverBorderWidth: 0
  };

  const config = {
    type: 'horizontalBar',// Tipo de gráfica
    data: {
      labels: labels,
      datasets: [
        dataGini,
      // Aquí más datos...
      ]
    },
    options: chartOptions
  };

  if(element[1] === 2){
    config.type = 'pie'; //or dougnhut
  }

  // eslint-disable-next-line no-undef
  const chart = new Chart(graph, config);
  return chart;
};

export const pieData = (theData, element) => {
  const labels = Object.keys(theData);
  const values = Object.values(theData);
  const graph = element;

  const dataGini = {
    label: "Gini Indexes reported in 2022",
    data: values, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Color de fondo
    borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
    borderWidth: 1,// Ancho del borde
    hoverBorderWidth: 0
  };

  const config = {
    type: 'pie',// Tipo de gráfica
    data: {
      labels: labels,
      datasets: [
        dataGini,
      ]
    },
  };

  // eslint-disable-next-line no-undef
  const chart = new Chart(graph, config);
  return chart;
};
