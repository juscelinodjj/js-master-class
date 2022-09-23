'use strict';

import Database from './database/main.mjs';

async function main() {
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
  const inputF = 'select name, age from author where id = 1';
  try {
    await database.execute(inputA);
    await Promise.all([
      database.execute(inputB),
      database.execute(inputC),
      database.execute(inputD),
      database.execute(inputE)
    ]);
    const selected = await database.execute(inputF);
    console.log(selected);
    console.log(JSON.stringify(database, null, 2));
  } catch (error) {
    console.log(error.message);
  }
}

main();