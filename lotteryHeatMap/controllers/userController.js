require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uuid = require('uuid')
const SHA256 = require("crypto-js/sha256")
const UserModel = require('../models/users')

const userWinning = require("../models/winnings");
console.log("env", process.env)
cloudinary.config({
    cloud_name: "daplidbcp",
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const NodeGeocoder = require('node-geocoder');
const userModel = require('../models/users');
const winningsModel = require('../models/winnings');

const options = {
    provider: 'google',


    apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);



const controllers = {

    showSignUpForm: (req, res) => {
        res.render('users/signup', {
            pageTitle: "Sign up",
        })

    },

    showLoginPage: (req, res) => {
        res.render('users/login', {
            pageTitle: "Login"
        })
    },

    login: (req, res) => {
        userModel.findOne()
    },

    signUp: (req, res) => {
        console.log(req.body);
        userModel.findOne({ email: req.body.email })
            .then(result => {
                if (result) {
                    console.log("res", result);
                    res.redirect('/user/signup')

                }

                const salt = uuid.v4()

                const combination = salt + req.body.password

                const hash = SHA256(combination).toString()

                userModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.redirect('/users/upload')
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/user/signup')
                    })

            })
    },

    showUploadTable: (req, res) => {

        /// getting the data
        userWinning.find({/*condition*/ }, (err, data) => {
            if (err) res.send("Error")
            res.render('users/upload', {
                pageTitle: "Upload Winnings",
                data: data
            })
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
                data.locationText = data.location


                geocoder.geocode(data.location, function (err, latlong) {
                    if (err) { console.log(err); res.redirect("/users/upload"); }

                    const lat = latlong[0].latitude;
                    const long = latlong[0].longitude;
                    data.location = [lat, long];

                    const userwinning = new userWinning(data);
                    userwinning.save(function (err, _data) {
                        if (err) { console.log(err); res.redirect("/users/upload"); }

                        else {
                            res.redirect("/users/upload");
                        }

                    })

                })





                fs.unlinkSync(filename); /// deleting file name from local



            });



    },

    createUploads: (req, res) => {
        winningsModel.create({
            picture: req.body.image,
            numberBought: req.body.numberBought,
            prizeWon: req.body.prizeWon,
            amountPaid: req.body.amountPaid,
            location: req.body.location,
            totalAmount: req.body.totalAmount

                .then(result => {
                    res.redirect('/users/uploads')
                })

                .catch(err => {
                    console.log(err)
                    res.redirect('/')
                })

        })
    },

    editUploads: (req, res) => {
        const data = req.body;
        const size = req.files.image.size;
        const filename = req.files.image.path;

        if (size > 0) {
            /// You have to put the cloudinary code here as well

            cloudinary.uploader.upload(
                filename, // directory and tags are optional
                function (err, result) {
                    if (err) return res.send(err);
                    console.log("file uploaded to Cloudinary");
                    // remove file from server
                    console.log(result.url)
                    data.picture = result.url
                    data.locationText = data.location


                    geocoder.geocode(data.locationText, function (err, latlong) {
                        if (err) { console.log(err); res.redirect("/users/upload"); }

                        const lat = latlong[0].latitude;
                        const long = latlong[0].longitude;
                        data.location = [lat, long];

                        console.log("final Data when file is uploaded", data);

                        userWinning.updateOne({ _id: data.id }, {
                            $set: {

                                numberBought: data.numberBought,
                                prizeWon: data.prizeWon,
                                amountPaid: data.amountPaid,
                                locationText: data.locationText,
                                totalAmount: data.totalAmount,
                                location: data.location,
                                picture: data.picture



                            }
                        }, (err, data) => {
                            if (err) {
                                console.log(err);

                                res.redirect('/users/upload')
                            }
                            else {
                                res.redirect('/users/upload')
                            }

                        })
                    })





                    //fs.unlinkSync(filename); /// deleting file name from local



                });
        }
        else {


            userWinning.updateOne({ _id: data.id }, {
                $set: {

                    numberBought: data.numberBought,
                    prizeWon: data.prizeWon,
                    amountPaid: data.amountPaid,
                    locationText: data.location,
                    totalAmount: data.totalAmount,



                }
            }, (err, data) => {
                if (err) {
                    console.log(err);

                    res.redirect('/users/upload')
                }
                else {
                    res.redirect('/users/upload')
                }

            })


        }



    },



    deleteUploads: (req, res) => {
        console.log(req.body.id)
        winningsModel.deleteOne({
            _id: req.body.id
        })
            .then(deleteResult => {
                res.redirect('/users/upload')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/')
            })
    }


}

module.exports = controllers