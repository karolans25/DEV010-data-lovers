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
  let result;
  if(sortBy === 'country'){
    result = data.sort((a, b) => {
      const aData = a.name.common.toUpperCase(); // convertir a mayúsculas para ordenar alfabéticamente correctamente
      const bData = b.name.common.toUpperCase();
      if (aData < bData) {
        return -1; // si a es menor que b según la orden alfabética, colocar a antes que b
      }
      if (aData > bData) {
        return 1; // si a es mayor que b, colocar a después de b
      }
      return 0; // si los nombres son iguales, no cambiar el orden
    });
  } else if (sortBy === 'capital'){
    result = data.sort(function(a, b) {
      if (typeof a.capital === 'object' && typeof b.capital === 'object'){
        result = a.capital[0].localeCompare(b.capital[0]);
      }
    });
  }
  if(parseInt(direction) === 1){
    return result;
  } else if (parseInt(direction) === -1){
    return result.reverse();
  }
}


export const search = (data, lookFor) => {
  if(lookFor === ''){
    return data;
  } else {
    return data.filter(country => country.name.common.toLowerCase().startsWith(lookFor.toLowerCase()) || country.name.common.toLowerCase() === lookFor.lowerCase || ((typeof(country.name.official) === 'string') ? country.name.official.toLowerCase().startsWith(lookFor.toLowerCase()) : false ) || ((typeof(country.name.official) === 'string') ? country.name.official.toLowerCase().startsWith(lookFor.toLowerCase()) : false ) || ((typeof(country.capital) === 'object') ? country.capital[0].toLowerCase().startsWith(lookFor.toLowerCase()) : false ));
  }
};
/*
export const flags = (data) => 

function flags(data){
  const numColors = [];
  for (const i of data){
    if(typeof i.flags !== 'object' || typeof i.flags.alt !== 'string'){
      continue;
    } else {
      const texto = i.flags.alt;
      const colores = ["green", "golden-yellow", "red", "yellow", "blue", "black", "white", "orange", "purple", "light-blue", "carmine-red", "dark-blue", "navy-blue", "saffron", "sky-blue", "ultramarine", "gold", "golden", "yellow-sun", "teal", "cobalt-blue", "turquoise", "brown-edge", "copper-colored", "maroon"];
      const coloresEncontrados = [];

      // Encuentra todas las palabras completas que coinciden con los colores y agrega cada color una sola vez
      colores.forEach(color => {
        const regex = new RegExp("\\b" + color + "\\b", "ig");
        if (texto.match(regex) && !coloresEncontrados.includes(color)) {
          coloresEncontrados.push(color);
        }
      });
      console.log(texto);
      console.log(coloresEncontrados);
      numColors.push(coloresEncontrados.length);
    }
  }
  console.log(numColors);

  let mayor = numColors[0];
  for(const i of numColors){
    if (i > mayor){
      mayor = i;
    }
  }

  return data[numColors.indexOf(mayor)];
}
*/