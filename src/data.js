export const dataJson = async function storeResponse(dir) {
//const dataJson = async function storeResponse(dir) {
  const response = await fetch(dir);
  if (response.status !== 200) { 
    throw new Error('Hubo un problema accediendo al dataset.');
  }
  return await response.json();
}

export const filter = (data, filterBy, lookFor) => {
//const filter = (data, filterBy, lookFor) => {
  if(typeof data !== 'object' || typeof filterBy !== 'string' || typeof lookFor !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || filterBy === '' || lookFor === ''){
    throw new TypeError("Los datos vienen vacíos");
  }
  if (filterBy.toLowerCase() === 'continents'){
    return data.filter(country => country.continents[0] === lookFor);
  } else if (filterBy.toLowerCase() === 'subregion'){
    return data.filter(country => country.subregion === lookFor);
  } else if (filterBy.toLowerCase() === 'languages'){
    const theCountries = [];
    for (const i of data){
      if(typeof(i.languages) === 'object'){
        if(Object.values(i.languages).includes(lookFor)){
          theCountries.push(i);
        }
      }
    }
    return theCountries;
  }
};

export const sort = (data, sortBy, direction) =>{
//const sort = (data, sortBy, direction) =>{
  if(typeof data !== 'object' || typeof sortBy !== 'string' || typeof direction !== 'number'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || sortBy === '' || ![1,-1].includes(direction)){
    throw new TypeError("Los datos vienen incompletos");
  }
  let result;
  if(sortBy.toLowerCase() === 'country'){
    result = data.sort((a, b) => {
      const aData = a.name.common.toUpperCase(); // convertir a mayúsculas para ordenar alfabéticamente correctamente
      const bData = b.name.common.toUpperCase();
      if (aData < bData) {
        return -1; // si a es menor que b según la orden alfabética, colocar a antes que b
      }
      if (aData > bData) {
        return 1; // si a es mayor que b, colocar a después de b
      }
      //return 0; // si los nombres son iguales, no cambiar el orden
    });
  } else if (sortBy.toLowerCase() === 'area'){
    result = data.sort((a, b) => {
      const aData = a.area;
      const bData = b.area;
      if (aData < bData) {
        return -1; // si a es menor que b, colocar a antes que b
      }
      if (aData > bData) {
        return 1; // si a es mayor que b, colocar a después de b
      }
      //return 0; // si los nombres son iguales, no cambiar el orden
    });
  } else if (sortBy.toLowerCase() === 'population'){
    result = data.sort((a, b) => {
      const aData = a.population;
      const bData = b.population;
      if (aData < bData) {
        return -1; // si a es menor que b, colocar a antes que b
      }
      if (aData > bData) {
        return 1; // si a es mayor que b, colocar a después de b
      }
      //return 0; // si los nombres son iguales, no cambiar el orden
    });
  } else if (sortBy.toLowerCase() === 'capital'){
    let counter = 0;
    result = data.sort((a, b) =>{
      let aData, bData;
      if (typeof a.capital === 'object') {
        aData = a.capital.sort()[0];
      } else {
        counter ++;
        const temp = data[data.length-counter];
        data[data.length-counter] = a;
        aData = temp;
      }
      if (typeof b.capital === 'object') {
        bData = b.capital.sort()[0];
      } else {
        counter ++;
        const temp = data[data.length-counter];
        data[data.length-counter] = b;
        bData = temp;
      }
      if (aData < bData){
        return -1;
      }
      if (aData > bData){
        return 1;
      }
    })
  }
  if(parseInt(direction) === 1){
    return result;
  } else if (parseInt(direction) === -1){
    return result.reverse();
  }
}

export const search = (data, lookFor) => {
//const search = (data, lookFor) => {
  if(typeof data !== 'object' || typeof lookFor !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0){
    throw new TypeError("Los datos vienen incompletos");
  } else if (lookFor === ''){
    return data;
  }
  return data.filter(country => country.name.common.toLowerCase().startsWith(lookFor.toLowerCase()) || ((typeof(country.name.official) === 'string') ? country.name.official.toLowerCase().startsWith(lookFor.toLowerCase()) : false ) || ((typeof(country.capital) === 'object') ? country.capital.some(palabra => palabra.toLowerCase().startsWith(lookFor.toLowerCase())) : false ));

};

