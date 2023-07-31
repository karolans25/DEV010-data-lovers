import {dataJson, filter, sort, search, canvas, canvasYear} from './data.js';
import {chartData, chartDataYear} from './canvas.js';
import {printData, createPaginator, showTable, showCards} from './show.js';

const dir = './data/countries/countries.json';
const lines = 10;
const filterOptions = ['Continents', 'Subregion', 'Languages'];
const subFilterOptions = [[],[],[]];
const arrayOfYears = [];
const navBarToggle = document.querySelector('.toggle');
const navBarButtons = document.querySelector('.links');
const inputSearch = document.querySelector('#search-by');
const inputToggle = document.querySelector('#toggle');
const selectFilter = document.querySelector('#filter-by');
let selectSubFilter;
const selectSort = document.querySelector('#sort-by');
const pageSelector = document.querySelector('#page-selector');
const ascendingSortBut = document.querySelector('#sort-ascending-button');
const descendingSortBut = document.querySelector('#sort-descending-button');
const backBut = document.querySelector('#back-button');
const forwardBut = document.querySelector('#forward-button');
const table = document.querySelector('table');
const cards = document.querySelector('#cards');
const navBarDataButton = document.querySelector('#data');
const navBarCalculusButton = document.querySelector('#calculus');
const navBarMapButton = document.querySelector('#map');
const dataContainer = document.querySelector('#data-container');
const calculusContainer = document.querySelector('#calculus-container');
const mapContainer = document.querySelector('#map-container');
const containerGiniGraphYear = document.querySelector('section[data-test="gini-canvas-year"]');
const containerGiniGraph = document.querySelector('section[data-test="gini-canvas"]');
const containerClock = document.querySelector('#clockdate');
const calculus1 = document.querySelector('#tab-option-gini-years');
const calculus2 = document.querySelector('#tab-option-gini');
const calculus3 = document.querySelector('#tab-option-density');
const calculus4 = document.querySelector('#tab-option-clock');
const contentCalculus1 = document.querySelector('section[data-test="gini-canvas-year"]');
const contentCalculus2 = document.querySelector('section[data-test="gini-canvas"]');
const contentCalculus3 = document.querySelector('section[data-test="density-canvas"]');
const contentCalculus4 = document.querySelector('section[data-test="clock"]');
let chosen = 1;
  
let yearSelector;
let totalPages;
let globalData;
let theData;

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
  //inputSearch.value = '';
  //filterBut.disabled = true;
  inputToggle.checked = false;
  backBut.disabled = true;
  createPaginator(totalPages, pageSelector);
  createSelectorForFilterBy(); //Create the select for filter by
  createSelectForYears();
  theData = globalData;
  showCards(theData, cards, parseInt(pageSelector.value) + 1, lines);
  showTable(theData, table, parseInt(pageSelector.value) + 1, lines);
  (inputToggle.checked === true) ? cards.style.display = 'none' : table.style.display = 'none';
  dataContainer.style.display = "block";
  calculusContainer.style.display = "none";
  mapContainer.style.display = "none";
  changeOptionCalculus();
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
  navBarToggle.addEventListener('click', ()=>{
    navBarToggle.classList.toggle('rotate');
    navBarButtons.classList.toggle('active');
  });
  // Listener para el input Toggle
  inputToggle.addEventListener('click', (event) => {
    toggleView(event);
  });
  // Listener para el input Search
  inputSearch.addEventListener('keyup', () => {
    searchData();
  });
  // Listener for filtering the data (continents, subregion, languages)
  selectFilter.addEventListener('change', ()=>{
    filterData();
  });
  // Listeners for moving between pages with the forward button, the back button and the page selector
  forwardBut.addEventListener('click', (event) => {
    // ((parseInt(pageSelector.value)+1) === pageSelector.length) ? disableButton(forwardBut) : enableButton(forwardBut);
    moveBetweenPages(event);
  }); 
  backBut.addEventListener('click', (event) => {
    // ((parseInt(pageSelector.value)+1) === 1) ? disableButton(backBut) : enableButton(backBut);
    moveBetweenPages(event);
  });
  pageSelector.addEventListener('change', (event) => {
    // ((parseInt(pageSelector.value)+1) === 1) ? disableButton(backBut) : ((parseInt(pageSelector.value)+1) === pageSelector.length) ? disableButton(forwardBut) : enableButton(forwardBut) enableButton(backBut));  
    moveBetweenPages(event);
  });
  //Listeners for sorting the data (ascending and descending)
  ascendingSortBut.addEventListener('click', (event) => {
    sortData(event);
  });
  descendingSortBut.addEventListener('click', (event) => {
    sortData(event);
  });

  navBarDataButton.addEventListener('click', () => {
    showData();
  });
  navBarCalculusButton.addEventListener('click', () => {
    showCalculus();
  });
  navBarMapButton.addEventListener('click', () => {
    showMap();
  });

  calculus1.addEventListener('click', () => {
    chosen = 1;
    containerGiniGraphYear.style.display = "block";
    containerGiniGraph.style.display = "none";
    changeOptionCalculus();
  });
  calculus2.addEventListener('click', () => {
    chosen = 2;
    containerGiniGraphYear.style.display = "none";
    containerGiniGraph.style.display = "block";
    changeOptionCalculus();
  });
  calculus3.addEventListener('click', () => {
    chosen = 3;
    containerGiniGraphYear.style.display = "none";
    containerGiniGraph.style.display = "none";
    changeOptionCalculus();
  });
  calculus4.addEventListener('click', () => {
    chosen = 4;
    containerGiniGraphYear.style.display = "none";
    containerGiniGraph.style.display = "none";
    changeOptionCalculus();
  });

}

