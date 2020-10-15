require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const userWinning = require("../models/winnings");
console.log("env", process.env)
cloudinary.config({
    cloud_name: "daplidbcp",
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',


    apiKey: 'AIzaSyAdsanca_IXvSsr1d1Im_dFoWJkARmZLCw', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);



const controllers = {

    showRegistrationForm: (req, res) => {
        res.render('users/register', {
            pageTitle: "Register here",
        })

    },

    showLoginPage: (req, res) => {
        res.render('users/login', {
            pageTitle: "Login here"
        })
    },

    showUploadTable: (req, res) => {
        res.render('users/upload', {
            pageTitle: "Upload Winnings"
        })
    },


    uploadData: (req, res) => {
        console.log(req.files);

        const filename = req.files.image.path; //this path should be uploaded to cloudinary;
        console.log(req.body);// save it into the database
        let data = req.body;


        cloudinary.uploader.upload(
            filename, // directory and tags are optional
            function (err, result) {
                if (err) return res.send(err);
                console.log("file uploaded to Cloudinary");
                // remove file from server
                console.log(result.url)
                data.picture = result.url


                geocoder.geocode(data.location, function (err, latlong) {
                    const lat = latlong[0].latitude;
                    const long = latlong[0].longitude;
                    data.location = [lat, long];
                    const userwinning = new userWinning(data);
                    userwinning.save(function (err, _data) {
                        if (err) { console.log(err) }

                        else {
                            res.json("Data Saved");
                        }

                    })

                })





                //fs.unlinkSync(filename); /// deleting file name from local



            });



    }


}

module.exports = controllers