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
console.log(tableName);
console.log(columns);