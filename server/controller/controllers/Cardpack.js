const response = require('../../response');

module.exports = {
    getCardpacks: (req, res) => {
        req.db.sync(function (err) {
            if (err) {
                response(res, req.body, {}, 500, "Error while synchronizing database.", [])
                return
            }

            req.models.cardpack.all((err, cardpacks) => {
                if (err) {
                    response(res, req.body, {}, 500, "Error while fetching cardpacks.", [])
                    return
                }

                response(res, req.body, cardpacks, 200, "Fetched all cardpacks", [])
            })
        })
    }
}