'use strict';

const uuidV1 = require('uuid/v1');
const AWS = require('aws-sdk');
const yaml = require('js-yaml');
const fs = require('fs');
const Config = yaml.safeLoad(fs.readFileSync(`${__dirname}/../env.yml`, 'utf8'));

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
    TableName: Config.dynamodb.table,
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
  const dynamodb = new AWS.DynamoDB({
    region: Config.dynamodb.region,
    apiVersion: Config.dynamodb.api_version,
  });
  const params = {
    TableName: Config.dynamodb.table,
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
  const dynamodb = new AWS.DynamoDB({
    region: Config.dynamodb.region,
    apiVersion: Config.dynamodb.api_version,
  });
  const params = {
    TableName: Config.dynamodb.table,
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
  const dynamodb = new AWS.DynamoDB({
    region: Config.dynamodb.region,
    apiVersion: Config.dynamodb.api_version,
  });
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
  const dynamodb = new AWS.DynamoDB({
    region: Config.dynamodb.region,
    apiVersion: Config.dynamodb.api_version,
  });
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

//
// Upload image
//
module.exports.upload = (data, context) => {
  const response = {
    data: null,
    error: null,
  };

  const S3 = new AWS.S3({
    region: Config.s3.region,
    apiVersion: Config.s3.api_version,
  });

  const string = data.body.path || '';
  const matches = string.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const date = new Date();
  if (matches.length === 3) {
    const params = {
      Bucket: Config.s3.bucket,
      Key: `img/${date.getTime()}`,
      ContentType: matches[1],
      Body: new Buffer(matches[2], 'base64'),
      ACL: 'public-read',
      CacheControl: 'max-age=7776000',
    };
    S3.upload(params, (err, result) => {
      if (err) {
        response.error = err.message;
      } else {
        response.data = {
          path: result.Location,
        };
      }
      context.done(null, response);
    });
  } else {
    response.error = '画像をアップロードできませんでした';
    context.done(null, response);
  }
};
