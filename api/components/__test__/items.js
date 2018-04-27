'use strict';

const Api = require('../items');

const Module = (action, params) => {
  const fetch = () => {
    Api.fetch(params, {
      done: (err, result) => {
        console.log(result);
      }
    });
  };

  const get = () => {
    Api.get(params, {
      done: (err, result) => {
        console.log(result);
      }
    });
  };

  const create = () => {
    Api.create(params, {
      done: (err, result) => {
        console.log(result);
      }
    });
  };

  const update = () => {
    Api.update(params, {
      done: (err, result) => {
        console.log(result);
      }
    });
  };

  if (action == 'fetch') {
    fetch();
  } else if(action == 'get') {
    get();
  } else if(action == 'create') {
    create();
  } else if(action == 'update') {
    update();
  }
};

if (process.argv.length >= 3){
  let params = {};
  if (process.argv[3]){
    params = JSON.parse(process.argv[3]);
  }
  Module(process.argv[2], params);
} else{
  throw new Error('parameters error');
}
