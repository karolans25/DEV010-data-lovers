const DATA_TEMP = '[{"name":{"common":"Turks and Caicos Islands","official":"Turks and Caicos Islands"},"tld":[".tc"],"independent":false,"capital":["Cockburn Town"],"subregion":"Caribbean","languages":{"eng":"English"},"area":948,"flag":"🇹🇨","population":38718,"fifa":"TCA","timezones":["UTC-04:00"],"continents":["America"],"flags":{"png":"https://flagcdn.com/w320/tc.png","svg":"https://flagcdn.com/tc.svg"}},{"name":{"common":"Colombia","official":"Republic of Colombia"},"tld":[".co"],"independent":true,"capital":["Bogotá"],"subregion":"South America","languages":{"spa":"Spanish"},"borders":["BRA","ECU","PAN","PER","VEN"],"area":1141748,"flag":"🇨🇴","population":50882884,"gini":{"2019":51.3},"fifa":"COL","timezones":["UTC-05:00"],"continents":["America"],"flags":{"png":"https://flagcdn.com/w320/co.png","svg":"https://flagcdn.com/co.svg","alt":"The flag of Colombia is composed of three horizontal bands of yellow, blue and red, with the yellow band twice the height of the other two bands."}},{"name":{"common":"Malaysia","official":"Malaysia"},"tld":[".my"],"independent":true,"capital":["Kuala Lumpur"],"subregion":"South-Eastern Asia","languages":{"eng":"English","msa":"Malay"},"borders":["BRN","IDN","THA"],"area":330803,"flag":"🇲🇾","population":32365998,"gini":{"2015":41.1},"fifa":"MAS","timezones":["UTC+08:00"],"continents":["Asia"],"flags":{"png":"https://flagcdn.com/w320/my.png","svg":"https://flagcdn.com/my.svg","alt":"The flag of Malaysia is composed of fourteen equal horizontal bands of red alternating with white. A blue rectangle, bearing a fly-side facing yellow crescent and a fourteen-pointed yellow star placed just outside the crescent opening, is superimposed in the canton."}}]';

const COLOMBIA = '[{"name":{"common":"Colombia","official":"Republic of Colombia"},"tld":[".co"],"independent":true,"capital":["Bogotá"],"subregion":"South America","languages":{"spa":"Spanish"},"borders":["BRA","ECU","PAN","PER","VEN"],"area":1141748,"flag":"🇨🇴","population":50882884,"gini":{"2019":51.3},"fifa":"COL","timezones":["UTC-05:00"],"continents":["America"],"flags":{"png":"https://flagcdn.com/w320/co.png","svg":"https://flagcdn.com/co.svg","alt":"The flag of Colombia is composed of three horizontal bands of yellow, blue and red, with the yellow band twice the height of the other two bands."}}]';

/* eslint-disable */
import {dataJson, filter, sort, search } from '../src/data.js';

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
  
  it(`should return ${JSON.parse(DATA_TEMP).slice(0,2)} for 'Continents' and 'America' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Continents', 'America')).toStrictEqual(JSON.parse(DATA_TEMP).slice(0,2));
  });

  it(`should return [] for 'Continents' and 'Europe' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Continents', 'Europe')).toStrictEqual([]);
  });

  it(`should return ${JSON.parse(DATA_TEMP)[2]} for 'Subregion' and 'South-Eastern Asia' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Subregion', 'South-Eastern Asia')).toStrictEqual([JSON.parse(DATA_TEMP)[2]]);
  });

  it(`should return ${[JSON.parse(COLOMBIA)[0], JSON.parse(COLOMBIA)[2]]} for 'Languages' and 'English' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Languages', 'English')).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2]]);
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

  it(`should return ${[JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0]]} for 'country' and 1 (ascending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'country', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1]]} for 'country' and -1 (descending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'country', -1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1]]);
  });

  //Falta por capitales

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1]]} for 'area' and 1 (ascending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'area', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0]]} for 'area' and -1(descending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'area', -1)).toStrictEqual([JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1]]} for 'population' and 1 (ascending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'population', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1]]);
  });

  it(`should return ${[JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0]]} for 'population' and -1 (descending)`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'population', -1)).toStrictEqual([JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0]]);
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

  it(`should return ${JSON.parse(COLOMBIA)} for 'colombia' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'colombia')).toStrictEqual(JSON.parse(COLOMBIA));
  });

  it(`should return ${JSON.parse(COLOMBIA)} for 'bogotá' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'bogotá')).toStrictEqual(JSON.parse(COLOMBIA));
  });

  it(`should return ${JSON.parse(COLOMBIA)} for 'republic of colombia' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'republic of colombia')).toStrictEqual(JSON.parse(COLOMBIA));
  });

  it(`should return [] for 'bogota' `, () => {
    expect(search(JSON.parse(DATA_TEMP), 'bogota')).toStrictEqual([]);
  });
});