function showData(){
  navBarToggle.classList.toggle('rotate');
  navBarButtons.classList.toggle('active');
  document.querySelector('nav section h3').innerHTML = "Flags of Countries";
  dataContainer.style.display = "block";
  calculusContainer.style.display = "none";
  mapContainer.style.display = "none";  
}

function showCalculus(){
  navBarToggle.classList.toggle('rotate');
  navBarButtons.classList.toggle('active');
  document.querySelector('nav section h3').innerHTML = "Calculus";
  dataContainer.style.display = "none";
  calculusContainer.style.display = "flex";
  containerGiniGraphYear.style.display = "block";
  containerGiniGraph.style.display = "none";
  containerClock.style.display = "none";
  mapContainer.style.display = "none";
  calculus1.classList.value = 'tab-option tab-option-active';
  contentCalculus1.classList.value = 'content content-active';
  graphGiniIndex(0);
  yearSelector.addEventListener('change', ()=>{
    graphGiniIndex(0);
  });
}

function showMap(){
  navBarToggle.classList.toggle('rotate');
  navBarButtons.classList.toggle('active');
  document.querySelector('nav section h3').innerHTML = "Map";
  dataContainer.style.display = "none";
  calculusContainer.style.display = "none";
  mapContainer.style.display = "flex";
}

function changeOptionCalculus(){
  if(chosen === 1){
    calculus1.classList.value = 'tab-option tab-option-active';
    contentCalculus1.classList.value = 'content content-active';
    graphGiniIndex(0);
  } else {
    calculus1.classList.value = 'tab-option';
    contentCalculus1.classList.value = 'content';
  }
  if (chosen === 2){

    calculus2.classList.value = 'tab-option tab-option-active';
    contentCalculus2.classList.value = 'content content-active';
    graphGiniIndex(1);
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
  if (chosen === 4){
    calculus4.classList.value = 'tab-option tab-option-active';
    contentCalculus4.classList.value = 'content content-active';
  } else {
    calculus4.classList.value = 'tab-option';
    contentCalculus4.classList.value = 'content';
  }
}

function disableButton(button){
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
}

function enableButton(button){
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
}

function graphGiniIndex(...extra){
  if(parseInt(extra[extra.length-1]) === 0){
    const dataGiniYears = canvasYear(globalData, arrayOfYears[yearSelector.value]);
    const canvasGiniGraphYears = document.querySelector('#gini-canvas-year');  
    chartDataYear(dataGiniYears, canvasGiniGraphYears);
  } else if(parseInt(extra[extra.length-1]) === 1){
    const dataGini = canvas(globalData);
    console.log(dataGini);
    alert();
    const containerGiniGraph = document.querySelector('#gini-canvas');
    chartData(dataGini, containerGiniGraph, 'Colombia');
  }
  if(extra.length > 1){
    const dataGini = canvas(globalData, arrayOfYears[yearSelector.value]);
    const containerGiniGraph = document.querySelector('#gini-canvas');
    chartData(dataGini, containerGiniGraph, extra[0]);
  }
}

function toggleView() {
  if(inputToggle.checked === true){
    cards.style.display = 'none';
    table.style.display = 'block';
    document.querySelector('nav section h3').innerHTML = "Table of Countries";
  } else if(inputToggle.checked === false){
    cards.style.display = 'flex';
    table.style.display = 'none';
    document.querySelector('nav section h3').innerHTML = "Flags of Countries";
  }
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, inputToggle.checked);
}

function searchData(){
  theData = search(globalData, inputSearch.value);
  if(selectFilter.value !== '-1'){
    const filterBy = filterOptions[selectFilter.value].toLowerCase();
    const optionFilterBy = subFilterOptions[selectFilter.value][selectSubFilter.value];
    theData = filter(theData, filterBy, optionFilterBy);
  }
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, inputToggle.checked);
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
    printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, inputToggle.checked);
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
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, inputToggle.checked);
}

function sortData(event){
  if(selectSort.value !== "-1"){
    if (event.target.id.includes("ascending")){
      theData = sort(theData, selectSort.value, 1);
    } else if(event.target.id.includes("descending")){
      theData = sort(theData, selectSort.value, -1);
    }
    printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, inputToggle.checked);
  }
}


function createSelectorForFilterBy(){
  createSubFilterOptions();
  let option = document.createElement('option');
  option.value = "-1";
  option.text = "Filter &#f002";
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

function  createSelectForYears(){
  const containerCanvasGiniYear = document.querySelector('section[data-test="gini-canvas-year"]');
  yearSelector = document.createElement('select');
  for (let i=0; i<globalData.length; i++){
    if('gini' in globalData[i]){
      if(!arrayOfYears.includes(Object.keys(globalData[i].gini)[0])){
        arrayOfYears.push(Object.keys(globalData[i].gini)[0]);
      }
    }
  }
  arrayOfYears.sort().reverse();
  for(const i of arrayOfYears){
    const option = document.createElement('option');
    option.value = arrayOfYears.indexOf(i);
    option.text = i;
    yearSelector.append(option);
  }
  while (containerCanvasGiniYear.children[2]) {
    containerCanvasGiniYear.removeChild(containerCanvasGiniYear.children[2]);
  }
  containerCanvasGiniYear.append(yearSelector);
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
  if (inputToggle.checked){
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
  console.log(`UTC: ${UTC}`);

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
  const time = setTimeout(function(){ startTime() }, 100);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}



fetchAndStore();