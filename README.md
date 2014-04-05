loopback-connector-kafka
========
Kafka connector for loopback-datasource-juggler.

# Install

```sh
npm install loopback-connector-kafka --save
```

# Usage

```js
    var DataSource = require('loopback-datasource-juggler').DataSource;
    // The options for kafka-node
    var options = {
        connectionString: 'localhost:2181/kafka0.8'
    };
    var dataSource = new DataSource('kafka', options);
```

Or configure it in `datasources.json`

```js
{
    "kafka": {
        "connector": "kafka",
        "connectionString": "127.0.0.1:2181/kafka0.8"
    }
}
```

# LICENSE
MIT
