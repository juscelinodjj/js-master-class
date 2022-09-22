'use strict';

export default class DatabaseError {
  constructor(input, message) {
    this.input = input;
    this.message = message;
    Object.freeze(this);
  }
}