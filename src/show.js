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
//const titles = ['No', 'Country', 'Capital', 'Area', 'Population', 'Gini'];
let data, cards, table, lines, page;

export const printData = (data, cards, table, backBut, forwardBut, pageSelector, lines, check) => {
  const totalPages = Math.ceil(data.length/lines);
  //Revisar que el alert salga una sola vez
  if(totalPages === 0){
    alert("Didn't find countries according to your searching parameters.");
  }
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
        (i.independent) ? name += '\t✅' : name += '\t❌';
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
          td.innerHTML = "❌";
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
      div3.style.backgroundColor = '#FFFB7B';
      div4.style.backgroundColor = '#FFFB7B';
    } else if(i.continents[0] === 'Asia'){
      div3.style.backgroundColor = '#CBADE0';
      div4.style.backgroundColor = '#CBADE0';
    } else if(i.continents[0] === 'Europe'){
      div3.style.backgroundColor = '#FCC2D2';
      div4.style.backgroundColor = '#FCC2D2';
    } else if(i.continents[0] === 'Africa'){
      div3.style.backgroundColor = 'lightgreen';
      div4.style.backgroundColor = 'lightgreen';
    } else if(i.continents[0] === 'Oceania'){
      div3.style.backgroundColor = 'lightblue';
      div4.style.backgroundColor = 'lightblue';
    } else if(i.continents[0] === 'Antarctica'){
      div3.style.backgroundColor = '#A3C7E3';
      div4.style.backgroundColor = '#A3C7E3';
    }
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