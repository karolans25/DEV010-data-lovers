export const filter = (data, filterBy, lookFor) => {
  if (filterBy === 'continents'){
    return data.filter(country => country.continents[0] === lookFor);
  } else {
    return false;
  }
};

export const search = (data, searchBy, lookFor) => {
  if (searchBy === 'name'){
    return data.find(country => country.name.common === lookFor || country.name.official === lookFor);
  } else {
    return false;
  }
};

export const name = (name) =>{
  return `Hola ${name}`
}
