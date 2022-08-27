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
  return input.startsWith('create table');
}

Database.prototype.parseInput = function (input) {
  const patternTableName = /table\s(.+)\s\(/;
  const patternColumnsContent = /\((.+)\)/;
  const tableName = patternTableName.test(input)
    ? input.match(patternTableName)[1] : null;
  const columnsContent = patternColumnsContent.test(input)
    ? input.match(patternColumnsContent)[1] : null;
  const columns = columnsContent ? columnsContent.split(', ') : null;
  return {tableName, columns};
}

Database.prototype.createTable = function (input) {
  const {tableName, columns} = this.parseInput(input);
  this.tables[tableName] = {columns: {}, data: []};
  for (const column of columns) {
    const key = column.split(' ')[0];
    const value = column.split(' ')[1];
    this.tables[tableName].columns[key] = value;
  }
}

Database.prototype.execute = function (input) {
  if (!this.isValidInput(input)) {
    const message = `Syntax error: "${input}"`;
    throw new DatabaseError(input, message);
  }
  this.createTable(input);
}

function main (input) {
  const database = new Database;
  database.execute(input);
  console.log(JSON.stringify(database, null, 2));
}

function init () {
  const validInput = 'create table author (id number, name string, age number'
    + ', city string, state string, country string)';
  const invalidInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing ...';
  try {
    main(validInput);
    main(invalidInput);
  } catch (error) {
    console.log(error.message);
  }
}

init();