const DATA_TEMP = '[{"name":{"common":"South Africa","official":"Republic of South Africa"},"tld":[".za"],"independent":true,"capital":["Bloemfontein","Cape Town","Pretoria"],"subregion":"Southern Africa","languages":{"afr":"Afrikaans","eng":"English","nbl":"Southern Ndebele","nso":"Northern Sotho","sot":"Southern Sotho","ssw":"Swazi","tsn":"Tswana","tso":"Tsonga","ven":"Venda","xho":"Xhosa","zul":"Zulu"},"borders":["BWA","LSO","MOZ","NAM","SWZ","ZWE"],"area":1221037,"flag":"🇿🇦","population":59308690,"gini":{"2014":63},"fifa":"RSA","timezones":["UTC+02:00"],"continents":["Africa"],"flags":{"png":"https://flagcdn.com/w320/za.png","svg":"https://flagcdn.com/za.svg","alt":"The flag of South Africa is composed of two equal horizontal bands of red and blue, with a yellow-edged black isosceles triangle superimposed on the hoist side of the field. This triangle has its base centered on the hoist end, spans about two-fifth the width and two-third the height of the field, and is enclosed on its sides by the arms of a white-edged green horizontally oriented Y-shaped band which extends along the boundary of the red and blue bands to the fly end of the field."}},{"name":{"common":"Kosovo","official":"Republic of Kosovo"},"capital":["Pristina"],"subregion":"Southeast Europe","languages":{"sqi":"Albanian","srp":"Serbian"},"borders":["ALB","MKD","MNE","SRB"],"area":10908,"flag":"🇽🇰","population":1775378,"gini":{"2017":29},"fifa":"KVX","timezones":["UTC+01:00"],"continents":["Europe"],"flags":{"png":"https://flagcdn.com/w320/xk.png","svg":"https://flagcdn.com/xk.svg"}},{"name":{"common":"Antarctica","official":"Antarctica"},"tld":[".aq"],"independent":false,"area":14000000,"flag":"🇦🇶","population":1000,"timezones":["UTC-03:00","UTC+03:00","UTC+05:00","UTC+06:00","UTC+07:00","UTC+08:00","UTC+10:00","UTC+12:00"],"continents":["Antarctica"],"flags":{"png":"https://flagcdn.com/w320/aq.png","svg":"https://flagcdn.com/aq.svg"}}]';

const DATA_CANVAS = '{"Kosovo": "29.0", "South Africa": "63.0"}';

const DATA_DENSITY = '{"averageDensity": "70.44", "data": {"Antarctica": {"area": 14000000, "density": 0, "population": 1000}, "Kosovo": {"area": 10908, "density": 162.76, "population": 1775378}, "South Africa": {"area": 1221037, "density": 48.57, "population": 59308690}}}';


/* eslint-disable */
import {dataJson, searchData, filterDataByContinent, filterDataBySubregion, filterDataByLanguage, sortDataByCountry, sortDataByCapital, sortDataByArea, sortDataByPopulation, calculateGiniCanvas, calculatePopulationDensity, searchClockTimezones } from '../src/data.js';

/**Test para las función de cargar la data */
describe('All test of get data',(done)=>{
  it('is a function', () => {
    expect(typeof dataJson).toBe('function');
  });

  global.fetch = jest.fn(); //Así se crea un mock de una función
  it('should return parsed JSON data if response status is 200', async () => {
      const mockResponse = JSON.parse(DATA_TEMP);
      const mockJsonPromise = Promise.resolve(mockResponse);
      const mockFetchPromise = Promise.resolve({
        status: 200,
        json: () => mockJsonPromise,
      });

      fetch.mockImplementation(() => mockFetchPromise);

      const result = await dataJson('/path/to/data.json');

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/path/to/data.json');
      expect(result).toEqual(mockResponse);
    });

    it('throws an error when response status is not 200', async () => {
      const mockResponse = {
        status: 404,
        json: jest.fn().mockResolvedValue({ message: 'not found' })
      };
      jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

      await expect(dataJson('/path/to/data.json')).rejects.toThrow('Hubo un problema accediendo al dataset.');
      expect(global.fetch).toHaveBeenCalledWith('/path/to/data.json');
    });
});

