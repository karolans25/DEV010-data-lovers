//const DATA = 
const DATA_TEMP = '[{"name":{"common":"Turks and Caicos Islands","official":"Turks and Caicos Islands"},"tld":[".tc"],"independent":false,"capital":["Cockburn Town"],"subregion":"Caribbean","languages":{"eng":"English"},"area":948,"flag":"🇹🇨","population":38718,"fifa":"TCA","timezones":["UTC-04:00"],"continents":["America"],"flags":{"png":"https://flagcdn.com/w320/tc.png","svg":"https://flagcdn.com/tc.svg"}},{"name":{"common":"Colombia","official":"Republic of Colombia"},"tld":[".co"],"independent":true,"capital":["Bogotá"],"subregion":"South America","languages":{"spa":"Spanish"},"borders":["BRA","ECU","PAN","PER","VEN"],"area":1141748,"flag":"🇨🇴","population":50882884,"gini":{"2019":51.3},"fifa":"COL","timezones":["UTC-05:00"],"continents":["America"],"flags":{"png":"https://flagcdn.com/w320/co.png","svg":"https://flagcdn.com/co.svg","alt":"The flag of Colombia is composed of three horizontal bands of yellow, blue and red, with the yellow band twice the height of the other two bands."}},{"name":{"common":"Malaysia","official":"Malaysia"},"tld":[".my"],"independent":true,"capital":["Kuala Lumpur"],"subregion":"South-Eastern Asia","languages":{"eng":"English","msa":"Malay"},"borders":["BRN","IDN","THA"],"area":330803,"flag":"🇲🇾","population":32365998,"gini":{"2015":41.1},"fifa":"MAS","timezones":["UTC+08:00"],"continents":["Asia"],"flags":{"png":"https://flagcdn.com/w320/my.png","svg":"https://flagcdn.com/my.svg","alt":"The flag of Malaysia is composed of fourteen equal horizontal bands of red alternating with white. A blue rectangle, bearing a fly-side facing yellow crescent and a fourteen-pointed yellow star placed just outside the crescent opening, is superimposed in the canton."}}]';

const COLOMBIA = '[{"name":{"common":"Colombia","official":"Republic of Colombia"},"tld":[".co"],"independent":true,"capital":["Bogotá"],"subregion":"South America","languages":{"spa":"Spanish"},"borders":["BRA","ECU","PAN","PER","VEN"],"area":1141748,"flag":"🇨🇴","population":50882884,"gini":{"2019":51.3},"fifa":"COL","timezones":["UTC-05:00"],"continents":["America"],"flags":{"png":"https://flagcdn.com/w320/co.png","svg":"https://flagcdn.com/co.svg","alt":"The flag of Colombia is composed of three horizontal bands of yellow, blue and red, with the yellow band twice the height of the other two bands."}}]';


//import { example, anotherExample } from '../src/data.js';
import { dataJson, filter, sort, search } from '../src/data.js';

import fetchMock from 'fetch-mock';
//import { storeResponse } from './path/to/module';

describe('dataJson', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it('returns the parsed JSON from the response when the status is 200', async () => {
    const expectedJson = JSON.parse(DATA_TEMP);
    const url = './countries_test.json';
    fetchMock.get(url, { status: 200, body: expectedJson });

    const result = await dataJson(url);

    expect(result).toEqual(expectedJson);
  });

  it('throws an error when the status is not 200', async () => {
    const url = './countries_test.json';
    fetchMock.get(url, { status: 404 });

    await expect(dataJson(url)).rejects.toThrow(
      'Hubo un problema accediendo al dataset.'
    );
  });
});

//import { storeResponse } from './path/to/storeResponse';
/*
describe('storeResponse', () => {
  it('returns the parsed JSON when response status is 200', async () => {
    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue(JSON.parse(DATA))
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    const result = await storeResponse('https://example.com/data.json');
    
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.json');
    expect(result).toEqual({ data: 'some data' });
  });

  it('throws an error when response status is not 200', async () => {
    const mockResponse = {
      status: 404,
      json: jest.fn().mockResolvedValue({ message: 'not found' })
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    await expect(storeResponse('https://example.com/data.json')).rejects.toThrow('Hubo un problema accediendo al dataset.');
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/data.json');
  });
});
*/


describe('dataJson', () => {
  it('is a function', () => {
    expect(typeof dataJson).toBe('function');
  });
});

describe('filter', () => {
  it('is a function', () => {
    expect(typeof filter).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => filter('')).toThrow(TypeError);
    expect(() => filter()).toThrow(TypeError);
    expect(() => filter(0)).toThrow(TypeError);
    expect(() => filter([],'')).toThrow(TypeError);
    expect(() => filter(null, [])).toThrow(TypeError);
    expect(() => filter(0, 0)).toThrow(TypeError);
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

  it(`should return ${[JSON.parse(COLOMBIA)[0], JSON.parse(COLOMBIA)[2]]} for 'Languages' and 'eng' `, () => {
    expect(filter(JSON.parse(DATA_TEMP), 'Languages', 'eng')).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2]]);
  });
});

describe('sort', () => {
  it('is a function', () => {
    expect(typeof sort).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => sort()).toThrow(TypeError);
    expect(() => sort(0)).toThrow(TypeError);
    expect(() => sort(null, [])).toThrow(TypeError);
    expect(() => sort(0, 0)).toThrow(TypeError);
  });

  it(`should return ${JSON.parse(DATA_TEMP)} for 'country' and 1\ndonde 1 represents ascending sort`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'country', 1)).toStrictEqual([JSON.parse(DATA_TEMP)[1], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[0]]);
  });

  it(`should return ${JSON.parse(DATA_TEMP)} for 'country' and '-1'\ndonde -1 represents descending sort`, () => {
    expect(sort(JSON.parse(DATA_TEMP), 'country', '-1')).toStrictEqual([JSON.parse(DATA_TEMP)[0], JSON.parse(DATA_TEMP)[2], JSON.parse(DATA_TEMP)[1]]);
  });
  //Falta por capitales, area y población
});

describe('search', () => {
  it('is a function', () => {
    expect(typeof search).toBe('function');
  });

  it('should throw TypeError when invoked with wrong argument types', () => {
    expect(() => search()).toThrow(TypeError);
    expect(() => search(0)).toThrow(TypeError);
    expect(() => search(null, [])).toThrow(TypeError);
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

/*
describe('example', () => {
  it('is a function', () => {
    expect(typeof example).toBe('function');
  });
  it('returns `example`', () => {
    expect(example()).toBe('example');
  });
});


describe('anotherExample', () => {
  it('is a function', () => {
    expect(typeof anotherExample).toBe('function');
  });

  it('returns `anotherExample`', () => {
    expect(anotherExample()).toBe('OMG');
  });
});
*/