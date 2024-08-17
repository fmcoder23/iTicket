const fileUpload = require('express-fileupload');
const cors = require('cors')
const express = require('express')

const routes = require('../routes');
const { errorHandler } = require('../middlewares/error-handler.middleware');

const modules = (app, express) => {
    app.use(cors())
    
    app.use(express.json());
    //app.use((req,res,next)=>{console.log('body ',req.body);next()})
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: "*"
    }))
    app.use(express.static(`${process.cwd()}/uploads`))
    app.use(fileUpload());

    app.use('/api', routes);

    app.use(errorHandler);
}

module.exports = modules;