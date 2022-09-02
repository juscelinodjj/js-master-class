'use strict';

function DatabaseError (input, message) {
  this.input = input;
  this.message = message;
  Object.freeze(this);
}

function Database () {
  this.tables = {};
  Object.freeze(this);
}

Database.prototype.isValidInput = function (input) {
  const validInputs = ['create table', 'insert into'];
  return validInputs.some(validInput => input.startsWith(validInput));
}

Database.prototype.chooseMethod = function (input) {
  const validInputs = ['create table', 'insert into'];
  const methods = {
    'create table': 'createTable',
    'insert into': 'insert'
  };
  const key = validInputs.find(validInput => input.startsWith(validInput));
  return methods[key] || null;
}

Database.prototype.parse = function () {
  function table (input) {
    const patternTableName = /table\s(.+)\s\(/;
    const patternColumnsContent = /\((.+)\)/;
    const tableName = patternTableName.test(input)
      ? input.match(patternTableName)[1] : null;
    const columnsContent = patternColumnsContent.test(input)
      ? input.match(patternColumnsContent)[1] : null;
    const columns = columnsContent ? columnsContent.split(', ') : null;
    return {tableName, columns};
  }
  function insert (input) {
    const patternTableName = /^insert\sinto\s(.*?)\s\(/;
    const patternGroup = /\((.*?)\)/g;
    const tableName = patternTableName.test(input)
      ? input.match(patternTableName)[1] : null;
    const group = [...input.matchAll(patternGroup)].map(match => match[1]);
    const keys = group[0].split(', ');
    const values = group[1].split(', ');
    const row = keys.reduce((accumulator, element, index) => {
      return {...accumulator, [element]: values[index]};
    }, {});
    return {tableName, row};
  }
  return {table, insert};
}

Database.prototype.createTable = function (input) {
  const {tableName, columns} = this.parse().table(input);
  this.tables[tableName] = {columns: {}, data: []};
  for (const column of columns) {
    const key = column.split(' ')[0];
    const value = column.split(' ')[1];
    this.tables[tableName].columns[key] = value;
  }
}

Database.prototype.insert = function (input) {
  const {tableName, row} = this.parse().insert(input);
  this.tables[tableName].data.push(row);
}

Database.prototype.execute = function (input) {
  if (!this.isValidInput(input)) {
    const message = `Syntax error: "${input}"`;
    throw new DatabaseError(input, message);
  }
  const method = this.chooseMethod(input);
  this[method](input);
}

function main () {
  const database = new Database;
  const inputA = 'create table author (id number, name string, age number'
    + ', city string, state string, country string)';
  const inputB = 'insert into author (id, name, age) values (1, Douglas'
    + ' Crockford, 62)';
  const inputC = 'insert into author (id, name, age) values (2, Linus Torvalds'
    + ', 47)';
  const inputD = 'insert into author (id, name, age) values (3, Martin Fowler'
    + ', 54)';
  try {
    database.execute(inputA);
    database.execute(inputB);
    database.execute(inputC);
    database.execute(inputD);
  } catch (error) {
    console.log(error.message);
  }
  console.log(JSON.stringify(database, null, 2));
}

main();