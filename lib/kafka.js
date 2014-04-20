'use strict';

var kafka = require('kafka-node');
var Client = kafka.Client;
var Producer = kafka.Producer;

exports.initialize = function (dataSource, cb) {
    var settings = dataSource.settings;
    var client = new Client(settings.connectionString, settings.clientId, settings.zkOptions);
    var producer = new Producer(client);
    producer.on('ready', function () {
        console.log('Producer ready');
    });
    var connector = new Kafka(producer);
    dataSource.connector = connector;
    connector.DataAccessObject = function() {};
    for (var m in Kafka.prototype) {
        var method = Kafka.prototype[m];
        if ('function' === typeof method) {
            connector.DataAccessObject[m] = method.bind(connector);
            for(var k in method) {
                connector.DataAccessObject[m][k] = method[k];
            }
        }
    }
    cb && cb();
}

/**
 *  @constructor
 *  Constructor for KAFKA connector
 *  @param {Object} The kafka-node producer
 */
function Kafka(producer) {
    this.name = 'kafka';
    this._models = {};
    this.producer = producer;
}

Kafka.prototype.send = function (topic, data, cb) {
    var producer = this.producer;
    var stringify = function (json) {
        try {
            return JSON.stringify(json);
        } catch (e) {
            return json;
        }
    }
    data = Array.isArray(data)
        ? data.map(function (item) { return stringify(item); })
        : stringify(data);
    producer.send([{
        topic: topic,
        messages: data
    }], cb);
}

function setRemoting(fn, options) {
    options = options || {};
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            fn[opt] = options[opt];
        }
    }
    fn.shared = true;
}

setRemoting(Kafka.prototype.send, {
  description: 'Send a message to Kafka server',
  accepts: [
    {arg: 'topic', type: 'String', required: true, description: 'Topic name', http: {source: 'query'} },
    {arg: 'message', type: 'object', description: 'Message body', http: {source: 'body'}}
  ],
  returns: {arg: 'data', type: 'object', root: true},
  http: {verb: 'post', path: '/'}
});
