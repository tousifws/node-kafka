const isCI = require("is-ci");
const { down } = require("docker-compose");

module.exports = async () => {
    // Check if running CI environment
    if (isCI) {
        console.log("****************");
        console.log(isCI);
        await down({ commandOptions: ["--remove-orphans"] });
    }
};
