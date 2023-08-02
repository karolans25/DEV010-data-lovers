import {dataJson, filter, sort, search, canvas, densityPopulation} from './data.js';
import {chartData} from './canvas.js';
import {printData, createPaginator, showTable, showCards} from './show.js';

const dir = './data/countries/countries.json';
const lines = 10;
const filterOptions = ['Continents', 'Subregion', 'Languages'];
const subFilterOptions = [[],[],[]];
const arrayOfYears = [];
let totalPages;
let globalData;
let theData;

const navBarToggle = document.querySelector('.toggle');
const navBarButtons = document.querySelector('.links');
const navBarDataButton = document.querySelector('#data-link');
const navBarCalculusButton = document.querySelector('#calculus-link');
const navBarMapButton = document.querySelector('#map-link');

/**
 * Data container
 */
const dataContainer = document.querySelector('#data-container');
const switchBut = document.querySelector('#switch');
const inputSearch = document.querySelector('#search-by');
const selectFilter = document.querySelector('#filter-by');
let selectSubFilter;
const selectSort = document.querySelector('#sort-by');
const ascendingSortBut = document.querySelector('#sort-ascending-button');
const descendingSortBut = document.querySelector('#sort-descending-button');
const pageSelector = document.querySelector('#page-selector');
const backBut = document.querySelector('#back-button');
const forwardBut = document.querySelector('#forward-button');
//Vistas
const table = document.querySelector('table');
const cards = document.querySelector('#cards');

/**
 * Calculus container
 */
const calculusContainer = document.querySelector('#calculus-container');
let chosen = 1;
// Calculus 1: Gini
const calculus1 = document.querySelector('#tab-option-gini');
const contentCalculus1 = document.querySelector('section[data-test="gini-content"]');
const yearSelector = document.querySelector('#year-selector');
// Calculus 2: Population density
const calculus2 = document.querySelector('#tab-option-density');
const contentCalculus2 = document.querySelector('section[data-test="density-content"]');
// Calculus 3: UTC converter
const calculus3 = document.querySelector('#tab-option-clock');
const contentCalculus3 = document.querySelector('section[data-test="clock-content"]');
let chart;

/**
 * Map container
 */
const mapContainer = document.querySelector('#map-container');

//const containerClock = document.querySelector('#clockdate');
  

/**
 * Función para cargar el dataset
 */
async function fetchAndStore() {
  try {
    globalData = await dataJson(dir);
    init();
  } catch (error) {
    console.error(error);
  }
}

function init() {
  startTime();
  totalPages = Math.ceil(globalData.length/lines);
  document.querySelector('nav section h3').innerHTML = "Flags of Countries";
  switchBut.checked = false;
  backBut.disabled = true;
  createPaginator(totalPages, pageSelector);
  createSelectorForFilterBy();
  theData = globalData;
  showCards(theData, cards, parseInt(pageSelector.value) + 1, lines);
  showTable(theData, table, parseInt(pageSelector.value) + 1, lines);
  (switchBut.checked === true) ? cards.style.display = 'none' : table.style.display = 'none';
  createEventListeners();

  /*
  // check if geolocation is supported by the browser
  if ("geolocation" in navigator) {
  // get current position
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log(navigator.geolocation.getCurrentPosition(showPosition));
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  function showPosition(position) {
  // log latitude and longitude
    console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
  }
  // Initialize and add the map
  let map;

  async function initMap() {
  // The location of Uluru
    const position = { lat: position.coords.latitude, lng: position.coords.longitude };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: position,
      mapId: "DEMO_MAP_ID",
    });

    // The marker, positioned at Uluru
    const marker = new AdvancedMarkerView({
      map: map,
      position: position,
      title: "Uluru",
    });
  }

  await initMap();
  */
}

