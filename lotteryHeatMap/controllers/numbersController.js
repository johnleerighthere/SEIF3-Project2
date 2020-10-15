const controllers = {

    showMap: (req, res) => {
        res.render('heatmap/index', {
            pageTitle: "Lottery Heatmap",
        })
    }

}

module.exports = controllers