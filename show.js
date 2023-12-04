/**
 * =============================================================================
 * Functions:
 * =============================================================================
 * Exported:
 * ---------------------------------------------------------------------------- 
 * printData(data, cards, table, backBut, forwardBut, pageSelector, lines, check)
 * 
 * createPaginator(totalPages, pageSelector)
 * 
 * showTable(countries, table, page, lines)
 * 
 * showCards(countries, cards, page, lines)
 * 
 * moveBetweenPages(thePage, backBut, theData, lines, forwardBut, inputToggle, tables, cards, event)
 * =============================================================================
 * Locals: 
 * ---------------------------------------------------------------------------- 
 * createTable(page, data, lines, table)
 * 
 * createCards(countries, cards)
 * =============================================================================
*/
const titles = ['No', 'Country', 'Capital', 'Languages', 'Area', 'Population', 'Gini'];
let data, cards, table, lines, page;

export const printData = (data, cards, table, backBut, forwardBut, pageSelector, lines, check) => {
  const totalPages = Math.ceil(data.length/lines);
  if(totalPages === 1){
    backBut.disabled = true;
    forwardBut.disabled = true;
  } else {
    forwardBut.disabled = false;
  }
  createPaginator(totalPages, pageSelector);
  if (check){
    showTable(data, table, parseInt(pageSelector.value) + 1, lines);
  } else{
    showCards(data, cards, parseInt(pageSelector.value) + 1, lines);
  }
}

