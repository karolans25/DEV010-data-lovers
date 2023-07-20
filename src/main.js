import { filter, search} from './data.js';

//let countries;
const dir = './data/countries/countries.json';

fetch(dir)
  .then(response => response.json())
  .then(data => {
    //countries = data;
    fillData(data);
  })
  .catch(error => console.error(error))

const select = document.querySelector('#select-pages');
const table = document.querySelector('table');

function fillData (countries){
  const titles = ['No', 'Country', 'Capital', 'Languages', 'Area', 'Population'];
  //showTable(titles, countries);
  //function showTable(page, titles, countries){
  console.log(filter(countries, 'continents', 'America'));
  console.log(search(countries, 'name', 'Republic of Guatemala'));
  const lines = 15;
  const total = Math.ceil(countries.length/lines);
  createPagination(lines, total);
  showTable(1, lines, titles, countries)
  //select.addEventListener('change', showTable(select.text, lines, titles, countries));
  select.addEventListener('change', function(){
    showTable(parseInt(select.value)+1, lines, titles, countries);  
  });
}

function showTable(page, lines, titles, data){
  const init = (page - 1)*lines;
  const end = init + lines;
  const dataTable = data.slice(init, end);
  createTable(page, lines, titles, dataTable);
}

function createPagination(linesPage, totalPages){
  for(let i = 0; i < totalPages; i++){
    const option = document.createElement('option');
    option.value = i;
    option.text = i+1;
    select.add(option);
  }
}

/**
 * Pinta la tabla para mostrar los países
 * @param {'object'} titles - Títulos para la tabla
 * @param {'object'} data - Datos cargados del archivo countries.json
 */
function createTable(page, lines, titles, data){
  document.querySelector('article section[name="containerTabla"] h2').innerHTML = "Tabla de Países";
  //const list = tableCountries.children[2];
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  const caption = document.createElement('caption');
  caption.innerHTML = "Tabla de países";
  table.append(caption);

  const thead = document.createElement('thead');
  let tr = document.createElement('tr');
  for (const i of titles){
    const th = document.createElement('th');
    th.innerHTML = i;
    tr.append(th);
  }
  thead.append(tr);
  table.append(thead);

  // Fill the data
  const tbody = document.createElement('tbody');
  for (const i of data){
    tr = document.createElement('tr');
    for (const j of titles){
      const td = document.createElement('td');
      if (j === 'No'){
        td.innerHTML = `${(page-1)*lines + (data.indexOf(i)+1)}`;
      } else if (j === 'Country'){
        let name = `${i.name.common}\t\t${i.flag}`;
        (i.independent) ? name += '\t\t✅' : name += '\t\t❌';
        td.innerHTML = name;
      } else if ( j === 'Capital'){
        td.innerHTML = i.capital;
      } else if (j === 'Languages'){
        let lang = "";
        if(typeof(i.languages) === 'object'){
          for(const value of Object.values(i.languages)){
            lang += `${value},\t`;
          }
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
