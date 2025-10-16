const { convertTimestampToDate, formatDataForSQL } = require('../db/seeds/utils');

describe('convertTimestampToDate', () => {
  test('returns a new object', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test('converts a created_at property to a date', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test('does not mutate the input', () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test('ignores includes any other key-value-pairs in returned object', () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test('returns unchanged object if no created_at property', () => {
    const input = { key: 'value' };
    const result = convertTimestampToDate(input);
    const expected = { key: 'value' };
    expect(result).toEqual(expected);
  });
});

describe('formatDataForSQL', () => {
  test('returns an array when called with no arguments', () => {
    const result = formatDataForSQL();
    expect(Array.isArray(result)).toBe(true);
  });
  test('returns a new array', () => {
    const format = [];
    const data = [];
    const result = formatDataForSQL(format, data);
    expect(result).not.toBe(format);
    expect(result).not.toBe(data);
  });
  test('does not mutate either array when passed one as the second argument', () => {
    const format = [];
    const data = [];
    const formatCopy = structuredClone(format);
    const dataCopy = structuredClone(data);
    formatDataForSQL(format, data);
    expect(format).toEqual(formatCopy);
    expect(data).toEqual(dataCopy);
  });
  test('returns an array of ordered arrays in the defined format when provided a format array and an unordered array of objects with corresponding keys', () => {
    const format = ['one', 'two', 'three'];
    const data1 = [{ three: 3, two: 2, one: 1 }];
    const data2 = [
      { three: 3, two: 2, one: 1 },
      { three: 'apple', one: 'orange', two: 'pineapple' }
    ];
    const expected1 = [[1, 2, 3]];
    const expected2 = [
      [1, 2, 3],
      ['orange', 'pineapple', 'apple']
    ];
    const result1 = formatDataForSQL(format, data1);
    const result2 = formatDataForSQL(format, data2);
    expect(result1).toEqual(expected1);
    expect(result2).toEqual(expected2);
  });
});
