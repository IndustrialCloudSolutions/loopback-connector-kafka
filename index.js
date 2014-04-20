var loopback = require('loopback');
var KafkaConnector = require('./lib/kafka');

function createMessageModel (options) { 
    options = options || {};
    var dataSource = loopback.createDataSource({
        connector: KafkaConnector,
        connectionString: options.connectionString,
        clientId: options.clientId,
        zkOptions: options.zkOptions
    });
    var model = dataSource.createModel(options.name || 'Message', {}, {plural: options.plural || 'messages'});
    return model;
}
exports = module.exports = KafkaConnector;
exports.Message = createMessageModel();