export const createPaginator = (totalPages, pageSelector) => {
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

export const showTable = (theData, theTable, thePage, theLines) => {
  data = theData;
  table = theTable;
  lines = theLines;
  page = thePage;
  const initial = (page - 1)*lines;
  const final = initial + lines;
  if(data.length > 1){
    const dataTable = data.slice(initial, final);
    createTable(page, dataTable, lines, table);
  } else{
    createTable(page, data, lines, table);
  }
}
  
export const showCards = (theData, theCards, thePage, theLines) => {
  data = theData;
  cards = theCards;
  page = thePage;
  lines = theLines;
  const initial = (page - 1)*lines;
  const final = initial + lines;
  if(data.length > 1){
    const dataTable = data.slice(initial, final);
    createCards(dataTable, cards);
  } else{
    createCards(data, cards);
  }
}

export const showFlags = (theData, containerFlagsClock) => {
  while (containerFlagsClock.firstChild) {
    containerFlagsClock.removeChild(containerFlagsClock.firstChild);
  }

  theData.forEach(country => {
    const cardFlag = document.createElement('section');
    const theFlag = document.createElement('img');
    theFlag.className = "flip-card-img";
    theFlag.src = country.flags.png;
    if(typeof country.flags.alt === 'string'){
      theFlag.alt = country.flags.alt;
    }
    theFlag.style.width = "300px";
    theFlag.style.height = "180px";
    const label = document.createElement('h4');
    label.innerHTML = country.name.common;
    
    cardFlag.append(label);
    cardFlag.append(theFlag);
    containerFlagsClock.append(cardFlag);
  });
}

const createTable = (thePage, theData, theLines, theTable) =>{
  page = thePage;
  data = theData;
  lines = theLines;
  table = theTable;
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
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
  /**Implementar esto con .map */
  const tbody = document.createElement('tbody');
  for (const i of data){
    tr = document.createElement('tr');
    for (const j of titles){
      const td = document.createElement('td');
      if (j === 'No'){
        td.innerHTML = `${(page-1)*lines + (data.indexOf(i)+1)}`;
      } else if (j === 'Country'){
        let name = `${i.name.common}\t${i.flag}`;
        (typeof i.independent === 'boolean')? ((i.independent) ? name += '\t✅' : name += '\t❌') : name += '\t🚫';
        const abbr = document.createElement('abbr');
        abbr.title = i.name.official;
        abbr.innerHTML = name;
        td.appendChild(abbr);
  
      } else if ( j === 'Capital'){
        if (typeof(i.capital) === 'object'){
          i.capital.sort().forEach(element => {
            td.innerHTML += element + ', ';          
          });
          td.innerHTML = td.innerHTML.slice(0,-2);
        } else {
          td.innerHTML = '🚫  ';
        }
      } else if (j === 'Languages'){
        let lang = "";
        if(typeof(i.languages) === 'object'){
          for(const key of Object.keys(i.languages)){
            lang += `${key},\t`;
          }
        } else {
          lang = "🚫,\t";
        }
        td.innerHTML = lang.slice(0,-2);
      }   else if (j === 'Area'){
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
          td.innerHTML = "🚫";
        }
      }
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
}
  
const createCards = (theData, theCards) => {
  data = theData;
  cards = theCards;  
  while (cards.firstChild) {
    cards.removeChild(cards.firstChild);
  }
  for (const i of data){
    const section1 = document.createElement('section');
    section1.className = "flip-card";
  
    const section2 = document.createElement('section');
    section2.className = "flip-card-inner";
  
    const section3 = document.createElement('section');
    section3.className = "flip-card-front";
    const img = document.createElement('img');
    img.className = "flip-card-img";
    img.src = i.flags.png;
    img.alt = i.flags.alt;
  
    const section4 = document.createElement('section');
    section4.className = 'flip-card-back';

    const asideInfo = document.createElement('aside');
    asideInfo.className = "aside-info";
    const title = document.createElement('h2');
    title.innerHTML = `${i.name.common}`;
    const subtitle = document.createElement('h5');
    subtitle.innerHTML = `${i.name.official}\t${(typeof i.independent === 'boolean') ? ((i.independent) ? '✅' : '❌') : '🚫'}`;
    const pCapital = document.createElement('p');
    pCapital.innerHTML = 'Capital: '.bold();
    if (typeof(i.capital) === 'object'){
      i.capital.sort().forEach(element => {
        pCapital.innerHTML += element + ', ';          
      });
      pCapital.innerHTML = pCapital.innerHTML.slice(0,-2);
    } else {
      pCapital.innerHTML += '🚫';
    }
    const pArea = document.createElement('p');
    pArea.innerHTML = (typeof i.area === 'number') ? 'Area: '.bold() + i.area : 'Area: '.bold() + ' 🚫';
    const pPopulation = document.createElement('p');
    pPopulation.innerHTML = (typeof i.population === 'number') ? 'Population: '.bold() + i.population : 'Population: '.bold() + ' 🚫';
    const pGini = document.createElement('p');
    if (typeof i.gini === 'object'){
      pGini.innerHTML = 'Gini: '.bold();
      for (const k of Object.keys(i.gini)){
        const abbr = document.createElement('abbr');
        abbr.title = k;
        abbr.innerHTML = parseFloat(i.gini[`${k}`]).toFixed(1);
        pGini.appendChild(abbr);
      }
    } else {
      pGini.innerHTML = 'Gini: '.bold() + ' 🚫';
    }
    asideInfo.append(title);
    asideInfo.append(subtitle);
    asideInfo.append(pCapital);
    asideInfo.append(pArea);
    asideInfo.append(pPopulation);
    asideInfo.append(pGini);

    if(i.continents[0] === 'America'){
      section3.style.backgroundColor = 'lightgreen';
      section4.style.backgroundColor = 'lightgreen';
    } else if(i.continents[0] === 'Asia'){
      section3.style.backgroundColor = 'lightseagreen';
      section4.style.backgroundColor = 'lightseagreen';
    } else if(i.continents[0] === 'Europe'){
      section3.style.backgroundColor = 'lightyellow';
      section4.style.backgroundColor = 'lightyellow';
    } else if(i.continents[0] === 'Africa'){
      section3.style.backgroundColor = 'lightblue';
      section4.style.backgroundColor = 'lightblue';
    } else if(i.continents[0] === 'Oceania'){
      section3.style.backgroundColor = 'lightcoral';
      section4.style.backgroundColor = 'lightcoral';
    } else if(i.continents[0] === 'Antarctica'){
      section3.style.backgroundColor = 'lightpink';
      section4.style.backgroundColor = 'lightpink';
    }
    section4.style.color = "#1D0030";
    
    cards.append(section1);
    section1.appendChild(section2);
    section2.appendChild(section3);
    section2.appendChild(section4);
    section3.appendChild(img);
    section4.appendChild(asideInfo);
  }
}
