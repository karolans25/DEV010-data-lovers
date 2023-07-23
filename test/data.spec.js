//import { example, anotherExample } from '../src/data.js';
import { dataJson, filter, sort, search } from '../src/data.js';

/*
test('dataJson funciona correctamente', async () => {
  const expectedResult = {"propiedad1": "valor1", "propiedad2": "valor2"}; // JSON de ejemplo
  const mockFetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(expectedResult) })
  );

  // Llamamos a dataJson, asegurándonos de que usa el fetch imaginario.
  const result = await dataJson('http://ejemplo.com/dataset', { fetch: mockFetch });
  expect(result).toEqual(expectedResult);

  // Aseguramos que fetch haya sido llamada con los argumentos correctos.
  expect(mockFetch.mock.calls.length).toEqual(1);
  expect(mockFetch.mock.calls[0][0]).toEqual('http://ejemplo.com/dataset');
});
*/

test('playing with mocks', () => {
  const mock = jest.fn()

  console.log(mock) //

  // es una función
  mock()

  // toHaveBeenCalled y toHaveBeenCalledTimes son matchers
  // que vienen por default en Jest y sirven sólo
  // para los mocks
  expect(mock).toHaveBeenCalled() // true
  expect(mock).toHaveBeenCalledTimes(2) // false
});

describe('dataJson', () => {
  it('is a function', () => {
    expect(typeof dataJson).toBe('function');
  });
});

describe('filter', () => {
  it('is a function', () => {
    expect(typeof filter).toBe('function');
  });
});

describe('sort', () => {
  it('is a function', () => {
    expect(typeof sort).toBe('function');
  });
});

describe('search', () => {
  it('is a function', () => {
    expect(typeof search).toBe('function');
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