function createEventListeners(){
  // Principal Navigation Bar 
  navBarToggle.addEventListener('click', ()=>{
    navBarToggle.classList.toggle('rotate');
    navBarButtons.classList.toggle('active');
  });
  navBarDataButton.addEventListener('click', () => {
    dataContainer.style.display = "block";
    calculusContainer.style.display = "none";
    mapContainer.style.display = "none";
    showData();
  });
  navBarCalculusButton.addEventListener('click', () => {
    dataContainer.style.display = "none";
    calculusContainer.style.display = "block";
    mapContainer.style.display = "none";
    showCalculus();
  });
  navBarMapButton.addEventListener('click', () => {
    dataContainer.style.display = "none";
    calculusContainer.style.display = "none";
    mapContainer.style.display = "block";
    showMap();
  });

  // Data container
  switchBut.addEventListener('click', (event) => {
    toggleView(event); //cards or table
  });
  inputSearch.addEventListener('keyup', () => {
    searchData();
  });
  selectFilter.addEventListener('change', ()=>{
    filterData();
  });
  ascendingSortBut.addEventListener('click', (event) => {
    sortData(event);
  });
  descendingSortBut.addEventListener('click', (event) => {
    sortData(event);
  });
  pageSelector.addEventListener('change', (event) => {
    moveBetweenPages(event);
  });
  forwardBut.addEventListener('click', (event) => {
    moveBetweenPages(event);
  }); 
  backBut.addEventListener('click', (event) => {
    moveBetweenPages(event);
  });

  // Calculus container
  calculus1.addEventListener('click', () => {
    chosen = 1;
    document.querySelector('section[data-test="gini-content"]').style.display = 'block';
    document.querySelector('section[data-test="density-content"]').style.display = 'none';
    document.querySelector('section[data-test="clock-content"]').style.display = 'none';
    changeOptionCalculus();
  });
  calculus2.addEventListener('click', () => {
    chosen = 2;
    document.querySelector('section[data-test="gini-content"]').style.display = 'none';
    document.querySelector('section[data-test="density-content"]').style.display = 'block';
    document.querySelector('section[data-test="clock-content"]').style.display = 'none';
    changeOptionCalculus();
  });
  calculus3.addEventListener('click', () => {
    chosen = 3;
    document.querySelector('section[data-test="gini-content"]').style.display = 'none';
    document.querySelector('section[data-test="density-content"]').style.display = 'none';
    document.querySelector('section[data-test="clock-content"]').style.display = 'block';
    changeOptionCalculus();
  });
  yearSelector.addEventListener('change', ()=>{
    // graphGiniIndex(0, 'bar');
    graphGiniIndex(0);
  });

}

/**
 * FUnctions for Data View
 */
function showData(){
  navBarToggle.classList.toggle('rotate');
  navBarButtons.classList.toggle('active');
  document.querySelector('nav section h3').innerHTML = "Flags of Countries";
  dataContainer.style.display = "block";
  calculusContainer.style.display = "none";
  mapContainer.style.display = "none";  
}

/**
 * FUnctions for Calculus View
 */
function showCalculus(){
  navBarToggle.classList.toggle('rotate');
  navBarButtons.classList.toggle('active');
  document.querySelector('nav section h3').innerHTML = "Calculus";
  calculusContainer.style.display = "flex";
  calculus1.classList.value = 'tab-option tab-option-active';
  contentCalculus1.classList.value = 'content content-active';
  fillYearSelector();
  // graphGiniIndex(0, 'bar');
  // graphGiniIndex(1, 'horizontalBar');
  graphGiniIndex(0);
  graphGiniIndex(1);
}

function  fillYearSelector(){
  for (let i=0; i<globalData.length; i++){
    if('gini' in globalData[i]){
      if(!arrayOfYears.includes(Object.keys(globalData[i].gini)[0])){
        arrayOfYears.push(Object.keys(globalData[i].gini)[0]);
      }
    }
  }
  arrayOfYears.sort().reverse();
  const yearSelector = document.querySelector('#year-selector');
  for(const i of arrayOfYears){
    const option = document.createElement('option');
    option.value = arrayOfYears.indexOf(i);
    option.text = i;
    yearSelector.append(option);
  }
}

function graphGiniIndex(...elements){
  // 0: 0 by year, 1 global
  // 1: type 'bar' o 'horizontalBar'
  let dataGini, canvasGini, labels, values;
  if(elements[0] === 0){
    dataGini = canvas(globalData, arrayOfYears[yearSelector.value]);
    labels = Object.keys(dataGini);
    values = Object.values(dataGini);
    canvasGini = document.querySelector('#gini-canvas-year');
    if(typeof chart === 'object'){
      //chart.config.type = 'horizontalBar';
      chart.config.data.labels = labels;
      chart.config.data.datasets[0].data = values;
      //chart.config.data.datasets[0].label = `Gini Indexes reported in ${arrayOfYears[yearSelector.value]}`;
      chart.update();
    } else {
      chart = chartData(dataGini, canvasGini, elements[0]);
    }
  } else if (elements[0] === 1){
    dataGini = canvas(globalData);
    canvasGini = document.querySelector('#gini-canvas');
    chartData(dataGini, canvasGini, elements[0]);
  } else if (elements[0] === 2){
    const dataDensity = {};
    subFilterOptions[0].forEach(continent => {
      theData = filter(globalData, 'continents', continent);
      const tempData = densityPopulation(theData);
      dataDensity[continent] = tempData.averageDensity;
    });

    const canvasDensity = document.querySelector('#density-canvas-pie');
    chartData(dataDensity, canvasDensity, 2);
  }    

}

