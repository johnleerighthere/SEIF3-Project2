

console.log("lotteryHeatMap app ready")

let map, heatmap;

function initMap() {
    console.log("in initi amp")
    var Singapore = { lat: 1.3521, lng: 103.8198 }
    map = new google.maps.Map(document.getElementById("map"), {
        center: Singapore,
        zoom: 11,
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getData(),
        map: map
    });
    heatmap.set("radius", 20);
    var input = document.getElementById('location');
    console.log(input)
    if (input) {
        new google.maps.places.Autocomplete(input);
    }

}

// google.maps.event.addDomListener(window, 'load', initialize);


function getData() {
    return [
        { location: new google.maps.LatLng(1.3521, 103.8198), weight: 30, },
        new google.maps.LatLng(1.3521, -103.8198),
        { location: new google.maps.LatLng(1.3521, 103.8198), weight: 2 },
        { location: new google.maps.LatLng(1.3521, 103.8198), weight: 3 },
        { location: new google.maps.LatLng(1.3521, 103.8198), weight: 2 },
        new google.maps.LatLng(1.3524, 103.8198),
        { location: new google.maps.LatLng(1.3519, 103.8197), weight: 0.5 },

        { location: new google.maps.LatLng(1.3519, 103.8198), weight: 3 },
        { location: new google.maps.LatLng(1.3519, 103.8199), weight: 30 },
        new google.maps.LatLng(37.785, -122.443),
        { location: new google.maps.LatLng(37.785, -122.441), weight: 0.5 },
        new google.maps.LatLng(37.785, -122.439),
        { location: new google.maps.LatLng(37.785, -122.437), weight: 2 },
        { location: new google.maps.LatLng(37.785, -122.435), weight: 3 },
        new google.maps.LatLng(1.3644, 103.9915),
        { location: new google.maps.LatLng(1.3644, 103.9915), weight: 50 },
        { location: new google.maps.LatLng(1.3644, 103.9915), weight: 3 }
    ];

}


function queryNum() {
    console.log("querynum")
    let content = document.getElementById("queryNum").value
    let prizeCategory = document.getElementById("Prize").value
    console.log(prizeCategory)
    if (isNaN(content) || Number(content) > 9999 || Number(content) < 0 || content.length < 4) {
        alert("Please key in 4 digits between 0000 and 9999")
    }
    else {
        /// sending the request to backend
        let obj = { numberBought: Number(content) }
        if (prizeCategory) {
            obj["prizeWon"] = Number(prizeCategory)
        }
        $.ajax({
            url: "user/searchNumber",
            type: "POST",
            data: obj,
            success: function (data) {
                if (!data.dataFound) {
                    alert("Number doesn't exist in database");
                    return false;
                }
                document.getElementById("xLocation").innerHTML = `<span style="display:block;
                width:150px;word-wrap: break-word;">${data.maxCountkey} for ${data.maxCountvalue} times</span>`;
                document.getElementById("paidLocation").innerHTML = `<span style="display:block;
                width:150px;word-wrap: break-word;">${data.maxTotalkey} for $${data.maxTotalvalue}</span>`;
                console.log(data);
            }
        })
    }

}
