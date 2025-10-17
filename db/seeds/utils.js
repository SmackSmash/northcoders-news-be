const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const formatDataForSQL = (format = [], data = []) => {
  return data.map(item => {
    return format.map(key => convertTimestampToDate(item)[key]);
  });
};

const createLookupObj = (arr, key, value) => {
  return arr.reduce((acc, pair) => {
    acc[pair[key]] = pair[value];
    return acc;
  }, {});
};

module.exports = { convertTimestampToDate, formatDataForSQL, createLookupObj };