function changeOptionCalculus(){
  if(chosen === 1){
    calculus1.classList.value = 'tab-option tab-option-active';
    contentCalculus1.classList.value = 'content content-active';
    // graphGiniIndex(0, 'bar');
    // graphGiniIndex(1, 'horizontalBar');
    graphGiniIndex(0);
    graphGiniIndex(1);
  } else {
    calculus1.classList.value = 'tab-option';
    contentCalculus1.classList.value = 'content';
  }
  if (chosen === 2){
    calculus2.classList.value = 'tab-option tab-option-active';
    contentCalculus2.classList.value = 'content content-active';
    graphGiniIndex(2);
  } else {
    calculus2.classList.value = 'tab-option';
    contentCalculus2.classList.value = 'content';
  }
  if (chosen === 3){
    calculus3.classList.value = 'tab-option tab-option-active';
    contentCalculus3.classList.value = 'content content-active';
  } else {
    calculus3.classList.value = 'tab-option';
    contentCalculus3.classList.value = 'content';
  }
}



/**
 * FUnctions for Map View
 */
function showMap(){
  navBarToggle.classList.toggle('rotate');
  navBarButtons.classList.toggle('active');
  document.querySelector('nav section h3').innerHTML = "Map";
  dataContainer.style.display = "none";
  calculusContainer.style.display = "none";
  mapContainer.style.display = "flex";
}

/*
function disableButton(button){
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
}

function enableButton(button){
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
}
*/

/*
  if(extra.length > 1){
    const dataGini = canvas(globalData, arrayOfYears[yearSelector.value]);
    const containerGiniGraph = document.querySelector('#gini-canvas');
    chartData(dataGini, containerGiniGraph, extra[0]);
  }
*/

function toggleView() {
  if(switchBut.checked === true){
    cards.style.display = 'none';
    table.style.display = 'block';
    document.querySelector('nav section h3').innerHTML = "Table of Countries";
  } else if(switchBut.checked === false){
    cards.style.display = 'flex';
    table.style.display = 'none';
    document.querySelector('nav section h3').innerHTML = "Flags of Countries";
  }
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
}

function searchData(){
  theData = search(globalData, inputSearch.value);
  if(selectFilter.value !== '-1'){
    const filterBy = filterOptions[selectFilter.value].toLowerCase();
    const optionFilterBy = subFilterOptions[selectFilter.value][selectSubFilter.value];
    theData = filter(theData, filterBy, optionFilterBy);
  }
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
}

function filterData(){
  const filterContainer = document.querySelector('#filter');
  if (filterContainer.children.length > 0 || parseInt(selectFilter.value) === -1){
    while (filterContainer.children[1]) {
      filterContainer.removeChild(filterContainer.children[1]);
    }
    if (inputSearch.value !== ''){
      theData = search(globalData, inputSearch.value);
    } else {
      theData = globalData;
    }
    printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
  }

  //Filtering with the option of the subfilter
  if (parseInt(selectFilter.value) !== -1){
    selectSubFilter = document.createElement('select');
    selectSubFilter.id = "filter-by-option";
    const opciones = subFilterOptions[selectFilter.value];
    for (const i of opciones){
      const option = document.createElement('option');
      option.value = opciones.indexOf(i);
      option.text = i;
      selectSubFilter.add(option);
    }
    filterContainer.append(selectSubFilter);

    subFilter(); //Filtra la primera vez antes de empezar a recibir cambios
    selectSubFilter.addEventListener('change', () => {
      subFilter();
    });
  }
}

function subFilter(){
  const filterBy = filterOptions[selectFilter.value].toLowerCase();
  const optionFilterBy = subFilterOptions[selectFilter.value][selectSubFilter.value];
  theData = filter(globalData, filterBy, optionFilterBy);
  if (inputSearch.value !== ''){
    theData = search(theData, inputSearch.value);
  }
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
}

function sortData(event){
  if(selectSort.value !== "-1"){
    if (event.target.id.includes("ascending")){
      theData = sort(theData, selectSort.value, 1);
    } else if(event.target.id.includes("descending")){
      theData = sort(theData, selectSort.value, -1);
    }
    printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
  }
}


