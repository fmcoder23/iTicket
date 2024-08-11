const cors = require('cors');
const fileUpload = require('express-fileupload');

const routes = require('../routes');
const { errorHandler } = require('../middlewares/error-handler.middleware');

const modules = (app, express) => {
    app.use(express.json());
    app.use(cors({
        origin: "*",
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(`${process.cwd()}/uploads`))
    app.use(fileUpload());

    app.use('/api', routes);

    app.use(errorHandler);
}

module.exports = modules;