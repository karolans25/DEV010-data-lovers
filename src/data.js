/**
 * Read the data from countries.json
 *
 * @param {string} dir - Data path.
 * @returns {json} Promise resolved with a json object.
 */
export const dataJson = async function storeResponse(dir) {
  const response = await fetch(dir);
  if (response.status !== 200) { 
    throw new Error('Hubo un problema accediendo al dataset.');
  }
  return await response.json();
}

/**
 * Look for countries that its common or official name or its capital starts
 * with he word: lookFor
 *
 * @param {Array of jsons} data - Data of countries for searching.
 * @param {string} lookFor - Word for searching coincidence.
 * @returns {array} Array of countries's json or empty array
 */
export const searchData = (data, lookFor) => {
  if(typeof data !== 'object' || typeof lookFor !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0){
    throw new TypeError("Los datos vienen incompletos");
  } else if (lookFor === ''){
    return data;
  }
  return data.filter(country => country.name.common.toLowerCase().startsWith(lookFor.toLowerCase()) || ((typeof(country.name.official) === 'string') ? country.name.official.toLowerCase().startsWith(lookFor.toLowerCase()) : false ) || ((typeof(country.capital) === 'object') ? country.capital.some(palabra => palabra.toLowerCase().startsWith(lookFor.toLowerCase())) : false ));
};

/**
 * Filter the data for the name of a continent given in lookFor
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @param {string} lookFor - Name of the continent.
 * @returns {array of json} Array of countries's json with continent key equals 
 * to lookFor
 */
export const filterDataByContinent = (data, lookFor) => {
  if(typeof data !== 'object' || typeof lookFor !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || lookFor === ''){
    throw new TypeError("Los datos vienen vacíos");
  }
  return data.filter(country => country.continents[0] === lookFor);
};

/**
 * Filter the data for the name of a subregion given in lookFor
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @param {string} lookFor - Name of the subregion.
 * @returns {array of json} Array of countries's json with subregion key equals 
 * to lookFor
 */
export const filterDataBySubregion = (data, lookFor) => {
  if(typeof data !== 'object' || typeof lookFor !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || lookFor === ''){
    throw new TypeError("Los datos vienen vacíos");
  }
  return data.filter(country => country.subregion === lookFor);
};

/**
 * Filter the data for the language spoken in a country
 * 
 * @param {Arary of json} data - Data of countries for searching.
 * @param {string} lookFor - Language 
 * @returns {array of json} Array of countries's json with continent key equals 
 * to lookFor
 */
export const filterDataByLanguage = (data, lookFor) => {
  if(typeof data !== 'object' || typeof lookFor !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || lookFor === ''){
    throw new TypeError("Los datos vienen vacíos");
  }
  const theCountries = [];
  for (const i of data){
    if(typeof(i.languages) === 'object'){
      if(Object.values(i.languages).includes(lookFor)){
        theCountries.push(i);
      }
    }
  }
  return theCountries;
};
  
/**
 * Sort the data by the common name of a country ascending (direction = 1) or 
 * descending (direction = -1)
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @param {number} direction - (ascending) 1 or (descending) -1
 * @returns {array of json} Array of countries's json sorted by common name
 */
export const sortDataByCountry = (data, direction) =>{
  if(typeof data !== 'object' || typeof direction !== 'number'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || ![1,-1].includes(direction)){
    throw new TypeError("Los datos vienen incompletos");
  }
  const result = data.sort((a, b) => {
    const aData = a.name.common.toUpperCase(); 
    const bData = b.name.common.toUpperCase();
    if (aData < bData) {
      return -1; //colocar a antes que b
    }
    if (aData > bData) {
      return 1; //colocar a después de b
    }
    return 0; //no cambiar el orden
  });
  if(parseInt(direction) === 1){
    return result;
  } else if (parseInt(direction) === -1){
    return result.reverse();
  }
}

/**
 * Sort the data by the first element of the array capital for each country 
 * ascending (direction = 1) or descending (direction = -1)
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @param {number} direction - (ascending) 1 or (descending) -1
 * @returns {array of json} Array of countries's json sorted by capital first 
 * element of the array capital for each country
 */