/** OTRA FORMA DE HACERLO
describe('storeResponse', () => {
  it('returns the parsed JSON when response status is 200', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue(JSON.parse(DATA_TEMP))
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    const result = await dataJson('/path/to/data.json');
    
    expect(global.fetch).toHaveBeenCalledWith('/path/to/data.json');
    expect(result).toEqual(JSON.parse(DATA_TEMP));
  });

  it('throws an error when response status is not 200', async () => {
    const mockResponse = {
      status: 404,
      json: jest.fn().mockResolvedValue({ message: 'not found' })
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await expect(dataJson('/path/to/data.json')).rejects.toThrow('Hubo un problema accediendo al dataset.');
    expect(global.fetch).toHaveBeenCalledWith('/path/to/data.json');
  });
});
*/


/**Test para searchData */
describe('searchData', () => {
  it('is a function', () => {
    expect(typeof searchData).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => searchData()).toThrow(TypeError);
    expect(() => searchData([])).toThrow(TypeError);
    expect(() => searchData([], '')).toThrow(TypeError);
    expect(() => searchData(0)).toThrow(TypeError);
    expect(() => searchData(null, [], undefined)).toThrow(TypeError);
    expect(() => searchData(0, 0)).toThrow(TypeError);
  });

  it(`should return ${JSON.parse(DATA_TEMP)} for '' `, () => {
    expect(searchData(JSON.parse(DATA_TEMP), '')).toStrictEqual(JSON.parse(DATA_TEMP));
  });

  it(`should return ${[]} for 'Colombia' `, () => {
    expect(searchData(JSON.parse(DATA_TEMP), 'Colombia')).toStrictEqual([]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]} for 'pR' `, () => {
    expect(searchData(JSON.parse(DATA_TEMP), 'pR')).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0]]} for 'prEtOria' `, () => {
    expect(searchData(JSON.parse(DATA_TEMP), 'prEtOria')).toStrictEqual([JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[]} for 'prEtOriam' `, () => {
    expect(searchData(JSON.parse(DATA_TEMP), 'prEtOriam')).toStrictEqual([]);
  });
});


/**Test para la funcionalidad filter */
describe('filterDataByContinent', () => {
  it('is a function', () => {
    expect(typeof filterDataByContinent).toBe('function');
  });

  
  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => filterDataByContinent('')).toThrow(TypeError);
    expect(() => filterDataByContinent()).toThrow(TypeError);
    expect(() => filterDataByContinent(0)).toThrow(TypeError);
    expect(() => filterDataByContinent([],'', '')).toThrow(TypeError);
    expect(() => filterDataByContinent(null, [], undefined)).toThrow(TypeError);
    expect(() => filterDataByContinent(0, 0, 0)).toThrow(TypeError);
  });
  
  it(`should return ${[JSON.parse(DATA_TEMP)[1]]} for 'Europe' `, () => {
    expect(filterDataByContinent(JSON.parse(DATA_TEMP), 'Europe')).toStrictEqual([JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return [] for 'America' `, () => {
    expect(filterDataByContinent(JSON.parse(DATA_TEMP), 'America')).toStrictEqual([]);
  });

});

/**Test para la funcionalidad filter */
describe('filterDataBySubregion', () => {
  it('is a function', () => {
    expect(typeof filterDataBySubregion).toBe('function');
  });

  
  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => filterDataBySubregion('')).toThrow(TypeError);
    expect(() => filterDataBySubregion()).toThrow(TypeError);
    expect(() => filterDataBySubregion(0)).toThrow(TypeError);
    expect(() => filterDataBySubregion([],'', '')).toThrow(TypeError);
    expect(() => filterDataBySubregion(null, [], undefined)).toThrow(TypeError);
    expect(() => filterDataBySubregion(0, 0, 0)).toThrow(TypeError);
  });
  
  it(`should return ${JSON.parse(DATA_TEMP)[1]} for 'Southeast Europe' `, () => {
    expect(filterDataBySubregion(JSON.parse(DATA_TEMP), 'Southeast Europe')).toStrictEqual([JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return [] for 'Australia and New Zealand' `, () => {
    expect(filterDataBySubregion(JSON.parse(DATA_TEMP), 'Australia and New Zealand')).toStrictEqual([]);
  });

});

/**Test para la funcionalidad filterDataByLanguage */
describe('filterDataByLanguage', () => {
  it('is a function', () => {
    expect(typeof filterDataByLanguage).toBe('function');
  });

  
  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => filterDataByLanguage('')).toThrow(TypeError);
    expect(() => filterDataByLanguage()).toThrow(TypeError);
    expect(() => filterDataByLanguage(0)).toThrow(TypeError);
    expect(() => filterDataByLanguage([],'', '')).toThrow(TypeError);
    expect(() => filterDataByLanguage(null, [], undefined)).toThrow(TypeError);
    expect(() => filterDataByLanguage(0, 0, 0)).toThrow(TypeError);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0]]} for 'English' `, () => {
    expect(filterDataByLanguage(JSON.parse(DATA_TEMP), 'English')).toStrictEqual([JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return [] for 'Languages' and 'Spanish' `, () => {
    expect(filterDataByLanguage(JSON.parse(DATA_TEMP), 'Spanish')).toStrictEqual([]);
  });

});


/**Test para sortDataByCountry */
describe('sortDataByCountry', () => {
  it('is a function', () => {
    expect(typeof sortDataByCountry).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => sortDataByCountry()).toThrow(TypeError);
    expect(() => sortDataByCountry(0)).toThrow(TypeError);
    expect(() => sortDataByCountry(null, [], undefined)).toThrow(TypeError);
    expect(() => sortDataByCountry([], '', 5)).toThrow(TypeError);
    expect(() => sortDataByCountry(0, 0, 0)).toThrow(TypeError);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 1 (ascending)`, () => {
    expect(sortDataByCountry(JSON.parse(DATA_TEMP), 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 1 (ascending)`, () => {
    expect(sortDataByCountry([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]], 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]} for -1 (descending)`, () => {
    expect(sortDataByCountry(JSON.parse(DATA_TEMP), -1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]);
  });
});


/**Test para sortDataByArea */
describe('sortDataByArea', () => {
  it('is a function', () => {
    expect(typeof sortDataByArea).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => sortDataByArea()).toThrow(TypeError);
    expect(() => sortDataByArea(0)).toThrow(TypeError);
    expect(() => sortDataByArea(null, [], undefined)).toThrow(TypeError);
    expect(() => sortDataByArea([], '', 5)).toThrow(TypeError);
    expect(() => sortDataByArea(0, 0, 0)).toThrow(TypeError);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2]]} for 1 (ascending)`, () => {
    expect(sortDataByArea(JSON.parse(DATA_TEMP), 1)).toStrictEqual([JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]} for -1(descending)`, () => {
    expect(sortDataByArea(JSON.parse(DATA_TEMP), -1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]);
  });

});

/**Test para sortDataByPopulation */
describe('sortDataByPopulation', () => {
  it('is a function', () => {
    expect(typeof sortDataByPopulation).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => sortDataByPopulation()).toThrow(TypeError);
    expect(() => sortDataByPopulation(0)).toThrow(TypeError);
    expect(() => sortDataByPopulation(null, [], undefined)).toThrow(TypeError);
    expect(() => sortDataByPopulation([], '', 5)).toThrow(TypeError);
    expect(() => sortDataByPopulation(0, 0, 0)).toThrow(TypeError);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 1 (ascending)`, () => {
    expect(sortDataByPopulation(JSON.parse(DATA_TEMP), 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 1 (ascending)`, () => {
    expect(sortDataByPopulation([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]], 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]} for  -1 (descending)`, () => {
    expect(sortDataByPopulation(JSON.parse(DATA_TEMP), -1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]);
  });
  
});

/**Test para sortDataByCapital */
describe('sortDataByCapital', () => {
  it('is a function', () => {
    expect(typeof sortDataByCapital).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => sortDataByCapital()).toThrow(TypeError);
    expect(() => sortDataByCapital(0)).toThrow(TypeError);
    expect(() => sortDataByCapital(null, [], undefined)).toThrow(TypeError);
    expect(() => sortDataByCapital([], '', 5)).toThrow(TypeError);
    expect(() => sortDataByCapital(0, 0, 0)).toThrow(TypeError);
  });
  
  it(`should return ${JSON.parse(DATA_TEMP)} for and 1 (ascending)`, () => {
    expect(sortDataByCapital(JSON.parse(DATA_TEMP), 1)).toStrictEqual(JSON.parse(DATA_TEMP));
  });
  
  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]} for 1 (ascending)`, () => {
    expect(sortDataByCapital([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]], 1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for -1 (descending)`, () => {
    expect(sortDataByCapital(JSON.parse(DATA_TEMP), -1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

});


/**Test para calculateGiniCanvas */
describe('calculateGiniCanvas', () => {
  it('is a function', () => {
    expect(typeof calculateGiniCanvas).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => calculateGiniCanvas()).toThrow(TypeError);
    expect(() => calculateGiniCanvas(0)).toThrow(TypeError);
    expect(() => calculateGiniCanvas(null, [], undefined)).toThrow(TypeError);
    expect(() => calculateGiniCanvas([], '', 5)).toThrow(TypeError);
    expect(() => calculateGiniCanvas([], [])).toThrow(TypeError);
    expect(() => calculateGiniCanvas(0, 0)).toThrow(TypeError);
  });

  it(`should return ${JSON.parse(DATA_CANVAS)} for ${JSON.parse(DATA_TEMP)}`, () => {
    expect(calculateGiniCanvas(JSON.parse(DATA_TEMP))).toStrictEqual(JSON.parse(DATA_CANVAS));
  });
});

/**Test para calculatePopulationDensity */
describe('calculatePopulationDensity', () => {
  it('is a function', () => {
    expect(typeof calculatePopulationDensity).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => calculatePopulationDensity()).toThrow(TypeError);
    expect(() => calculatePopulationDensity(0)).toThrow(TypeError);
    expect(() => calculatePopulationDensity(null, [], undefined)).toThrow(TypeError);
    expect(() => calculatePopulationDensity([], '', 5)).toThrow(TypeError);
    expect(() => calculatePopulationDensity([], [])).toThrow(TypeError);
    expect(() => calculatePopulationDensity(0, 0)).toThrow(TypeError);
  });

  it(`should return ${JSON.parse(DATA_DENSITY)} for ${JSON.parse(DATA_TEMP)}`, () => {
    expect(calculatePopulationDensity(JSON.parse(DATA_TEMP))).toStrictEqual(JSON.parse(DATA_DENSITY));
  });
});

/**Test para searchClockTimezones */
describe('searchClockTimezones', () => {
  it('is a function', () => {
    expect(typeof searchClockTimezones).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => searchClockTimezones()).toThrow(TypeError);
    expect(() => searchClockTimezones(0)).toThrow(TypeError);
    expect(() => searchClockTimezones(null, [], undefined)).toThrow(TypeError);
    expect(() => searchClockTimezones([], '', 5)).toThrow(TypeError);
    expect(() => searchClockTimezones([], [])).toThrow(TypeError);
    expect(() => searchClockTimezones(0, 0)).toThrow(TypeError);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0]]} for UTC+02:00`, () => {
    expect(searchClockTimezones(JSON.parse(DATA_TEMP), 'UTC+02:00')).toStrictEqual([JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${JSON.parse(DATA_TEMP)[1]} for UTC+01:00`, () => {
    expect(searchClockTimezones(JSON.parse(DATA_TEMP), 'UTC+01:00')).toStrictEqual([JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return ${JSON.parse(DATA_TEMP)[2]} for UTC-03:00`, () => {
    expect(searchClockTimezones(JSON.parse(DATA_TEMP), 'UTC-03:00')).toStrictEqual([JSON.parse(DATA_TEMP)[2]]);
  });

  it(`should return ${[]} for UTC-05:00`, () => {
    expect(searchClockTimezones(JSON.parse(DATA_TEMP), 'UTC-05:00')).toStrictEqual([]);
  });

});
