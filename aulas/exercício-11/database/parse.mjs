'use strict';

export default class Parse {
  #input;
  constructor(input) {
    this.#input = input;
    this.tableName = this.#tableName;
    this.create = this.#create;
    this.insert = this.#insert;
    this.select = this.#select;
    this.delete = this.#delete;
  }
  get #regex() {
    const tableName = /(table|into|from)\s(\w+)\s*/;
    const create = /create.+\((.+?)\)/;
    const insert = /insert.+\((.*?)\).+\((.*?)\)/;
    const select = /select\s(.+)\sfrom(?:.+id\s=\s(\d+))?/;
    const _delete = /delete\sfrom\s\w+(?:\swhere\sid\s=\s(\d+))?/;
    return {
      tableName,
      create,
      insert,
      select,
      delete: _delete
    }
  }
  get #tableName () {
    const regex = new RegExp(this.#regex.tableName);
    const tableName = this.#input.match(regex)[2];
    return tableName;
  }
  get #create() {
    const regex = new RegExp(this.#regex.create);
    const match = regex.test(this.#input) ? this.#input.match(regex)[1] : null;
    const columnsWithType = match
      ? match.split(', ').map(column => column.split(' ')) : null;
    return {columnsWithType};
  }
  get #insert() {
    const regex = new RegExp(this.#regex.insert);
    const match = regex.test(this.#input) ? this.#input.match(regex) : null;
    const columns = match ? match[1].split(', ') : null;
    const values = match ? match[2].split(', ') : null;
    const row = columns ? columns.reduce((accumulator, element, index) => {
      return { ...accumulator, [element]: values[index] };
    }, {}) : null;
    return {row};
  }
  get #select() {
    const regex = new RegExp(this.#regex.select);
    const match = regex.test(this.#input) ? this.#input.match(regex) : null;
    const columns = match ? match[1].split(', ') : null;
    const id = match && match[2] ? match[2] : null;
    return {
      columns,
      id
    }
  }
  get #delete() {
    const regex = new RegExp(this.#regex.delete);
    const match = regex.test(this.#input) ? this.#input.match(regex) : null;
    const id = match && match[1] ? match[1] : null;
    const all = match && !match[1] ? true : false;
    return {
      id,
      all
    }
  }
}