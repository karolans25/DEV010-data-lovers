const DATA_TEMP = '[{"name":{"common":"South Africa","official":"Republic of South Africa"},"tld":[".za"],"independent":true,"capital":["Bloemfontein","Cape Town","Pretoria"],"subregion":"Southern Africa","languages":{"afr":"Afrikaans","eng":"English","nbl":"Southern Ndebele","nso":"Northern Sotho","sot":"Southern Sotho","ssw":"Swazi","tsn":"Tswana","tso":"Tsonga","ven":"Venda","xho":"Xhosa","zul":"Zulu"},"borders":["BWA","LSO","MOZ","NAM","SWZ","ZWE"],"area":1221037,"flag":"🇿🇦","population":59308690,"gini":{"2014":63},"fifa":"RSA","timezones":["UTC+02:00"],"continents":["Africa"],"flags":{"png":"https://flagcdn.com/w320/za.png","svg":"https://flagcdn.com/za.svg","alt":"The flag of South Africa is composed of two equal horizontal bands of red and blue, with a yellow-edged black isosceles triangle superimposed on the hoist side of the field. This triangle has its base centered on the hoist end, spans about two-fifth the width and two-third the height of the field, and is enclosed on its sides by the arms of a white-edged green horizontally oriented Y-shaped band which extends along the boundary of the red and blue bands to the fly end of the field."}},{"name":{"common":"Kosovo","official":"Republic of Kosovo"},"capital":["Pristina"],"subregion":"Southeast Europe","languages":{"sqi":"Albanian","srp":"Serbian"},"borders":["ALB","MKD","MNE","SRB"],"area":10908,"flag":"🇽🇰","population":1775378,"gini":{"2017":29},"fifa":"KVX","timezones":["UTC+01:00"],"continents":["Europe"],"flags":{"png":"https://flagcdn.com/w320/xk.png","svg":"https://flagcdn.com/xk.svg"}},{"name":{"common":"Antarctica","official":"Antarctica"},"tld":[".aq"],"independent":false,"area":14000000,"flag":"🇦🇶","population":1000,"timezones":["UTC-03:00","UTC+03:00","UTC+05:00","UTC+06:00","UTC+07:00","UTC+08:00","UTC+10:00","UTC+12:00"],"continents":["Antarctica"],"flags":{"png":"https://flagcdn.com/w320/aq.png","svg":"https://flagcdn.com/aq.svg"}}]';

const DATA_CANVAS = '{"Kosovo": "29.0", "South Africa": "63.0"}';

const DATA_DENSITY = '{"averageDensity": "70.44", "data": {"Antarctica": {"area": 14000000, "density": 0, "population": 1000}, "Kosovo": {"area": 10908, "density": 162.76, "population": 1775378}, "South Africa": {"area": 1221037, "density": 48.57, "population": 59308690}}}';


/* eslint-disable */
import {dataJson, filter, sort, search, canvas, densityPopulation } from '../src/data.js';

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

/**Test para la funcionalidad filter */
describe('filter', () => {
  it('is a function', () => {
    expect(typeof filter).toBe('function');
  });

  
  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => filter('')).toThrow(TypeError);
    expect(() => filter()).toThrow(TypeError);
    expect(() => filter(0)).toThrow(TypeError);
    expect(() => filter([],'', '')).toThrow(TypeError);
    expect(() => filter(null, [], undefined)).toThrow(TypeError);
    expect(() => filter(0, 0, 0)).toThrow(TypeError);
  });
  
  it(`should return ${[JSON.parse(DATA_TEMP)[1]]} for 'Continents' and 'Europe' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Continents', 'Europe')).toStrictEqual([JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return [] for 'Continents' and 'America' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Continents', 'America')).toStrictEqual([]);
  });

  it(`should return ${JSON.parse(DATA_TEMP)[1]} for 'Subregion' and 'Southeast Europe' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Subregion', 'Southeast Europe')).toStrictEqual([JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return [] for 'Subregion' and 'Australia and New Zealand' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Subregion', 'Australia and New Zealand')).toStrictEqual([]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0]]} for 'Languages' and 'English' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Languages', 'English')).toStrictEqual([JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return [] for 'Languages' and 'Spanish' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Languages', 'Spanish')).toStrictEqual([]);
  });

});

