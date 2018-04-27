'use strict';

const uuidV1 = require('uuid/v1');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'ap-northeast-1',
});

const TableName = 'items';
const PrimaryKey = {
  name: 'id',
  type: 'S',
};

const Schema = {
  location: {
    type: 'S',
  },
  barcode: {
    type: 'S',
  },
  stocks: {
    type: 'N',
  },
  name: {
    type: 'S',
  },
  image: {
    type: 'S',
  },
};

//
// create query from params for dynamodb
//
const getQuery = (data, primaryId) => {
  const params = {
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    Key: {
      [PrimaryKey.name]: {
        [PrimaryKey.type]: primaryId,
      },
    },
    ReturnValues: 'ALL_NEW',
    TableName: TableName,
    UpdateExpression: '',
  };
  const query = [];
  Object.keys(Schema).forEach((field) => {
    if (data[field] !== null) {
      params.ExpressionAttributeNames[`#${field}`] = field;
      params.ExpressionAttributeValues[`:${field}`] = {
        [Schema[field].type]: String(data[field]),
      };
      query.push(`#${field} = :${field}`);
    }
  });
  params.UpdateExpression = `SET ${query.join(',')}`;
  return params;
};

//
// format dynamodb data to service
//
const parse = (data) => {
  const parsed = {
    [PrimaryKey.name]: data[PrimaryKey.name][PrimaryKey.type],
  };
  Object.keys(Schema).forEach((field) => {
    const type = Schema[field].type;
    switch (type) {
      case 'N':
        parsed[field] = (data[field]) ? Number(data[field][type]) : '';
        break;
      default:
        parsed[field] = (data[field]) ? data[field][type] : '';
    }
  });
  return parsed;
};

//
// Get item by id
//
module.exports.get = (data, context) => {
  const response = {
    data: null,
    error: null,
  };
  const params = {
    TableName: TableName,
    Key: {
      [PrimaryKey.name]: {
        [PrimaryKey.type]: data.path.id,
      },
    },
  };
  dynamodb.getItem(params, (err, data) => {
    if (err) {
      response.error = err.message;
    } else {
      response.data = parse(data.Item);
    }
    context.done(null, response);
  });
};

//
// Fetch items
//
module.exports.fetch = (data, context) => {
  const response = {
    data: [],
    error: null,
  };
  const params = {
    TableName: TableName,
  };
  dynamodb.scan(params, (err, data) => {
    if (err) {
      response.error = err.message;
    } else {
      response.data = data.Items.map(row => parse(row));
    }
    context.done(null, response);
  });
};

//
// Create item
//
module.exports.create = (data, context) => {
  const response = {
    data: null,
    error: null,
  };
  const id = uuidV1();
  const body = data.body;
  if (!body.image) {
    body.image = 'https://s3-ap-northeast-1.amazonaws.com/test.cordova.demo/default.png';
  }
  const params = getQuery(body, id);
  dynamodb.updateItem(params, (err, data) => {
    if (err) {
      response.error = err.message;
    } else {
      response.data = parse(data.Attributes || {});
    }
    context.done(null, response);
  });
};

//
// Update item
//
module.exports.update = (data, context) => {
  const response = {
    data: null,
    error: null,
  };
  const params = getQuery(data.body, data.path.id);
  dynamodb.updateItem(params, (err, data) => {
    if (err) {
      response.error = err.message;
    } else {
      response.data = parse(data.Attributes || {});
    }
    context.done(null, response);
  });
};
