'use strict';

import DatabaseError from './database-error.mjs';
import Parse from './parse.mjs';

export default class Database {
  constructor() {
    this.tables = {};
    Object.freeze(this);
  }
  #test(input) {
    const regex = /^(create\stable|insert\sinto|select|delete\sfrom)\s/;
    return regex.test(input);
  }
  #command(input) {
    const regex = /^([a-z]+)\s/;
    const command = regex.test(input) ? input.match(regex)[1] : null;
    return command;
  }
  #create(input) {
    const {tableName, create: {columnsWithType}} = new Parse(input);
    this.tables[tableName] = { columns: {}, data: [] };
    for (const columns of columnsWithType) {
      const [name, value] = columns;
      this.tables[tableName].columns[name] = value;
    }
    return true;
  }
  #insert(input) {
    const {tableName, insert: {row}} = new Parse(input);
    this.tables[tableName].data.push(row);
    return true;
  }
  #select(input) {
    const {tableName, select: {columns, id}} = new Parse(input);
    const data = this.tables[tableName].data;
    const rows = id ? data.filter(object => object.id === id) : data;
    const parsedRows = rows.map(object => {
      return columns.reduce((accumulator, column) => {
        return { ...accumulator, [column]: object[column] };
      }, {});
    });
    return parsedRows;
  }
  #delete(input) {
    const {tableName, delete: {id, all}} = new Parse(input);
    if (all) {
      this.tables[tableName].data = [];
      return true;
    }
    const data = this.tables[tableName].data;
    const filtedData = data.filter(object => object.id !== id);
    this.tables[tableName].data = filtedData;
    return true;
  }
  #execute(input) {
    const commands = {
      create: this.#create,
      insert: this.#insert,
      select: this.#select,
      delete: this.#delete,
    };
    const command = this.#command(input);
    return commands[command].call(this, input);
  }
  execute(input) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.#test(input)) {
          const error = new DatabaseError(input, `Syntax error: "${input}"`);
          return reject(error);
        }
        resolve(this.#execute(input));
      }, 1000);
    });
  }
}