function createSelectorForFilterBy(){
  createSubFilterOptions();
  let option = document.createElement('option');
  option.value = "-1";
  option.text = "Filter 🎚️";
  selectFilter.append(option);
  for(const i of filterOptions){
    option = document.createElement('option');
    option.value = filterOptions.indexOf(i);
    option.text = i;
    selectFilter.add(option);
  }
}

function createSubFilterOptions(){
  for (const i of globalData){
    for (const j of filterOptions){
      if (j.toLowerCase() === "continents"){
        if (!(subFilterOptions[filterOptions.indexOf(j)].includes(i.continents[0]))){
          subFilterOptions[filterOptions.indexOf(j)].push(i.continents[0]);
        }
        subFilterOptions[filterOptions.indexOf(j)].sort();
      } else if(j.toLowerCase() === "subregion" && typeof(i.subregion) === 'string'){
        if (!(subFilterOptions[filterOptions.indexOf(j)].includes(i.subregion))){
          subFilterOptions[filterOptions.indexOf(j)].push(i.subregion);
        }
        subFilterOptions[filterOptions.indexOf(j)].sort();
      } else if(j.toLowerCase() === "languages" && typeof(i.languages) === 'object'){
        for (const value of Object.values(i.languages)){
          if (!(subFilterOptions[filterOptions.indexOf(j)].includes(value))){
            subFilterOptions[filterOptions.indexOf(j)].push(value);
          }
        }
        subFilterOptions[filterOptions.indexOf(j)].sort();
      }
    }
  }
}

function moveBetweenPages(event){
  const actual = parseInt(pageSelector.value);
  if(event.target.id.endsWith("button")){
    (actual === 1) ? backBut.disabled = true : backBut.disabled = false;
    (actual === Math.ceil(theData.length/lines) - 2) ? forwardBut.disabled = true : forwardBut.disabled = false;
  } else if (event.target.id.endsWith("selector")){
    (actual === 0) ? backBut.disabled = true : backBut.disabled = false;
    (actual === Math.ceil(theData.length/lines) - 1) ? forwardBut.disabled = true : forwardBut.disabled = false;
  }
  if ( actual >= 0 && actual < Math.ceil(theData.length/lines) ){
    if(event.target.id === "back-button"){
      forwardBut.disabled = false;
      pageSelector.text = parseInt(actual);
      pageSelector.value = parseInt(actual)-1;
    } else if(event.target.id === "forward-button"){
      backBut.disabled = false;
      pageSelector.text = parseInt(actual)+2;
      pageSelector.value = parseInt(actual)+1;
    }
  }
  if (switchBut.checked){
    showTable(theData, table, parseInt(pageSelector.value) + 1, lines);
  } else{
    showCards(theData, cards, parseInt(pageSelector.value) + 1, lines);
  }
}

function startTime() {
  // hora : 10:50 am
  const today = new Date();
  const hora = 10;
  const minutos = 50;
  const ampm = "am";
  let afternoon;
  (ampm === "pm") ? afternoon = true : afternoon = false;
  let hora24;
  let UTC = `UTC`;
  (afternoon) ? hora24 = hora+12 : hora24 = hora ;
  const horaRef = today.getUTCHours();
  const minRef = today.getUTCMinutes();
  if(horaRef > hora24){
    ((horaRef - hora24) < 10 ) ? UTC += `-0${horaRef-hora24}` : UTC += `-${horaRef-hora24}`;
  } else { //horaRef <= hora24
    ((hora24 - horaRef) < 10 ) ? UTC += `+0${hora24 - horaRef}` : UTC += `+${hora24 - horaRef}`;
  }
  if(minRef > minutos){
    ((minRef - minutos) < 30) ? UTC += ':00' : UTC += ':30';
  } else { //minRef <= minutos
    ((minutos - minRef) < 30 ) ? UTC += ':00' : UTC += ':30';
  }

  let hr = today.getHours();
  let min = today.getMinutes();
  //let sec = today.getSeconds();
  const ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
  hr = (hr === 0) ? 12 : hr;
  hr = (hr > 12) ? hr - 12 : hr;
  //Add a zero in front of numbers<10
  hr = checkTime(hr);
  min = checkTime(min);
  //sec = checkTime(sec);
  //document.getElementById("clock").innerHTML = hr + " : " + min + " : " + sec + " " + ap;
  document.getElementById("clock").innerHTML = hr + " : " + min + " " + ap;
  setTimeout(function(){ startTime() }, 100);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}



fetchAndStore();