export const sortDataByCapital = (data, direction) =>{
  if(typeof data !== 'object' || typeof direction !== 'number'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || ![1,-1].includes(direction)){
    throw new TypeError("Los datos vienen incompletos");
  }
  let counter = 0;
  const result = data.sort((a, b) =>{
    let aData, bData;
    if (typeof a.capital === 'object') {
      aData = a.capital[0];
    } else {
      counter ++;
      const temp = data[data.length-counter];
      data[data.length-counter] = a;
      aData = temp;
    }
    if (typeof b.capital === 'object') {
      bData = b.capital[0];
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

  if(parseInt(direction) === 1){
    return result;
  } else if (parseInt(direction) === -1){
    return result.reverse();
  }
}

/**
 * Sort the data by the value for area for each country 
 * ascending (direction = 1) or descending (direction = -1)
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @param {number} direction - (ascending) 1 or (descending) -1
 * @returns {array of json} Array of countries's json sorted by its area value
 */
export const sortDataByArea = (data, direction) =>{
  if(typeof data !== 'object' || typeof direction !== 'number'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || ![1,-1].includes(direction)){
    throw new TypeError("Los datos vienen incompletos");
  }
  const result = data.sort((a, b) => {
    const aData = a.area;
    const bData = b.area;
    if (aData < bData) {
      return -1; //colocar a antes que b
    }
    if (aData > bData) {
      return 1; //colocar a después de b
    }
    return 0; //no cambiar el orden
  });
  if(parseInt(direction) === 1){
    return result;
  } else if (parseInt(direction) === -1){
    return result.reverse();
  }
}

/**
 * Sort the data by the value for population for each country 
 * ascending (direction = 1) or descending (direction = -1)
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @param {number} direction - (ascending) 1 or (descending) -1
 * @returns {array of json} Array of countries's json sorted by its population
 * value
 */
export const sortDataByPopulation = (data, direction) =>{
  if(typeof data !== 'object' || typeof direction !== 'number'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0 || ![1,-1].includes(direction)){
    throw new TypeError("Los datos vienen incompletos");
  }
  const result = data.sort((a, b) => {
    const aData = a.population;
    const bData = b.population;
    if (aData < bData) {
      return -1; //colocar a antes que b
    }
    if (aData > bData) {
      return 1; //colocar a después de b
    }
    return 0; //no cambiar el orden
  });
  if(parseInt(direction) === 1){
    return result;
  } else if (parseInt(direction) === -1){
    return result.reverse();
  }
}
  
/**
 * Return a json object with keys as countries's common name and gini index as * values
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @returns {json} Json with countries's common name as keys and gini indexes 
 * as values
 */
export const calculateGiniCanvas = (data, ...elements) => {
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


/**
 * Calculate the population density for each country and calculate the average population density for the data. 
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @returns {json} Json with keys: avergaeDensity and data. 
 * Data is a Json with keys: common name of countries and values: another Json. 
 * The las Json mentioned has area, population and density as keys.
 */
export const calculatePopulationDensity = (data, ...elements) => {
  if(Array.isArray(data) && elements.length === 0){
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

/**
 * Search the countries that has an specific timezone.
 *
 * @param {Arary of json} data - Data of countries for searching.
 * @param {data} data - Data of countries for searching.
 * @returns {Arary of json} Json with countries's common name as keys and gini indexes 
 * as values
 */
export const searchClockTimezones = (data, timezone,...elements) => {
  if(Array.isArray(data) && typeof timezone === 'string' && elements.length === 0){
    let temp = [];
    if(timezone === "UTC-12:00"){
      const utc = timezone.split('-').join('+');
      temp = data.filter(country => country.timezones.includes(timezone) || country.timezones.includes(utc));
    } else {
      temp = data.filter(country => country.timezones.includes(timezone));
    }
    return temp;
  } else {
    throw new TypeError("Ingresó datos inválidos");
  }
}