import {dataJson, searchData, filterDataByContinent, filterDataBySubregion, filterDataByLanguage, sortDataByCountry, sortDataByCapital, sortDataByArea, sortDataByPopulation, calculateGiniCanvas, calculatePopulationDensity, searchClockTimezones} from './data.js';
import {chartData} from './canvas.js';
import {printData, createPaginator, showTable, showCards, showFlags} from './show.js';

const dir = './data/countries/countries.json';
const lines = 10;
const filterOptions = ['Continents', 'Subregion', 'Languages'];
const arraySubFilterOptions = [[],[],[]];
const arrayOfYears = [];
let totalPages;
let globalData;
let theData;

const navBarToggle = document.querySelector('.toggle');
const navBarButtons = document.querySelector('.links');
const navBarDataButton = document.querySelector('#data-link');
const navBarCalculusButton = document.querySelector('#calculus-link');

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
const changeTime = document.querySelector('#change-clock');
const setTimeButton = document.querySelector('#set-clock');
const overlay = document.querySelector('#overlay');
const closePopupButton = document.querySelector('#close-popup-buttton');
let chart;

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
  inputSearch.value = '';
  switchBut.checked = false;
  backBut.disabled = true;
  createPaginator(totalPages, pageSelector);
  createSelectorForFilterBy();
  theData = globalData;
  showCards(theData, cards, parseInt(pageSelector.value) + 1, lines);
  showTable(theData, table, parseInt(pageSelector.value) + 1, lines);
  (switchBut.checked === true) ? cards.style.display = 'none' : table.style.display = 'none';
  createEventListeners();
  navBarDataButton.click();
}

