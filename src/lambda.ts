'use strict';
const awsServerlessKoa = require('aws-serverless-koa');
const app = require('./app');
const server = awsServerlessKoa(app);

exports.handler = (event: any, context: any) => {
  server(event, context);
};
