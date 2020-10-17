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


function editdata(...data) {

    $("#exampleModal").modal('show');
    const imagele = document.getElementById("editImage")
    imagele.setAttribute("src", data[1]);
    imagele.style.display = "block";
    document.getElementById("image").value = "";
    document.getElementById("hiddenid").value = data[0];
    document.getElementById("numberBought").value = data[2];
    document.getElementById("prizeWon").value = data[3];
    document.getElementById("amountPaid").value = data[4];
    document.getElementById("totalAmount").value = data[3] * data[4];
    document.getElementById("location").value = data[6];
    document.getElementById("uploadForm").setAttribute("action", "/users/editUpload");
    console.log(data);

    /// we have to change the the form url as welll

}
//
function changeImage(event) {

    console.log(event.target.files[0]);
    const imagele = document.getElementById("editImage")
    //URL.createObjectURL creates url from fileobject
    imagele.setAttribute("src", URL.createObjectURL(event.target.files[0]));
    imagele.style.display = "block";
}
