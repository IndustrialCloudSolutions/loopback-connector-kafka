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
        dataSource.connector = new Kafka(producer);
        cb && cb();
    });
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

Kafka.prototype.create = function (topic, data, cb) {
    var producer = this.producer;
    producer.send([{
        topic: topic,
        messages: JSON.stringify(data)
    }], cb);
}
