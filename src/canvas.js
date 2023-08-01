/**
 * =============================================================================
 * Functions:
 * =============================================================================
 * Exported:
 * ---------------------------------------------------------------------------- 
 * chartDataYear(theData, element)
 * 
 * chartData(theData, ...element)
 * 
 * pieData = (theData, element)
 * =============================================================================
*/
export const chartDataYear = (theData, element) => {
  const labels = Object.keys(theData);
  const values = Object.values(theData);
  const graph = element;

  // Podemos tener varios conjuntos de datos. Comencemos con uno
  const dataGini = {
    label: "Gini Indexes reported in 2022",
    data: values, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Color de fondo
    borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
    borderWidth: 1,// Ancho del borde
    hoverBorderWidth: 0
  };

  const config = {
    type: 'bar',// Tipo de gráfica
    data: {
      labels: labels,
      datasets: [
        dataGini,
      // Aquí más datos...
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
      },
    }
  };

  // eslint-disable-next-line no-undef
  const chart = new Chart(graph, config);
  return chart;
};

export const chartData = (theData, ...element) => {
  const labels = Object.keys(theData);
  const values = Object.values(theData);
  const graph = element[0];
  const ctx = graph.getContext('2d');
  const gradientBg = ctx.createLinearGradient(0,0, 0, 2500);
  gradientBg.addColorStop(0, 'red');
  gradientBg.addColorStop(0.4, 'yellow');
  gradientBg.addColorStop(0.7, 'yellow');
  gradientBg.addColorStop(1, 'green');
  const borderColor = Array(Object.keys(theData).length).fill('rgba(54, 162, 235, 1)'); // Color del borde
   
  // Podemos tener varios conjuntos de datos. Comencemos con uno
  const dataGini = {
    label: "Gini Index",
    data: values, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
    backgroundColor: gradientBg, // Color de fondo
    borderColor: borderColor, // Color del borde
    borderWidth: 1,// Ancho del borde
    hoverBorderWidth: 0
  };

  const chartOptions = {
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

  // eslint-disable-next-line no-undef
  const chart = new Chart(graph, config);
  return chart;
};

export const pieData = (theData, element) => {
  const labels = Object.keys(theData);
  const values = Object.values(theData);
  const graph = element;

  // Podemos tener varios conjuntos de datos. Comencemos con uno
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
      // Aquí más datos...
      ]
    },
    // options: {
    //   scales: {
    //     yAxes: [{
    //       ticks: {
    //         beginAtZero: true
    //       }
    //     }],
    //   },
    // }
  };

  // eslint-disable-next-line no-undef
  const chart = new Chart(graph, config);
  return chart;
};
