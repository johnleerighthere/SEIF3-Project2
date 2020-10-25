console.log("upload js")
var autocomplete;
function initialize() {
    console.log("121212")
    var input = document.getElementById('location');
    //geocode interferes with getting all the places.
    autocomplete = new google.maps.places.Autocomplete(input, { types: ['geocode'] });
    console.log("autocomplete", autocomplete)
    autocomplete.addListener('place_changed', getUserLocation)
}

function getUserLocation() {
    var place = autocomplete.getPlace()
    console.log("place", place)
    var lat = place.geometry.location.lat(),
        lng = place.geometry.location.lng();

    // Then do whatever you want with them

    console.log(lat);
    console.log(lng);
    document.getElementById("lat").value = lat
    document.getElementById("long").value = lng
    //form data always works on string values, we have to send obj type to server, to convert
    //any obj or array, we can stringify into a string
    //basically an object or array is term as a json, json means javascript object notation
    // to define any object variable or type, we have to express it as a json
    document.getElementById("addObj").value = JSON.stringify({
        link: place.url,
        formatted_address: place.formatted_address
    })
}

if (document.getElementById("amountPaid")) {
    document.getElementById("amountPaid").addEventListener("keyup", function () {
        calculateTotalAmount()
    })
}
if (document.getElementById("prizeWon")) {
    document.getElementById("prizeWon").addEventListener("keyup", function () {
        calculateTotalAmount()
    })
}


function calculateTotalAmount() {
    document.getElementById("totalAmount").value = Number(document.getElementById("prizeWon").value) * Number(document.getElementById("amountPaid").value);
}

function editdata(...data) {
    console.log(data)

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

function validateForm() {
    var x = document.getElementById("prizeWon").value

    if (x === isNaN() || x != Number("3000") && x != Number("2000") && x != Number("1000")) {
        alert("Please key in either 3000, 2000 or 1000 for Prize Won");
        return false;
    }
}

function changeImage(event) {

    console.log(event.target.files[0]);
    const imagele = document.getElementById("editImage")
    //URL.createObjectURL creates url from fileobject
    imagele.setAttribute("src", URL.createObjectURL(event.target.files[0]));
    imagele.style.display = "block";
}