/**Test para sort */
describe('sort', () => {
  it('is a function', () => {
    expect(typeof sort).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => sort()).toThrow(TypeError);
    expect(() => sort(0)).toThrow(TypeError);
    expect(() => sort(null, [], undefined)).toThrow(TypeError);
    expect(() => sort([], '', 5)).toThrow(TypeError);
    expect(() => sort(0, 0, 0)).toThrow(TypeError);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 'country' and 1 (ascending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'country', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 'country' and 1 (ascending)`, () => {
    expect(sort([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]], 'country', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]} for 'country' and -1 (descending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'country', -1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2]]} for 'area' and 1 (ascending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'area', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]} for 'area' and -1(descending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'area', -1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 'population' and 1 (ascending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'population', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 'population' and 1 (ascending)`, () => {
    expect(sort([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]], 'population', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]} for 'population' and -1 (descending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'population', -1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]);
  });
  
  it(`should return ${JSON.parse(DATA_TEMP)} for 'capital' and 1 (ascending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'capital', 1)).toStrictEqual(JSON.parse(DATA_TEMP));
  });
  
  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]} for 'capital' and 1 (ascending)`, () => {
    expect(sort([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]], 'capital', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]} for 'capital' and -1 (descending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'capital', -1)).toStrictEqual([JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[0]]);
  });

});

/**Test para search */
describe('search', () => {
  it('is a function', () => {
    expect(typeof search).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => search()).toThrow(TypeError);
    expect(() => search([])).toThrow(TypeError);
    expect(() => search([], '')).toThrow(TypeError);
    expect(() => search(0)).toThrow(TypeError);
    expect(() => search(null, [], undefined)).toThrow(TypeError);
    expect(() => search(0, 0)).toThrow(TypeError);
  });

  it(`should return ${JSON.parse(DATA_TEMP)} for '' `, () => {
    expect(search(JSON.parse(DATA_TEMP), '')).toStrictEqual(JSON.parse(DATA_TEMP));
  });

  it(`should return ${[]} for 'Colombia' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'Colombia')).toStrictEqual([]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]} for 'pR' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'pR')).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0]]} for 'prEtOria' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'prEtOria')).toStrictEqual([JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[]} for 'prEtOriam' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'prEtOriam')).toStrictEqual([]);
  });
});

/**Test para canvas */
describe('canvas', () => {
  it('is a function', () => {
    expect(typeof canvas).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => canvas()).toThrow(TypeError);
    expect(() => canvas(0)).toThrow(TypeError);
    expect(() => canvas(null, [], undefined)).toThrow(TypeError);
    expect(() => canvas([], '', 5)).toThrow(TypeError);
    expect(() => canvas([], [])).toThrow(TypeError);
    expect(() => canvas(0, 0)).toThrow(TypeError);
  });

  it(`should return ${JSON.parse(DATA_CANVAS)} for ${JSON.parse(DATA_TEMP)}`, () => {
    expect(canvas(JSON.parse(DATA_TEMP))).toStrictEqual(JSON.parse(DATA_CANVAS));
  });
});

/**Test para densityPopulation */
describe('density population', () => {
  it('is a function', () => {
    expect(typeof densityPopulation).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => densityPopulation()).toThrow(TypeError);
    expect(() => densityPopulation(0)).toThrow(TypeError);
    expect(() => densityPopulation(null, [], undefined)).toThrow(TypeError);
    expect(() => densityPopulation([], '', 5)).toThrow(TypeError);
    expect(() => densityPopulation([], [])).toThrow(TypeError);
    expect(() => densityPopulation(0, 0)).toThrow(TypeError);
  });

  it(`should return ${JSON.parse(DATA_DENSITY)} for ${JSON.parse(DATA_TEMP)}`, () => {
    expect(densityPopulation(JSON.parse(DATA_TEMP))).toStrictEqual(JSON.parse(DATA_DENSITY));
  });
});
