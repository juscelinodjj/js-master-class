'use strict';

import DatabaseError from './database-error.mjs';
import Parse from './parse.mjs';

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

  createTable(input) {
    const {tableName, create: {columnsWithType}} = new Parse(input);
    this.tables[tableName] = { columns: {}, data: [] };
    for (const columns of columnsWithType) {
      const [name, value] = columns;
      this.tables[tableName].columns[name] = value;
    }
  }

  insert(input) {
    const {tableName, insert: {row}} = new Parse(input);
    this.tables[tableName].data.push(row);
  }

  select(input) {
    const {tableName, select: {columns, id}} = new Parse(input);
    const data = this.tables[tableName].data;
    const rows = id ? data.filter(object => object.id === id) : data;
    const parsedRows = rows.map(object => {
      return columns.reduce((accumulator, column) => {
        return { ...accumulator, [column]: object[column] };
      }, {});
    });
    console.log(JSON.stringify(parsedRows, null, 2));
  }

  delete(input) {
    const {tableName, delete: {id, all}} = new Parse(input);
    if (all) {
      this.tables[tableName].data = [];
      return;
    }
    const data = this.tables[tableName].data;
    const filtedData = data.filter(object => object.id !== id);
    this.tables[tableName].data = filtedData;
  }

  execute(input) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.isValidInput(input)) {
          const message = `Syntax error: "${input}"`;
          const error = new DatabaseError(input, message);
          return reject(error);
        }
        const method = this.chooseMethod(input);
        resolve(this[method](input));
      }, 1000);
    });
  }
}