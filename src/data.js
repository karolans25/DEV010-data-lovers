export const dataJson = async function storeResponse(dir) {
  const response = await fetch(dir);
  if (response.status !== 200) { 
    throw new Error('Hubo un problema accediendo al dataset.');
  }
  return await response.json();
}

export const filter = (data, filterBy, lookFor) => {
  if (filterBy === 'continents'){
    return data.filter(country => country.continents[0] === lookFor);
  } else if (filterBy === 'subregion'){
    return data.filter(country => country.subregion === lookFor);
  } else if (filterBy === 'languages'){
    const theCountries = [];
    for (const i of data){
      if(typeof(i.languages) === 'undefined'){
        continue;
      }
      if(Object.keys(i.languages).includes(lookFor)){
        theCountries.push(i);
      }
    }
    return theCountries;
  }
};

export const sort = (data, sortBy, direction) =>{
  console.log(sortBy);
  console.log(direction);
  return `Hola ${data};`
}

export const search = (data, lookFor) => {
  console.log(lookFor);
  /*
  const result =  data.filter(country => country.name.common.startsWith(lookFor) || country.name.common === lookFor || country.name.official.startsWith(lookFor) || country.name.offcial === lookFor);
  */
  if(lookFor === ''){
    return data;
  } else {
    return data.filter(country => country.name.common.startsWith(lookFor) || country.name.common === lookFor || country.name.official.startsWith(lookFor) || country.name.offcial === lookFor || ((typeof(country.capital) === 'object') ? country.capital[0].startsWith(lookFor) : false ));
  }
  
  
  
  //(country.capital[0] !== 'undefined') ? country.capital[0].startsWith(lookFor) || country.capital[0] === lookFor : country.name.oficial.startsWith(lookFor));// || country.name.official.startsWith(lookFor));// || country.fifa.startsWith(lookFor.toUpperCase())); //|| country.tld[0] === lookFor);
  //country.name.official.startsWidth(lookFor) || country.name.common.startsWith(lookFor) || country.fifa.startsWidth(lookFor.toUpperCase()));
  /*if (result[0].length === 0){
    result = [];  
  }*/
  if (result.length === 0){
    //
  } else {
    return result;
  }
};