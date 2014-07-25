'use strict';

var assert = require('assert');
var kafka = require('kafka-node');
var client = new kafka.Client('localhost:2181');
var topic = 'loopback-connector-kafka' + Math.random();
var consumer = new kafka.HighLevelConsumer(client, [ { topic: topic } ], {});
var producer = new kafka.HighLevelProducer(client);
var connector = require('..');
var settings = {
    connectionString: 'localhost:2181'
}
var dataSource = { settings: settings };
connector.initialize(dataSource);

consumer.on('message', function (message) {
    assert.equal(message.value, 'Hallo');
    process.exit();
});

consumer.on('error', function (error) {
    console.log('Consumer error: ', error);
})

producer.createTopics([ topic ], function (err) {
    if (err) {
        console.log('Got error when create topic:', err);
        return;
    }

    setTimeout(function () {
        dataSource.connector.send(topic, 'Hallo', function (err) {
            if (err) console.log('Got error when send message:', err);
            else console.log('Message send');
        });
    }, 1000);
})

