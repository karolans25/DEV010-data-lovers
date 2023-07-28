export const chartData = (theData, ...element) => {
  const labels = Object.keys(theData);
  const values = Object.values(theData);
  const graph = element[0];
  const backgroundColor = Array(Object.keys(theData).length).fill('rgba(54, 162, 235, 0.2)'); // Color de fondo
  const borderColor = Array(Object.keys(theData).length).fill('rgba(54, 162, 235, 1)'); // Color del borde
  if (element.length > 1){
    borderColor[labels.indexOf(element[1])] = 'rgba(240, 99, 132, 1)';
    backgroundColor[labels.indexOf(element[1])] = 'rgba(240, 99, 132, 0.6)';
  }

  // Podemos tener varios conjuntos de datos. Comencemos con uno
  const dataGini = {
    label: "Gini Index",
    data: values, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
    backgroundColor: backgroundColor, // Color de fondo
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

  if(window.grafica){
    window.grafica.clear();
    window.grafica.destroy();
  }

  // eslint-disable-next-line no-undef
  window.grafica = new Chart(graph, {
    type: 'horizontalBar',// Tipo de gráfica
    data: {
      labels: labels,
      datasets: [
        dataGini,
      // Aquí más datos...
      ]
    },
    options: chartOptions
  });
};

export const chartDataYear = (theData, element) => {
  const labels = Object.keys(theData);
  const values = Object.values(theData);
  const graph = element;
  // Podemos tener varios conjuntos de datos. Comencemos con uno
  const dataGini = {
    label: "Gini Index",
    data: values, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
    borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
    borderWidth: 1,// Ancho del borde
    hoverBorderWidth: 0
  };

  if(window.grafica){
    window.grafica.clear();
    window.grafica.destroy();
  }
  
  // eslint-disable-next-line no-undef
  window.grafica = new Chart(graph, {
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
  });

};