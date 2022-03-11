const { upAll, exec } = require("docker-compose");
const { join } = require("path");
const { kafkaClient } = require("../src/services/MQService");

module.exports = async () => {
    const { createKafkaTestHelper } = await import("kafka-test-helper");
    await upAll({
        cwd: join(__dirname),
        log: true,
    });

    await exec("database", ["sh", "-c", "until pg_isready ; do sleep 1; done"], {
        cwd: join(__dirname),
    });

    await createKafkaTestHelper(kafkaClient);
};
