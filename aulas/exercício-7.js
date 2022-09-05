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
    'select ': 'select',
    'delete from ': 'delete'
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

Database.prototype.parse = function (input) {
  const patternTableName = /(table|into|from)\s(\w+)\s*/;
  const patternCreate = /create.+\((.+?)\)/;
  const patternInsert = /insert.+\((.*?)\).+\((.*?)\)/;
  const patternSelect = /select\s(.+)\sfrom(?:.+id\s=\s(\d+))?/;
  const patternDelete = /delete\sfrom\s\w+(?:\swhere\sid\s=\s(\d+))?/;
  // ALL -----------------------------------------------------------------------
  const tableName = input.match(patternTableName)[2];
  // CREATE --------------------------------------------------------------------
  const matchCreate = patternCreate.test(input)
    ? input.match(patternCreate)[1] : null;
  const columnsWithType = matchCreate
    ? matchCreate.split(', ').map(column => column.split(' ')) : null;
  // INSERT --------------------------------------------------------------------
  const matchInsert = patternInsert.test(input)
    ? input.match(patternInsert) : null;
  const columnsInsert = matchInsert ? matchInsert[1].split(', ') : null;
  const valuesInsert = matchInsert ? matchInsert[2].split(', ') : null;
  const rowInsert = columnsInsert
    ? columnsInsert.reduce((accumulator, element, index) => {
        return {...accumulator, [element]: valuesInsert[index]};
      }, {})
    : null;
  // SELECT --------------------------------------------------------------------
  const matchSelect = patternSelect.test(input)
    ? input.match(patternSelect) : null;
  const columnsSelect = matchSelect ? matchSelect[1].split(', ') : null;
  const idSelect = matchSelect && matchSelect[2] ? matchSelect[2] : null;
  // DELETE --------------------------------------------------------------------
  const matchDelete = patternDelete.test(input)
    ? input.match(patternDelete) : null;
  const idDelete = matchDelete && matchDelete[1] ? matchDelete[1] : null;
  const deleteAll = matchDelete && !matchDelete[1] ? true : false;
  //----------------------------------------------------------------------------
  return {
    tableName,
    columnsWithType,
    rowInsert,
    columnsSelect,
    idSelect,
    idDelete,
    deleteAll
  };
}

Database.prototype.createTable = function (input) {
  const {tableName, columnsWithType} = this.parse(input);
  this.tables[tableName] = {columns: {}, data: []};
  for (const columns of columnsWithType) {
    const [name, value] = columns;
    this.tables[tableName].columns[name] = value;
  }
}

Database.prototype.insert = function (input) {
  const {tableName, rowInsert} = this.parse(input);
  this.tables[tableName].data.push(rowInsert);
}

Database.prototype.select = function (input) {
  const {tableName, columnsSelect, idSelect} = this.parse(input);
  const data = this.tables[tableName].data;
  const rows = idSelect ? data.filter(object => object.id === idSelect) : data;
  const parsedRows = rows.map(object => {
    return columnsSelect.reduce((accumulator, column) => {
      return {...accumulator, [column]: object[column]};
    }, {});
  });
  console.log(JSON.stringify(parsedRows, null, 2));
}

Database.prototype.delete = function (input) {
  const {tableName, idDelete, deleteAll} = this.parse(input);
  if (deleteAll) {
    this.tables[tableName].data = [];
    return;
  }
  const data = this.tables[tableName].data;
  const filtedData = data.filter(object => object.id !== idDelete);
  this.tables[tableName].data = filtedData;
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
  const inputE = 'delete from author where id = 2';
  const inputF = 'select name, age from author';
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