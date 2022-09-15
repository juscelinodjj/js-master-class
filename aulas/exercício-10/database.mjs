'use strict';

import DatabaseError from './database-error.mjs';

export default class Database {
  #accessList;
  #validInputs;

  constructor() {
    const accessList = {
      'create table': 'createTable',
      'insert into': 'insert',
      'select ': 'select',
      'delete from ': 'delete'
    };
    this.#accessList = accessList;
    this.#validInputs = this.getValidInputs();
    this.tables = {};
    Object.freeze(this);
  }

  getValidInputs() {
    return Object.keys(this.#accessList);
  }

  isValidInput(input) {
    return this.#validInputs.some(validInput => input.startsWith(validInput));
  }

  chooseMethod(input) {
    const key = this.#validInputs.find(validInput => {
      return input.startsWith(validInput);
    });
    return this.#accessList[key] || null;
  }

  parse(input) {
    const patternTableName = /(table|into|from)\s(\w+)\s*/;
    const patternCreate = /create.+\((.+?)\)/;
    const patternInsert = /insert.+\((.*?)\).+\((.*?)\)/;
    const patternSelect = /select\s(.+)\sfrom(?:.+id\s=\s(\d+))?/;
    const patternDelete = /delete\sfrom\s\w+(?:\swhere\sid\s=\s(\d+))?/;
    // ALL ---------------------------------------------------------------------
    const tableName = input.match(patternTableName)[2];
    // CREATE ------------------------------------------------------------------
    const matchCreate = patternCreate.test(input)
      ? input.match(patternCreate)[1] : null;
    const columnsWithType = matchCreate
      ? matchCreate.split(', ').map(column => column.split(' ')) : null;
    // INSERT ------------------------------------------------------------------
    const matchInsert = patternInsert.test(input)
      ? input.match(patternInsert) : null;
    const columnsInsert = matchInsert ? matchInsert[1].split(', ') : null;
    const valuesInsert = matchInsert ? matchInsert[2].split(', ') : null;
    const rowInsert = columnsInsert
      ? columnsInsert.reduce((accumulator, element, index) => {
        return { ...accumulator, [element]: valuesInsert[index] };
      }, {})
      : null;
    // SELECT ------------------------------------------------------------------
    const matchSelect = patternSelect.test(input)
      ? input.match(patternSelect) : null;
    const columnsSelect = matchSelect ? matchSelect[1].split(', ') : null;
    const idSelect = matchSelect && matchSelect[2] ? matchSelect[2] : null;
    // DELETE ------------------------------------------------------------------
    const matchDelete = patternDelete.test(input)
      ? input.match(patternDelete) : null;
    const idDelete = matchDelete && matchDelete[1] ? matchDelete[1] : null;
    const deleteAll = matchDelete && !matchDelete[1] ? true : false;
    //--------------------------------------------------------------------------
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

  createTable(input) {
    const { tableName, columnsWithType } = this.parse(input);
    this.tables[tableName] = { columns: {}, data: [] };
    for (const columns of columnsWithType) {
      const [name, value] = columns;
      this.tables[tableName].columns[name] = value;
    }
  }

  insert(input) {
    const { tableName, rowInsert } = this.parse(input);
    this.tables[tableName].data.push(rowInsert);
  }

  select(input) {
    const { tableName, columnsSelect, idSelect } = this.parse(input);
    const data = this.tables[tableName].data;
    const rows = idSelect
      ? data.filter(object => object.id === idSelect) : data;
    const parsedRows = rows.map(object => {
      return columnsSelect.reduce((accumulator, column) => {
        return { ...accumulator, [column]: object[column] };
      }, {});
    });
    console.log(JSON.stringify(parsedRows, null, 2));
  }

  delete(input) {
    const { tableName, idDelete, deleteAll } = this.parse(input);
    if (deleteAll) {
      this.tables[tableName].data = [];
      return;
    }
    const data = this.tables[tableName].data;
    const filtedData = data.filter(object => object.id !== idDelete);
    this.tables[tableName].data = filtedData;
  }

  execute(input) {
    if (!this.isValidInput(input)) {
      const message = `Syntax error: "${input}"`;
      throw new DatabaseError(input, message);
    }
    const method = this.chooseMethod(input);
    this[method](input);
  }
}