const { config } = require("../../config")

const runner = (app) => {
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`)
    })
}

module.exports = runner;