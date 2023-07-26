import {dataJson, filter, sort, search} from './data.js';

const dir = './data/countries/countries.json';
const lines = 10;
const titles = ['No', 'Country', 'Capital', 'Languages', 'Area', 'Population', 'Gini'];
const filterOptions = ['Continents', 'Subregion', 'Languages'];
const subFilterOptions = [[],[],[]];
const inputSearch = document.querySelector('#search-by');
const inputToggle = document.querySelector('#toggle');
const selectFilter = document.querySelector('#filter-by');
// const selectFilterOption = document.querySelector('#filter-by-option');
let selectSubFilter;
const selectSort = document.querySelector('#sort-by');
const pageSelector = document.querySelector('#page-selector');
//const filterBut = document.querySelector('#filter-button');
const ascendingSortBut = document.querySelector('#sort-ascending-button');
const descendingSortBut = document.querySelector('#sort-descending-button');
const backBut = document.querySelector('#back-button');
const forwardBut = document.querySelector('#forward-button');
const table = document.querySelector('table');
const cards = document.querySelector('#cards');

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
  totalPages = Math.ceil(globalData.length/lines);
  document.querySelector('article h3').innerHTML = "Flags of Countries";
  inputSearch.value = '';
  //filterBut.disabled = true;
  backBut.disabled = true;
  createPaginator(totalPages);
  createSelectorForFilterBy(); //Create the select for filter by
  theData = globalData;
  showCards(1, theData);
  showTable(1, theData);
  (inputToggle.checked === true) ? cards.style.display = 'none' : table.style.display = 'none';

  // Listener para el input Toggle
  inputToggle.addEventListener('click', (event) => {
    toggleView(event);
  });

  // Listener para el input Search
  inputSearch.addEventListener('keyup', (event) => {
    searchData(event);
  });

  // Listener for filtering the data (continents, subregion, languages)
  selectFilter.addEventListener('change', ()=>{
    filterData();
  });

  //Listeners for sorting the data (ascending and descending)
  ascendingSortBut.addEventListener('click', (event) => {
    sortData(event);
  });
  descendingSortBut.addEventListener('click', (event) => {
    sortData(event);
  });

  // Listeners for moving between pages with the forward button, the back button and the page selector
  pageSelector.addEventListener('change', (event) => {
    moveBetweenPages(event);
  });
  backBut.addEventListener('click', (event) => {
    moveBetweenPages(event);
  });
  forwardBut.addEventListener('click', (event) => {
    moveBetweenPages(event);
  }); 
}
function toggleView() {
  if(inputToggle.checked === true){
    cards.style.display = 'none';
    table.style.display = 'block';
    document.querySelector('article h3').innerHTML = "Table of Countries";
  } else if(inputToggle.checked === false){
    cards.style.display = 'flex';
    table.style.display = 'none';
    document.querySelector('article h3').innerHTML = "Flags of Countries";
  }
  printData();
}

function searchData(event){
  theData = search(globalData, event.target.value);
  if(selectFilter.value !== '-1'){
    const filterBy = filterOptions[selectFilter.value].toLowerCase();
    const optionFilterBy = subFilterOptions[selectFilter.value][selectSubFilter.value];
    theData = filter(theData, filterBy, optionFilterBy);
  }
  printData();
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
    printData();
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
  printData();
}

function sortData(event){
  if (event.target.id.includes("ascending")){
    theData = sort(theData, selectSort.value, 1);
  } else if(event.target.id.includes("descending")){
    theData = sort(theData, selectSort.value, -1);
  }
  printData();
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
    showTable(parseInt(pageSelector.value) + 1, theData);
  } else{
    showCards(parseInt(pageSelector.value) + 1, theData);
  }
}

function createPaginator(totalPages){
  while (pageSelector.firstChild) {
    pageSelector.removeChild(pageSelector.firstChild);
  }
  for(let i = 0; i < totalPages; i++){
    const option = document.createElement('option');
    option.value = i;
    option.text = i+1;
    pageSelector.add(option);
  }
}

function printData(){
  totalPages = Math.ceil(theData.length/lines);
  //REvisar que el alert salga una sola vez
  if(totalPages === 0){
    alert("Didn't find countries according to your searching parameters.");
  }
  if(totalPages === 1){
    backBut.disabled = true;
    forwardBut.disabled = true;
  } else {
    forwardBut.disabled = false;
  }
  createPaginator(totalPages);
  if (inputToggle.checked){
    showTable(parseInt(pageSelector.value) + 1, theData);
  } else{
    showCards(parseInt(pageSelector.value) + 1, theData);
  }
}

function showTable(page, countries){
  const initial = (page - 1)*lines;
  const final = initial + lines;
  if(countries.length !== 1){
    const dataTable = countries.slice(initial, final);
    createTable(page, dataTable);
  } else{
    createTable(page, countries);
  }
}

function showCards(page, countries){
  const initial = (page - 1)*lines;
  const final = initial + lines;
  if(countries.length !== 1){
    const dataTable = countries.slice(initial, final);
    createCards(page, dataTable);
  } else{
    createCards(page, countries);
  }
}

