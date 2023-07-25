/* eslint-disable */
import {dataJson} from '../src/data.js';

describe('All test of get data',(done)=>{
global.fetch = jest.fn(); //Así se crea un mock de una función
test('should return parsed JSON data if response status is 200', async () => {
    const mockResponse = { data: [1, 2, 3] };
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
})