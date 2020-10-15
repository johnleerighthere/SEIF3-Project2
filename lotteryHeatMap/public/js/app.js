console.log("lotteryHeatMap app ready")

let map, heatmap;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.782, lng: -122.447 },
        zoom: 8,
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getData(),
        map: map
    });

}


function getData() {
    return [
        { location: new google.maps.LatLng(37.782, -122.447), weight: 0.5 },
        new google.maps.LatLng(37.782, -122.445),
        { location: new google.maps.LatLng(37.782, -122.443), weight: 2 },
        { location: new google.maps.LatLng(37.782, -122.441), weight: 3 },
        { location: new google.maps.LatLng(37.782, -122.439), weight: 2 },
        new google.maps.LatLng(37.782, -122.437),
        { location: new google.maps.LatLng(37.782, -122.435), weight: 0.5 },

        { location: new google.maps.LatLng(37.785, -122.447), weight: 3 },
        { location: new google.maps.LatLng(37.785, -122.445), weight: 2 },
        new google.maps.LatLng(37.785, -122.443),
        { location: new google.maps.LatLng(37.785, -122.441), weight: 0.5 },
        new google.maps.LatLng(37.785, -122.439),
        { location: new google.maps.LatLng(37.785, -122.437), weight: 2 },
        { location: new google.maps.LatLng(37.785, -122.435), weight: 3 }
    ];

}


document.getElementById("amountPaid").addEventListener("keyup", function () {


    const prizeWon = $("#prizeWon").val();


    document.getElementById("totalAmount").value = Number(prizeWon) * Number(this.value);

})


function initialize() {
    var input = document.getElementById('location');
    new google.maps.places.Autocomplete(input);
}

google.maps.event.addDomListener(window, 'load', initialize);