export const canvas = (data, ...elements) => {
//const canvas = (data, ...elements) => {
  // 0: lookFor
  if(elements.length > 1){
    throw new TypeError("Revisar qué está ingresando adicional");
  }
  const yearExist = (elements.length > 0) ? true : false;
  let correctType;
  if(yearExist) correctType = typeof elements[0] === 'string';

  if(typeof data === 'object' && (!yearExist || correctType)){
    const countriesWithGini = {};
    for(let i = 0; i<data.length; i++){
      if(typeof data[i].gini === 'object' && (!yearExist || Object.keys(data[i].gini)[0] === elements[0])){
        countriesWithGini[data[i].name.common] = parseFloat(Object.values(data[i].gini)[0]).toFixed(1);
      }
    }

    const sortedCountriesWithGini = Object.fromEntries(
      Object.entries(countriesWithGini).sort((a, b) => a[1] - b[1]).reverse()
    );
    return sortedCountriesWithGini;
  } else {
    throw new TypeError("Error en el tipo de dato ingresado");
  }
};

export const densityPopulation = (data, ...elements) => {
//const densityPopulation = (data, ...elements) => {
  if(typeof data === 'object' && elements.length === 0){
    let average = 0.0, counter = 0;
    const densityJson = {};
    for(let i = 0; i<data.length; i++){
      if(typeof data[i].population === 'number' && typeof data[i].area === 'number' && data[i].population !== 0 && data[i].area > 0){
        average += parseFloat((data[i].population/data[i].area).toFixed(2));
        counter ++;
        densityJson[data[i].name.common] = 
        { area: data[i].area,
          population: data[i].population,
          density: parseFloat((data[i].population/data[i].area).toFixed(2))
        }
      }
    }
    if (counter > 0)
      average = parseFloat(average/counter).toFixed(2);
    return { averageDensity: average,
      data: densityJson
    }
  } else {
    throw new TypeError("Didn't pass any data");
  }
}

export const clockTimezones = (data, ...elements) => {
  if(typeof data !== 'object' || typeof elements[0] !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0){
    throw new TypeError("Los datos vienen incompletos");
  } else if (elements[0] === ''){
    return data;
  }
  const searchUTC = elements[0];
  if(searchUTC === "UTC-12:00"){
    return data.filter(country => country.timezones.includes(searchUTC) || country.timezones.includes("UTC+12:00"));
  } else {
    return data.filter(country => country.timezones.includes(searchUTC));
  }
}


/*
const DATA_TEMP = '[{"name":{"common":"South Africa","official":"Republic of South Africa"},"tld":[".za"],"independent":true,"capital":["Pretoria","Bloemfontein","Cape Town"],"subregion":"Southern Africa","languages":{"afr":"Afrikaans","eng":"English","nbl":"Southern Ndebele","nso":"Northern Sotho","sot":"Southern Sotho","ssw":"Swazi","tsn":"Tswana","tso":"Tsonga","ven":"Venda","xho":"Xhosa","zul":"Zulu"},"borders":["BWA","LSO","MOZ","NAM","SWZ","ZWE"],"area":1221037,"flag":"🇿🇦","population":59308690,"gini":{"2014":63},"fifa":"RSA","timezones":["UTC+02:00"],"continents":["Africa"],"flags":{"png":"https://flagcdn.com/w320/za.png","svg":"https://flagcdn.com/za.svg","alt":"The flag of South Africa is composed of two equal horizontal bands of red and blue, with a yellow-edged black isosceles triangle superimposed on the hoist side of the field. This triangle has its base centered on the hoist end, spans about two-fifth the width and two-third the height of the field, and is enclosed on its sides by the arms of a white-edged green horizontally oriented Y-shaped band which extends along the boundary of the red and blue bands to the fly end of the field."}},{"name":{"common":"Kosovo","official":"Republic of Kosovo"},"capital":["Pristina"],"subregion":"Southeast Europe","languages":{"sqi":"Albanian","srp":"Serbian"},"borders":["ALB","MKD","MNE","SRB"],"area":10908,"flag":"🇽🇰","population":1775378,"gini":{"2017":29},"fifa":"KVX","timezones":["UTC+01:00"],"continents":["Europe"],"flags":{"png":"https://flagcdn.com/w320/xk.png","svg":"https://flagcdn.com/xk.svg"}},{"name":{"common":"Antarctica","official":"Antarctica"},"tld":[".aq"],"independent":false,"area":14000000,"flag":"🇦🇶","population":1000,"timezones":["UTC-03:00","UTC+03:00","UTC+05:00","UTC+06:00","UTC+07:00","UTC+08:00","UTC+10:00","UTC+12:00"],"continents":["Antarctica"],"flags":{"png":"https://flagcdn.com/w320/aq.png","svg":"https://flagcdn.com/aq.svg"}}]';

console.log(DATA_TEMP);
console.log("");
console.log(JSON.stringify(sort(JSON.parse(DATA_TEMP), 'capital', 1)));
*/