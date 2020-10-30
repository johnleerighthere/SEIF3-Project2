const winningsModel = require('../models/winnings');

const controllers = {

    showMap: (req, res) => {
        winningsModel.aggregate(
            [
                {
                    "$group": {
                        _id: "$locationText",
                        total: {
                            "$sum": "$totalAmount"
                        },
                        "locationObj": { "$first": "$locationObj" },
                        "lat": { "$first": "$lat" },
                        "long": { "$first": "$long" },
                    }
                },
                {
                    "$sort": {
                        "total": -1
                    }
                }
            ]
        )
            .then(resp => {
                res.render('heatmap/index', {
                    pageTitle: "Lottery Heatmap",
                    data: JSON.stringify(resp)
                })
            })

    }

}

module.exports = controllers