function createTable(page, data){
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  const caption = document.createElement('caption');
  caption.innerHTML = "Table of Countries";
  table.append(caption);

  //Fill the titles of the table
  const thead = document.createElement('thead');
  let tr = document.createElement('tr');
  for (const i of titles){
    const th = document.createElement('th');
    th.innerHTML = i;
    tr.append(th);
  }
  thead.append(tr);
  table.append(thead);

  // Fill the data of the table
  const tbody = document.createElement('tbody');
  for (const i of data){
    tr = document.createElement('tr');
    for (const j of titles){
      const td = document.createElement('td');
      if (j === 'No'){
        td.innerHTML = `${(page-1)*lines + (data.indexOf(i)+1)}`;
      } else if (j === 'Country'){
        let name = `${i.name.common}\t${i.flag}`;
        (i.independent) ? name += '\t✅' : name += '\t❌';
        //td.innerHTML = name;
        const abbr = document.createElement('abbr');
        abbr.title = i.name.official;
        abbr.innerHTML = name;
        td.appendChild(abbr);

      } else if ( j === 'Capital'){
        if (typeof(i.capital) === 'object'){
          td.innerHTML = i.capital;
        } else {
          td.innerHTML = '❌';
        }
      } else if (j === 'Languages'){
        let lang = "";
        if(typeof(i.languages) === 'object'){
          for(const key of Object.keys(i.languages)){
            lang += `${key},\t`;
          }
        } else {
          lang = "❌,\t";
        }
        td.innerHTML = lang.slice(0,-2);
      } else if (j === 'Area'){
        td.innerHTML = i.area;
      } else if (j === 'Population'){
        td.innerHTML = i.population;
      } else if (j === 'Gini'){
        if (typeof i.gini === 'object'){
          for (const k of Object.keys(i.gini)){
            //td.innerHTML = i.gini[`${k}`];
            td;
            const abbr = document.createElement('abbr');
            abbr.title = k;
            abbr.innerHTML = parseFloat(i.gini[`${k}`]).toFixed(1);
            td.appendChild(abbr);
          }
        } else {
          td.innerHTML = "❌";
        }
      }
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
}

function createCards(page, countries){  
  while (cards.firstChild) {
    cards.removeChild(cards.firstChild);
  }

  for (const i of countries){
    const div1 = document.createElement('div');
    div1.style.margin = '10px';
    div1.style.height = '250px';
    div1.className = "flip-card";

    const div2 = document.createElement('div');
    div2.className = "flip-card-inner";

    const div3 = document.createElement('div');
    div3.className = "flip-card-front";
    const img = document.createElement('img');
    img.src = i.flags.png;
    img.alt = i.flags.alt;
    img.style.width = '100%';
    img.style.height = '200px';
    img.style.border = 'solid';
    div3.style.alignSelf = "center";

    const div4 = document.createElement('div');
    div4.className = 'flip-card-back';
    div4.style.border = 'solid';
    const h4 = document.createElement('h1');
    h4.innerHTML = `${i.name.common}`;
    const h6 = document.createElement('h6');
    h6.innerHTML = `${i.name.official}\t${i.independent ? '\t✅' : '\t❌'}`;
    //h1.append(h3);
    const p1 = document.createElement('p');
    p1.innerHTML = (typeof i.capital === 'object') ? `Capital: ${i.capital[0]}`: `Capital: ❌`;
    const p2 = document.createElement('p');
    p2.innerHTML = (typeof i.area === 'number') ? `Area: ${i.area}`: `Area: ❌`;
    const p3 = document.createElement('p');
    p3.innerHTML = (typeof i.population === 'number') ? `Population: ${i.population}`: `Population: ❌`;
    
    if(i.continents[0] === 'America'){
      div4.style.backgroundColor = '#FFFB7B';
      //div4.style.color = "blue";
    } else if(i.continents[0] === 'Asia'){
      div4.style.backgroundColor = '#CBADE0';
      //div4.style.color = 'blue';
      //div4.style.borderColor = 'white';
    } else if(i.continents[0] === 'Europe'){
      div4.style.backgroundColor = '#FCC2D2';
      //div4.style.color = 'blue';
      //div4.style.borderColor = 'white';
    } else if(i.continents[0] === 'Africa'){
      div4.style.backgroundColor = 'lightgreen';
      //div4.style.color = "blue";
    } else if(i.continents[0] === 'Oceania'){
      div4.style.backgroundColor = 'lightblue';
      //div4.style.color = "blue";
    } else if(i.continents[0] === 'Antarctica'){
      div4.style.backgroundColor = '#A3C7E3';
      //div4.style.color = "blue";
    }
    //div4.style.color = "blue";
    div4.style.color = "#1D0030";
  
    cards.append(div1);
    div1.appendChild(div2);
    div2.appendChild(div3);
    div2.appendChild(div4);
    div3.appendChild(img);
    div4.appendChild(h4);
    div4.append(h6);
    div4.append(p1);
    div4.append(p2);
    div4.append(p3);
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

fetchAndStore();