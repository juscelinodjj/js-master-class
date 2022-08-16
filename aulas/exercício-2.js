'use strict';

const input = 'create table author (id number, name string, age number, city '
  + 'string, state string, country string)';
const patternTableName = /table\s(.+)\s\(/;
const patternColumnsContent = /\((.+)\)/;
const tableName = patternTableName.test(input)
  ? input.match(patternTableName)[1] : null;
const columnsContent = patternColumnsContent.test(input)
  ? input.match(patternColumnsContent)[1] : null;
const columns = columnsContent ? columnsContent.split(', ') : null;
const database = {tables: {[tableName]: {columns: {}, data: []}}};
for (const column of columns) {
  const key = column.split(' ')[0];
  const value = column.split(' ')[1];
  database.tables[tableName].columns[key] = value;
}
console.log(JSON.stringify(database, null, 2));