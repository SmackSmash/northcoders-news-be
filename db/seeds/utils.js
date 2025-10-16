// const db = require('../../db/connection');

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

const formatDataForSQL = (format, data) => {
  return data.map(item => {
    return format.map(key => {
      return key === 'created_at' ? convertTimestampToDate({ created_at: item[key] }).created_at : item[key];
    });
  });
};

module.exports = { convertTimestampToDate, formatDataForSQL };
