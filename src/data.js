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
    console.log(theCountries);
    return theCountries;
    /*
    console.log(Object.keys(data[0].laguages));
    return data.filter(country => { 
      for (const i of Object.keys(country.laguages)){
        if(i === lookFor){
          return true;
        }  
      }});
    */
  }
};

export const sort = (data, sortBy, direction) =>{
  console.log(sortBy);
  console.log(direction);
  return `Hola ${data};`
}

export const search = (data, searchBy, lookFor) => {
  if (searchBy === 'name'){
    return data.find(country => country.name.common === lookFor || country.name.official === lookFor);
  } else {
    return false;
  }
};