function createEventListeners(){
  navBarToggle.addEventListener('click', ()=>{
    navBarToggle.classList.toggle('rotate');
    navBarButtons.classList.toggle('active');
  });
  navBarDataButton.addEventListener('click', () => {
    dataContainer.style.display = "block";
    calculusContainer.style.display = "none";
    showData();
  });
  navBarCalculusButton.addEventListener('click', () => {
    dataContainer.style.display = "none";
    calculusContainer.style.display = "block";
    showCalculus();
  });

  // Data container
  switchBut.addEventListener('click', (event) => {
    toggleView(event); //cards or table
  });
  inputSearch.addEventListener('keyup', () => {
    searchTheData();
  });
  selectFilter.addEventListener('change', ()=>{
    filterTheData();
  });
  ascendingSortBut.addEventListener('click', () => {
    sortTheData(theData, 1);
  });
  descendingSortBut.addEventListener('click', () => {
    sortTheData(theData, -1);
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
  changeTime.addEventListener('click', ()=>{
    overlay.classList.add('active');
  });
  closePopupButton.addEventListener('click', ()=>{
    overlay.classList.remove('active');
  });
  setTimeButton.addEventListener('click', ()=>{
    overlay.classList.remove('active');    
    const hr = document.querySelector('#hour').value;
    const min = document.querySelector('#minutes').value;
    const ap = document.querySelector('#meridian').value;
    setClock(hr, min, ap);
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
}

/**
 * Functions for Calculus View
 */
function showCalculus(){
  navBarToggle.classList.toggle('rotate');
  navBarButtons.classList.toggle('active');
  document.querySelector('nav section h3').innerHTML = "Calculus";
  calculusContainer.style.display = "flex";
  calculus1.click();
  // calculus1.classList.value = 'tab-option tab-option-active';
  // calculus2.classList.value = 'tab-option';
  // calculus3.classList.value = 'tab-option';
  // contentCalculus1.classList.value = 'content content-active';
  // contentCalculus2.classList.value = 'content content-active';
  // contentCalculus3.classList.value = 'content content-active';
  // chosen = 1;
  // changeOptionCalculus();
  fillYearSelector();
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
  let dataGini, canvasGini, labels, values;
  if(elements[0] === 0){
    dataGini = calculateGiniCanvas(globalData, arrayOfYears[yearSelector.value]);
    labels = Object.keys(dataGini);
    values = Object.values(dataGini);
    canvasGini = document.querySelector('#gini-canvas-year');
    if(typeof chart === 'object'){
      //chart.config.type = 'horizontalBar';
      chart.config.data.labels = labels;
      chart.config.data.datasets[0].data = values;
      chart.update();
    } else {
      chart = chartData(dataGini, canvasGini, elements[0]);
    }
  } else if (elements[0] === 1){
    dataGini = calculateGiniCanvas(globalData);
    canvasGini = document.querySelector('#gini-canvas');
    chartData(dataGini, canvasGini, elements[0]);
  } else if (elements[0] === 2){
    const dataDensity = {};
    arraySubFilterOptions[0].forEach(continent => {
      theData = filterDataByContinent(globalData, continent);
      const tempData = calculatePopulationDensity(theData);
      dataDensity[continent] = tempData.averageDensity;
    });

    const canvasDensity = document.querySelector('#density-canvas-pie');
    chartData(dataDensity, canvasDensity, 2);
  }    

}

function setClock(hr, min, ap){
  (hr<10) ? hr=`0${hr}` : hr = `${hr}`;
  (min<10) ? min=`0${min}` : min = `${min}`;
  (ap === 'am') ? '<span>AM</span>' : '<span>PM</span>';
  document.getElementById("clock").innerHTML = hr + " : " + min + " " + ap.toUpperCase();
  displayFlagsUTC();
}

function displayFlagsUTC(){
  const hourUTC = calculateUTC();
  const countriesUTC = searchClockTimezones(globalData, hourUTC);
  const containerFlagsUTC = document.querySelector('#card-clock');
  showFlags(countriesUTC, containerFlagsUTC);
}

function changeOptionCalculus(){
  if(chosen === 1){
    calculus1.classList.value = 'tab-option tab-option-active';
    contentCalculus1.classList.value = 'content content-active';
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

function searchTheData(){
  theData = searchData(globalData, inputSearch.value);
  if (parseInt(selectFilter.value) !== -1){
    const valSubfilter = arraySubFilterOptions[selectFilter.value][selectSubFilter.value];
    const valFilter = parseInt(selectFilter.value);

    switch(valFilter){
    case 0:
      theData = filterDataByContinent(theData, valSubfilter);
      break;
    case 1:
      theData = filterDataBySubregion(theData, valSubfilter);
      break;
    case 2:
      theData = filterDataByLanguage(theData, valSubfilter);
      break;
    }}
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
}

function filterTheData(){
  const container = document.querySelector('#filter');
  const valSearch = inputSearch.value;
  const valFilter = parseInt(selectFilter.value);

  if (container.children.length > 0 || valFilter === -1){
    while (container.children[1]) {
      container.removeChild(container.children[1]);
    }
    if (valSearch !== ''){
      theData = searchData(globalData, valSearch);
    } else {
      theData = globalData;
    }
    printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
  }

  //Filtering with the option of the subfilter
  if (valFilter !== -1){
    selectSubFilter = document.createElement('select');
    selectSubFilter.id = "filter-by-option";
    const opciones = arraySubFilterOptions[selectFilter.value];
    for (const i of opciones){
      const option = document.createElement('option');
      option.value = opciones.indexOf(i);
      option.text = i;
      selectSubFilter.add(option);
    }
    container.append(selectSubFilter);

    subFilter(); //Filtra la primera vez antes de empezar a recibir cambios
    selectSubFilter.addEventListener('change', () => {
      subFilter();
    });
  }
}

function subFilter(){
  const optionFilterBy = arraySubFilterOptions[selectFilter.value][selectSubFilter.value];

  switch(parseInt(selectFilter.value)){
  case 0:
    theData = filterDataByContinent(globalData, optionFilterBy);
    break;
  case 1:
    theData = filterDataBySubregion(globalData, optionFilterBy);
    break;
  case 2:
    theData = filterDataByLanguage(globalData, optionFilterBy);
    break;
  }
  if (inputSearch.value !== ''){
    theData = searchData(theData, inputSearch.value);
  }
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
}

function sortTheData(data, direction){
  switch(selectSort.value){
  case "country":
    theData = sortDataByCountry(data, direction);
    break;
  case "capital":
    theData = sortDataByCapital(data, direction);
    break;
  case "area":
    theData = sortDataByArea(data, direction);
    break;
  case "population":
    theData = sortDataByPopulation(data, direction);
    break;
  }
  printData(theData, cards, table, backBut, forwardBut, pageSelector, lines, switchBut.checked);
}


function createSelectorForFilterBy(){
  createArraySubFilterOptions();
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

function createArraySubFilterOptions(){
  for (const i of globalData){
    for (const j of filterOptions){
      if (j.toLowerCase() === "continents"){
        if (!(arraySubFilterOptions[filterOptions.indexOf(j)].includes(i.continents[0]))){
          arraySubFilterOptions[filterOptions.indexOf(j)].push(i.continents[0]);
        }
        arraySubFilterOptions[filterOptions.indexOf(j)].sort();
      } else if(j.toLowerCase() === "subregion" && typeof(i.subregion) === 'string'){
        if (!(arraySubFilterOptions[filterOptions.indexOf(j)].includes(i.subregion))){
          arraySubFilterOptions[filterOptions.indexOf(j)].push(i.subregion);
        }
        arraySubFilterOptions[filterOptions.indexOf(j)].sort();
      } else if(j.toLowerCase() === "languages" && typeof(i.languages) === 'object'){
        for (const value of Object.values(i.languages)){
          if (!(arraySubFilterOptions[filterOptions.indexOf(j)].includes(value))){
            arraySubFilterOptions[filterOptions.indexOf(j)].push(value);
          }
        }
        arraySubFilterOptions[filterOptions.indexOf(j)].sort();
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

function calculateUTC(){
  let hour = parseInt(document.querySelector('#hour').value);
  const minutes = parseInt(document.querySelector('#minutes').value);
  const meridian = document.querySelector('#meridian').value;
  console.log(hour);
  console.log(minutes);
  console.log(meridian);
  const today = new Date();
  if(hour === "12" && meridian === "am") hour = "0";
  else if(meridian === "pm" && hour !== "12") hour = String(parseInt(hour) + 12);
  let desfase, UTC = 'UTC'; 
  const hourRef = today.getUTCHours(); 
  const minuteRef = today.getUTCMinutes(); 
  if (hour < hourRef) {
    if(hour-hourRef < -12){
      desfase = 12 + hour - hourRef%12;
    } else if (hour-hourRef >= -12){
      desfase = hour - hourRef;
    }
  } else if(hour === hourRef){
    desfase = hour-hourRef;
  } else if (hour > hourRef){
    if(hour-hourRef > 12){
      desfase = (hour%12) -12 -hourRef;
    } else if (hour-hourRef  < 12){
      desfase = (hour) - hourRef;
    }
  }
  if(desfase >= 0) {
    (Math.abs(desfase) < 10) ? UTC += `+0${Math.abs(desfase)}`: UTC += `+${Math.abs(desfase)}`;
  }  else {
    (Math.abs(desfase) < 10) ? UTC += `-0${Math.abs(desfase)}`: UTC += `-${Math.abs(desfase)}`;
  }
  if(minuteRef > minutes){
    ((minuteRef - minutes) < 30) ? UTC += ':00' : UTC += ':30';
  } else { //minRef <= minutes
    ((minutes - minuteRef) < 30 ) ? UTC += ':00' : UTC += ':30';
  }
  return UTC;
}

function startTime() {
  const today = new Date();
  let hr = today.getHours();
  const min = today.getMinutes();
  const ap = (hr<12) ? "am" : "pm";
  hr = (hr === 0) ? 12 : hr;
  hr = (hr > 12) ? hr - 12 : hr;
  document.getElementById("hour").value = hr;
  document.getElementById("minutes").value = min;
  document.getElementById("meridian").value = ap;
  setClock(hr, min, ap);
}

fetchAndStore();