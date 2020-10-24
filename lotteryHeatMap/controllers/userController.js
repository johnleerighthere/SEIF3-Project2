require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uuid = require('uuid')
const SHA256 = require("crypto-js/sha256")
const UserModel = require('../models/users');
const winningsModel = require('../models/winnings');

console.log("env", process.env)
//told userControllerJS that I want to store here
cloudinary.config({
    cloud_name: "daplidbcp",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const NodeGeocoder = require('node-geocoder');
const userModel = require('../models/users');


const options = {
    provider: 'google',


    apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);



const controllers = {

    showSignUpForm: (req, res) => {

        if (req.session && req.session.user) {
            res.redirect('/')
            return
        }

        res.render('users/signup', {
            pageTitle: "Sign up",
        })

    },

    showLoginPage: (req, res) => {

        if (req.session && req.session.user) {
            res.redirect('/')
            return
        }

        res.render('users/login', {
            pageTitle: "Login"
        })
    },

    login: (req, res) => {
        userModel.findOne({
            email: req.body.email
        })
            .then(result => {
                console.log(result);
                // check if result is empty, if it is, no user, so login fail, redirect to login page
                if (!result) {
                    console.log('err: no result')
                    res.redirect('/user/login')
                    return
                }

                // combine DB user salt with given password, and apply hash algo
                const hash = SHA256(result.pwsalt + req.body.password).toString()

                // check if password is correct by comparing hashes
                if (hash !== result.hash) {
                    console.log('err: hash does not match')
                    res.redirect('/user/login')
                    return
                }

                // login successful

                //set session user
                req.session.user = result

                res.redirect('/users/upload')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/user/login')
            })
    },
    logOut: (req, res) => {
        req.session.user = null;
        res.redirect('/')


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
        winningsModel.find({ username: req.session.user.email }, (err, data) => {
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

        //with the help of config, uploads my image into cloudinary cloud
        cloudinary.uploader.upload(
            filename, // directory and tags are optional
            function (err, result) {
                if (err) return res.send(err);
                console.log("file uploaded to Cloudinary");
                //uploading picture to winningsModel
                data.picture = result.url
                data.locationText = data.location

                ///
                // console.log(req.session);
                data.username = req.session.user.email;
                // console.log("Datata Username", data.username);


                // geocoder.geocode(data.location, function (err, latlong) {
                //     if (err) { console.log(err); res.redirect("/users/upload"); }

                //     const lat = latlong[0].latitude;
                //     const long = latlong[0].longitude;
                //     data.location = [lat, long];



                // })
                //creating a new ticket with lat and long and locationObj
                //locationObj contains the whole obj regarding the place, to access Obj.url etc
                const winningsmodel = new winningsModel({
                    ...data,
                    lat: Number(data["lat"]),
                    long: Number(data["long"]),
                    locationObj: JSON.parse(data.addObj)
                });
                winningsmodel.save(function (err, _data) {
                    if (err) { console.log(err); res.redirect("/users/upload"); }

                    else {
                        res.redirect("/users/upload");
                    }

                })





                // fs.unlinkSync(filename); /// deleting file name from local



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

                        winningsModel.updateOne({ _id: data.id }, {
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





                    fs.unlinkSync(filename); /// deleting file name from local



                });
        }
        else {


            winningsModel.updateOne({ _id: data.id }, {
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
    },

    searchNumber: async (req, res) => {

        // winningsModel.find({ numberBought: req.body.number }, (err, data) => {

        //     if (err) {
        //         console.log(err); res.json({ message: "Something Went Wrong" });
        //     }

        //     else {
        //         //// 
        //         let obj = {};
        //         data.forEach(ele => {
        //             //taking text location of data and storing all of  them in an object
        //             if (obj[ele.locationText]) {
        //                 obj[ele.locationText]++
        //             }

        //             else {
        //                 obj[ele.locationText] = 1
        //             }

        //         })
        //         // console.log(obj);
        //         //
        //         const maxkey = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
        //         const maxvalue = obj[maxkey]

        //         res.json({ maxkey: maxkey, maxvalue: maxvalue });
        //     }


        // })
        console.log("hhuu", req.body)
        let obj = {}
        Object.keys(req.body).map(x => {
            obj[x] = Number(req.body[x])
        })


        const total = winningsModel.aggregate([
            {
                "$match": obj
            },
            {
                "$group": {
                    "_id": "$locationText",
                    "latitude": { $first: "$lat" },
                    "longitude": { $first: "$long" },

                    "count": { "$sum": 1 },
                    "total": {
                        "$sum": "$totalAmount"

                    }
                }
            },
            {
                "$sort": {
                    "total": -1
                }
            }
        ])// sorting by total amount

        const count = winningsModel.aggregate([
            {
                "$match": obj
            },
            {
                "$group": {
                    "_id": "$locationText",
                    "count": { "$sum": 1 },
                    "total": {
                        "$sum": "$totalAmount"
                    }
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ])
        const alldata = await Promise.all([total, count]);
        console.log(alldata[0]); // alldata[0] is being sorted by total in descending order 
        // alldata[1] is being sorted by count in descending order

        if (alldata[0] && alldata[0].length > 0) {
            res.json({
                maxTotalkey: alldata[0][0]["_id"], maxTotalvalue: alldata[0][0]["total"], dataFound: true,
                maxCountkey: alldata[1][0]["_id"], maxCountvalue: alldata[1][0]["count"],
                mapdata: alldata[0]


            });
        } else {
            res.json({ maxkey: "", maxvalue: "", dataFound: false });
        }

        /**
         * 
         * 
         * (err, data) => {
            if (err) {
                console.log(err); res.json({ message: "Something Went Wrong" });
            }
            console.log(data)
            if (data && data.length > 0) {
                res.json({ maxkey: data[0]["_id"], maxvalue: data[0]["count"], dataFound: true });
            } else {
                res.json({ maxkey: "", maxvalue: "", dataFound: false });
            }

        }
         */


    }


}

module.exports = controllers