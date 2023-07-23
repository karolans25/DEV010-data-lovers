import {dataJson, filter, sort, search} from './data.js';

const dir = './data/countries/countries.json';
const lines = 9;
const titles = ['No', 'Country', 'Capital', 'Languages', 'Area', 'Population'];
const filters = ['Continents', 'Subregion', 'Languages'];
const filtersOptions = [[],[],[]];
const inputSearch = document.querySelector('#search-by');
const inputToggle = document.querySelector('header nav label input');
const selectFilter = document.querySelector('#filter-by');
const selectFilterOption = document.querySelector('#filter-by-option');
const selectSort = document.querySelector('#sort-by');
const selectPage = document.querySelector('#select-pages');
const filterBut = document.querySelector('#filter-button');
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
    //console.log(globalData); // imprimirá los datos de la variable global si la promesa se resolvió correctamente
    init();
  } catch (error) {
    console.error(error);
  }
}

function init() {
  inputSearch.value = '';
  totalPages = Math.ceil(globalData.length/lines);
  createPagination(totalPages);
  createFilters();
  theData = globalData;
  showCards(1, theData);
  showTable(1, theData);
  (inputToggle.checked === true) ? cards.style.display = 'none' : table.style.display = 'none';
  //backBut.disabled = true;
  /**Event Listeners */
  // Listener para el input Toggle
  inputToggle.addEventListener('click', function() {
    if(inputToggle.checked === true){
      cards.style.display = 'none';
      table.style.display = 'block';
    } else if(inputToggle.checked === false){
      cards.style.display = 'flex';
      table.style.display = 'none';
    }
  });
  // Listener para el input Search
  inputSearch.addEventListener('click', function() {
    inputSearch.text = '';
  });
  inputSearch.addEventListener('keyup', (event) => {
    theData = search(globalData, event.target.value);
    console.log(theData);
    if(typeof(theData) !== 'undefined'){
      totalPages = Math.ceil(theData.length/lines);
      createPagination(totalPages);
      showTable(parseInt(selectPage.value) + 1, theData);
      showCards(parseInt(selectPage.value) + 1, theData);
      //createTable(1, theData);
    } else {
      showTable(parseInt(selectPage.value) + 1, globalData);
      showCards(parseInt(selectPage.value) + 1, theData);
    }
    console.log(theData);
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
    showCards(parseInt(selectPage.value)+1, theData);
  });
  // Listener para el botón Filter
  filterBut.addEventListener('click', function(){
    theData = filter(globalData, filters[selectFilter.value].toLowerCase(), filtersOptions[selectFilter.value][selectFilterOption.value]);
    totalPages = Math.ceil(theData.length/lines);
    createPagination(totalPages);
    showTable(parseInt(selectPage.value) + 1, theData);
    showCards(parseInt(selectPage.value) + 1, theData);
  });
  // Listener para el botón back button
  backBut.addEventListener('click', function(){
    const actual = selectPage.value;
    if (actual !== 0){
      selectPage.text = parseInt(actual);
      selectPage.value = parseInt(actual)-1;
      showTable(parseInt(selectPage.value)+1, theData);
      showCards(parseInt(selectPage.value)+1, theData);
      //forwardBut.disabled = false;
    } else if(actual === 0){
      //backBut.disabled = true;
    }
  });
  // Listener para el botón forward button
  forwardBut.addEventListener('click', function(){
    const actual = selectPage.value;
    if (actual !== Math.ceil(theData.length/lines)){
      selectPage.text = parseInt(actual)+2;
      selectPage.value = parseInt(actual)+1;
      showTable(parseInt(selectPage.value)+1, theData);
      showCards(parseInt(selectPage.value)+1, theData);
      //backBut.disabled = false;
    } else if(actual === totalPages){
      //forwardBut.disabled = true;
    }
  });
  // Listener para el botón ascending sort
  ascendingSortBut.addEventListener('click', function(){
    theData = sort(theData, selectSort.value, 1);
    totalPages = Math.ceil(theData.length/lines);
    createPagination(totalPages);
    if(inputToggle.checked === true){
      showTable(parseInt(selectPage.value) + 1, theData);
    } else if(inputToggle.checked === false){
      showCards(parseInt(selectPage.value) + 1, theData);
    }
  });
  // Listener para el botón descending sort
  descendingSortBut.addEventListener('click', function(){
    theData = sort(theData, selectSort.value, -1);
    totalPages = Math.ceil(theData.length/lines);
    createPagination(totalPages);
    if(inputToggle.checked === true){
      showTable(parseInt(selectPage.value) + 1, theData);
    } else if(inputToggle.checked === false){
      showCards(parseInt(selectPage.value) + 1, theData);
    }
  });
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
  if(selectPage.value ===  0){
    //backBut.disabled = true;
  } else if(selectPage.value ===  totalPages){
    //forwardBut.disabled = true;
  } else{
    //backBut.disabled = false;
    //forwardBut.disabled = false;
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

function showCards(page, countries){
  const init = (page - 1)*lines;
  const end = init + lines;
  if(countries.length !== 1){
    const dataTable = countries.slice(init, end);
    createCards(page, dataTable);
  } else{
    createCards(page, countries);
  }
}

function createTable(page, data){
  document.querySelector('article section[name="containerTabla"] h2').innerHTML = "Table of Countries";
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

function createCards(page, countries){
  document.querySelector('article section[name="containerTabla"] h2').innerHTML = "Flags of Countries";
  
  while (cards.firstChild) {
    cards.removeChild(cards.firstChild);
  }

  for (const i of countries){
    const div1 = document.createElement('div');
    div1.style.margin = '10px';
    div1.className = "flip-card";

    const div2 = document.createElement('div');
    div2.className = "flip-card-inner";
    //div2.style.height = "fit-content";
    
    const div3 = document.createElement('div');
    div3.className = "flip-card-front";
    const img = document.createElement('img');
    img.src = i.flags.png;
    img.alt = i.flags.alt;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.border = 'solid';
    //img.style.border-color = 'blue';

    const div4 = document.createElement('div');
    div4.className = 'flip-card-back';
    div4.style.border = 'solid';
    const h1 = document.createElement('h1');
    h1.innerHTML = `${i.name.common}`;
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
      div4.style.backgroundColor = 'purple';
    } else if(i.continents[0] === 'Asia'){
      div4.style.backgroundColor = 'yellow';
      div4.style.color = 'blue';
      div4.style.borderColor = 'white';
    } else if(i.continents[0] === 'Europe'){
      div4.style.backgroundColor = 'pink';
      div4.style.color = 'blue';
      div4.style.borderColor = 'white';
    } else if(i.continents[0] === 'Africa'){
      div4.style.backgroundColor = 'green';
    } else if(i.continents[0] === 'Oceania'){
      div4.style.backgroundColor = 'blue';
    } else if(i.continents[0] === 'Antarctica'){
      div4.style.backgroundColor = 'orange';
    }
  
    cards.append(div1);
    div1.appendChild(div2);
    div2.appendChild(div3);
    div2.appendChild(div4);
    div3.appendChild(img);
    div4.appendChild(h1);
    div4.append(h6);
    div4.append(p1);
    div4.append(p2);
    div4.append(p3);
  }
  /*
  <div class="flip-card"> 1
    <div class="flip-card-inner"> 2
      <div class="flip-card-front"> 3
        <img src="img_avatar.png" alt="Avatar" style="width:300px;height:300px;">
      </div>
      <div class="flip-card-back">
        <h1>John Doe</h1>
        <p>Architect & Engineer</p>
        <p>We love that guy</p>
      </div>
    </div>
  </div> 
  */
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