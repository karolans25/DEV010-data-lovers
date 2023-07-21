import { filter, search, dataJson} from './data.js';

const dir = './data/countries/countries.json';
const lines = 10;
const titles = ['No', 'Country', 'Capital', 'Languages', 'Area', 'Population'];
const filters = ['Continents', 'Subregion', 'Languages'];
const filtersOptions = [[],[],[]];
const inputSearch = document.querySelector('#search-by');
const selectFilter = document.querySelector('#filter-by');
const selectFilterOption = document.querySelector('#filter-by-option');
const selectPage = document.querySelector('#select-pages');
const filterBut = document.querySelector('#filter-button');
const backBut = document.querySelector('#back-button');
const forwardBut = document.querySelector('#forward-button');
const table = document.querySelector('table');
let globalData;
let theData;

async function fetchAndStore() {
  try {
    globalData = await dataJson(dir);
    //console.log(globalData); // imprimirá los datos de la variable global si la promesa se resolvió correctamente
    init();
    //fillData();
  } catch (error) {
    console.error(error);
  }
}

function init() {
  inputSearch.value = '';
  const total = Math.ceil(globalData.length/lines);
  createPagination(total);
  createFilters();
  theData = globalData;
  showTable(1, theData);
  // Listener para el input Search
  inputSearch.addEventListener('keyup', (event) => {
    theData = search(globalData, event.target.value);
    if(typeof(theData) !== 'undefined'){
      const total = Math.ceil(theData.length/lines);
      createPagination(total);
      showTable(parseInt(selectPage.value) + 1, theData);
      //createTable(1, theData);
    } else {
      showTable(parseInt(selectPage.value) + 1, globalData);
    }
  });
  // Listener para el selector de Filtro
  selectFilter.addEventListener('change', function(){
    while (selectFilterOption.firstChild) {
      selectFilterOption.removeChild(selectFilterOption.firstChild);
    }
    if(parseInt(selectFilter.value) !== -1){
      for (const i of filtersOptions[selectFilter.value]){
        const option = document.createElement('option');
        option.value = filtersOptions[selectFilter.value].indexOf(i);
        option.text = i;
        selectFilterOption.add(option);
      }
    } else {
      while (selectFilter.firstChild) {
        selectFilter.removeChild(selectFilter.firstChild);
      }
      init();
    }
  });
  // Listener para el selector de Página
  selectPage.addEventListener('change', function(){
    showTable(parseInt(selectPage.value)+1, theData);
  });
  // Listener para el botón Filter
  filterBut.addEventListener('click', function(){
    theData = filter(globalData, filters[selectFilter.value].toLowerCase(), filtersOptions[selectFilter.value][selectFilterOption.value]);
    const total = Math.ceil(theData.length/lines);
    createPagination(total);
    showTable(parseInt(selectPage.value) + 1, theData);
  });
  // Listener para el botón back button
  backBut.addEventListener('click', function(){
    const actual = selectPage.value;
    if (actual !== 0){
      selectPage.text = parseInt(actual);
      selectPage.value = parseInt(actual)-1;
      showTable(parseInt(selectPage.value)+1, theData);
    }
  });
  // Listener para el botón forward button
  forwardBut.addEventListener('click', function(){
    const actual = selectPage.value;
    if (actual !== Math.ceil(globalData.length/lines)){
      selectPage.text = parseInt(actual)+2;
      selectPage.value = parseInt(actual)+1;
      showTable(parseInt(selectPage.value)+1, theData);
    }
  });
}

function fillData (){
}

function createPagination(totalPages){
  while (selectPage.firstChild) {
    selectPage.removeChild(selectPage.firstChild);
  }
  for(let i = 0; i < totalPages; i++){
    const option = document.createElement('option');
    option.value = i;
    option.text = i+1;
    selectPage.add(option);
  }
}

function showTable(page, countries){
  const init = (page - 1)*lines;
  const end = init + lines;
  if(countries.length !== 1){
    const dataTable = countries.slice(init, end);
    createTable(page, dataTable);
  } else{
    createTable(page, countries);
  }
}

function createTable(page, data){
  document.querySelector('article section[name="containerTabla"] h2').innerHTML = "Tabla de Países";
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  const caption = document.createElement('caption');
  caption.innerHTML = "Tabla de países";
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
        td.innerHTML = name;
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
      }/* else if (j === 'Gini'){
        td.innerHTML = i.population;
      } */
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
}

function createFilters(){
  createFiltersOptions();
  let option = document.createElement('option');
  option.value = "-1";
  option.text = "-----------------";
  selectFilter.append(option);
  for(const i of filters){
    option = document.createElement('option');
    option.value = filters.indexOf(i);
    option.text = i;
    selectFilter.add(option);
  }
}

function createFiltersOptions(){
  for (const i of globalData){
    for (const j of filters){
      if (j.toLowerCase() === "continents"){
        if (!(filtersOptions[filters.indexOf(j)].includes(i.continents[0]))){
          filtersOptions[filters.indexOf(j)].push(i.continents[0]);
        }
      } else if(j.toLowerCase() === "subregion" && typeof(i.subregion) === 'string'){
        if (!(filtersOptions[filters.indexOf(j)].includes(i.subregion))){
          filtersOptions[filters.indexOf(j)].push(i.subregion);
        }
      } else if(j.toLowerCase() === "languages" && typeof(i.languages) === 'object'){
        for (const key of Object.keys(i.languages)){
          if (!(filtersOptions[filters.indexOf(j)].includes(key))){
            filtersOptions[filters.indexOf(j)].push(key);
          }
        }
      }
    }
  }
}

fetchAndStore();