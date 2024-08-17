
const router = require('express').Router()

router.get('/loadImg/:path',
    function (req, res, next) {
        try {
            const { path } = req.params
            console.log(path)
            res.sendFile(process.cwd() + '/uploads/' + path)
        }
        catch (error) {
            next(error)
        }
    }
)

module.exports = router