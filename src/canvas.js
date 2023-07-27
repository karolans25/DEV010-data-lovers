/*
let ctx;// = document.getElementById('gini-canvas');
let labels, values; 

export const chartData = (theData) => {
  labels = Object.keys(theData);
  values = Object.values(theData);
  //ctx = theElement;
  ctx = document.getElementById('gini-canvas');
};

const data = {
  labels: labels,
  dataSets: [{
    label: "Gini index",
    data: values,
    backgroundColor: 'rgba(9, 129, 176, 0.2)'
  }]
};

const config = {
  type: 'bar',
  data: data,

  options: {
    scales:{ 
      yAxes:[{ 
        ticks: { 
          beginAtZero:true 
        } 
      }] 
    } 
  }

};

const myChart = new Chart(ctx, config);
*/

// Obtener una referencia al elemento canvas del DOM
const $grafica = document.querySelector("#gini-canvas");
// Las etiquetas son las que van en el eje X. 
//const etiquetas = ["Enero", "Febrero", "Marzo", "Abril"]

let labels, values;
export const chartData = (theData) => {
  labels = Object.keys(theData);
  values = Object.values(theData);
  //ctx = theElement;
  //ctx = document.getElementById('gini-canvas');
};
  
// Podemos tener varios conjuntos de datos. Comencemos con uno
const dataGini = {
  label: "Gine Index",
  data: values, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
  backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
  borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
  borderWidth: 1,// Ancho del borde
};

// eslint-disable-next-line no-undef
new Chart($grafica, {
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