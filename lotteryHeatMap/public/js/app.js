

console.log("lotteryHeatMap app ready")

let map, heatmap;

function initMap(data) {
    console.log("init map")
    var Singapore = { lat: 1.3521, lng: 103.8198 }
    map = new google.maps.Map(document.getElementById("map"), {
        center: Singapore,
        zoom: 11,
    });
    let defautMapData = JSON.parse(document.getElementById("defaultData").innerHTML)
    console.log(defautMapData)
    let mapData = []
    //if data is coming from the filter button

    if (defautMapData && Array.isArray(defautMapData) && defautMapData.length > 0) {
        mapData = defautMapData.map(ele => {
            return {
                location: new google.maps.LatLng(ele.lat, ele.long),
                weight: ele.total

            }
        })
    }
    if (data && Array.isArray(data) && data.length > 0) {
        mapData = data
    } else {
        document.getElementById("paidLocation").innerHTML = `<div><a target="_blank" href='${defautMapData[0].locationObj["link"]}'>${defautMapData[0]._id}</a> for $${defautMapData[0].total}</div>`;
    }
    console.log(mapData)
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: mapData,
        map: map
    });
    heatmap.set("radius", 25);
    var input = document.getElementById('location');
    console.log(input)
    if (input) {
        new google.maps.places.Autocomplete(input);
    }

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
                document.getElementById("xLocation").innerHTML = `<div><a target="__blank" href='${data.maxCountLink}'>${data.maxCountkey}</a> for ${data.maxCountvalue} times</div>`;
                document.getElementById("paidLocation").innerHTML = `<div><a target="__blank" href='${data.maxTotalLink}'>${data.maxTotalkey}</a> for $${data.maxTotalvalue}</div>`;
                console.log(data);


                /// Setting up the heat map here 


                const mapdata = data.mapdata.map(ele => {
                    return {
                        location: new google.maps.LatLng(ele.latitude, ele.longitude),
                        weight: ele.total

                    }
                })
                console.log("hey", mapdata);
                initMap(mapdata)
            }
        })
    }

}
