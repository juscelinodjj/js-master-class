'use strict';

function DatabaseError (input, message) {
  this.input = input;
  this.message = message;
  Object.freeze(this);
}

function Database () {
  const accessList = {
    'create table': 'createTable',
    'insert into': 'insert',
    'select ': 'select'
  };
  Object.defineProperty(this, 'accessList', {value: accessList});
  Object.defineProperty(this, 'validInputs', {value: this.getValidInputs()});
  this.tables = {};
  Object.freeze(this);
}

Database.prototype.getValidInputs = function () {
  return Object.keys(this.accessList);
};

Database.prototype.isValidInput = function (input) {
  return this.validInputs.some(validInput => input.startsWith(validInput));
}

Database.prototype.chooseMethod = function (input) {
  const key = this.validInputs.find(validInput => input.startsWith(validInput));
  return this.accessList[key] || null;
}

Database.prototype.parse = function () {
  function table (input) {
    const patternTableName = /table\s(.+)\s\(/;
    const patternColumnsContent = /\((.+)\)/;
    const tableName = input.match(patternTableName)[1];
    const columnsContent = input.match(patternColumnsContent)[1];
    const columns = columnsContent.split(', ');
    return {tableName, columns};
  }
  function insert (input) {
    const patternTableName = /^insert\sinto\s(.*?)\s\(/;
    const patternGroup = /\((.*?)\)/g;
    const tableName = input.match(patternTableName)[1];
    const group = [...input.matchAll(patternGroup)].map(match => match[1]);
    const columns = group[0].split(', ');
    const values = group[1].split(', ');
    const row = columns.reduce((accumulator, element, index) => {
      return {...accumulator, [element]: values[index]};
    }, {});
    return {tableName, row};
  }
  function select (input) {
    const patternColumns = /^select\s(.+)\sfrom/;
    const patternTableName = /from\s(\w+)/;
    const patternId = /where\sid\s=\s(\d)/;
    const rawColumns = input.match(patternColumns)[1];
    const columns = rawColumns.split(', ');
    const tableName = input.match(patternTableName)[1];
    const id = patternId.test(input) ? input.match(patternId)[1] : null;
    return {columns, tableName, id};
  }
  return {table, insert, select};
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

Database.prototype.select = function (input) {
  const {columns, tableName, id} = this.parse().select(input);
  const data = this.tables[tableName].data;
  const rows = id ? data.filter(object => object.id === id) : data;
  const parsedRows = rows.map(object => {
    return columns.reduce((accumulator, column) => {
      return {...accumulator, [column]: object[column]};
    }, {});
  });
  console.log(JSON.stringify(parsedRows, null, 2));
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
  const inputE = 'select name, age from author';
  const inputF = 'select name, age from author where id = 1';
  try {
    database.execute(inputA);
    database.execute(inputB);
    database.execute(inputC);
    database.execute(inputD);
    database.execute(inputE);
    database.execute(inputF);
  } catch (error) {
    console.log(error.message);
  }
  console.log(JSON.stringify(database, null, 2));
}

main();