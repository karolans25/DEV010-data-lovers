export const dataJson = async function storeResponse(dir) {
  const response = await fetch(dir);
  if (response.status !== 200) { 
    throw new Error('Hubo un problema accediendo al dataset.');
  }
  return await response.json();
}

export const filter = (data, filterBy, lookFor) => {
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
};

export const sort = (data, sortBy, direction) =>{
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
  } /*else if (sortBy.toLowerCase() === 'capital'){
    let counter = 1;  
    result = data.sort((a, b) => {
      if (typeof a.capital !== 'object'){
        a.capital = ['❌'];
      } else if (typeof b.capital !== 'object'){
        b.capital = ['❌'];
      } else{
        result = data.sort((a, b) => {
          console.log(counter);
          console.log(a.capital[0]);
          console.log(b.capital[0]);
          const aData = a.capital[0].toUpperCase(); // convertir a mayúsculas para ordenar alfabéticamente correctamente
          const bData = b.capital[0].toUpperCase();
          if (aData < bData) {
            counter ++;
            return -1; // si a es menor que b según la orden alfabética, colocar a antes que b
          }
          if (aData > bData) {
            counter ++;
            return 1; // si a es mayor que b, colocar a después de b
          }
          return 0; // si los nombres son iguales, no cambiar el orden
        });
      }
    //result = a.capital[0].localeCompare(b.capital[0]);
    });
  }*/
  if(parseInt(direction) === 1){
    return result;
  } else if (parseInt(direction) === -1){
    return result.reverse();
  }
}

export const search = (data, lookFor) => {
  if(typeof data !== 'object' || typeof lookFor !== 'string'){
    throw new TypeError("Ingresó un valor inválido");
  } else if (data.length === 0){
    throw new TypeError("Los datos vienen incompletos");
  } else if (lookFor === ''){
    return data;
  }
  return data.filter(country => country.name.common.toLowerCase().startsWith(lookFor.toLowerCase()) || country.name.common.toLowerCase() === lookFor.lowerCase || ((typeof(country.name.official) === 'string') ? country.name.official.toLowerCase().startsWith(lookFor.toLowerCase()) : false ) || ((typeof(country.name.official) === 'string') ? country.name.official.toLowerCase().startsWith(lookFor.toLowerCase()) : false ) || ((typeof(country.capital) === 'object') ? country.capital[0].toLowerCase().startsWith(lookFor.toLowerCase()) : false ));
};


export const canvas = (data, ...elements) => {
  // 0: lookFor
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

export const densityPopulation = (data) => {
  if(typeof data !== 'object'){
    return {}
  } else if(typeof data === 'object'){
    let average = 0.0, counter = 0;
    const densityJson = {};
    console.log("151");
    for(let i = 0; i<data.length; i++){
      console.log("152");
      if(typeof data[i].population === 'number' && typeof data[i].area === 'number' && data[i].population !== 0 && data[i].area > 0){
        console.log("154");
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
  }
}