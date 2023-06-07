// express
const express = require('express')
const app = express()

// frontend
app.use(express.static('build'))


//cors
const cors = require('cors')

app.use(cors())

// config
require('dotenv').config()
const node_password = process.env.NODE_PASSWORD
const gmail_username = process.env.GMAIL_USERNAME
const gmail_password = process.env.GMAIL_PASSWORD


// models
const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
mongoose
    .connect(url)
    .then(() => {
        console.log("Conected to Database");
    })
    .catch((err) => console.log(err))
const DataModel = require('./models/data')
const EmailModel = require('./models/email')




// express parsers
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()      // create application/json parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })   // create application/x-www-form-urlencoded parser


/// email
var nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    host: "smtp.outlook.com",
    auth: {
        user: gmail_username,
        pass: gmail_password
    }
})
var randomstring = require("randomstring");


// Data Params
Range = [
    {
        "L0": 600,
        "L1": 2000
    },
    {
        "L0": 100,
        "L1": 200
    },
    {
        "L0": 1000,
        "L1": 1000
    },
    {
        "L0": 1000,
        "L1": 1000
    },
    {
        "L0": 50,
        "L1": 150
    },
    {
        "L0": 50,
        "L1": 150
    }
]



app.get('/api/data/:num_inst', (req, res) => {
    const instances = req.params.num_inst
    if (instances === undefined) {
        res.status(400).json({ error: 'No of instances unspecified' })
    }
    DataModel.find({date: {$gt: new Date('2022-11-20T12:00:00Z')}}).sort({ _id: -1 }).limit(instances).then(result => {
        res.json(result.reverse());
    }).catch(err => {
        console.log(err);
        res.json(err);
    })
})

var alreadySent = false
app.post('/api/data', jsonParser, (req, res) => {
    if (req.body === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }
    const body = req.body
    if (body.length != 7) {
        return res.status(400).json({ error: 'missing parameters/extra data' })
    }
    if (body[0] != node_password) {
        return res.status(400).json({ error: 'Authentication Failed' })
    }
    console.log(body);

    const new_data_in = new DataModel({
        date: new Date(),
        CO2: body[1],
        VOC: body[2],
        Temperature: body[3],
        Humidity: body[4],
        PM2_5: body[5],
        PM10: body[6],
    })
    new_data_in.save().then(result => {
        console.log('Saved Note');
        res.status = 200
        res.json(result);
    }).catch(err => {
        console.log("Couldnt add to database")
        console.log(err)
    })

    var flag = false
    for (let i = 1; i < 7; i++) {
        if (body[i] >= Range[i - 1].L1) {
            flag = true
            break
        }
    }
    if (flag) {
        if (alreadySent === false) {
            alreadySent = true
            EmailModel.find({ Validated: true }).then((result) => {
                result.forEach(element => {
                    var mailOptions = {
                        from: gmail_username,
                        to: element.email,
                        subject: 'Alert',
                        text: `Unsafe Levels of Air Pollutants Have been detected at node location
                            CO2: ${body[1]}
                            VOC: ${body[2]}
                            Temperature: ${body[3]}
                            Humidity: ${body[4]}
                            PM 2.5: ${body[5]}
                            PM 10: ${body[6]}

                    Visit https://indoor-air-pollution-18.onrender.com/ to know more.
                            `,
                    }

                    transporter.sendMail(mailOptions).then(() => {
                        console.log("Sent alerting mail to", element.email);
                    }).catch((err) => {
                        console.log(err);
                        console.log("SOme error in sending email to", element.email);
                    })
                    
                });
            })
        }
    }else{
        alreadySent=false
    }
})

app.post('/api/email/', jsonParser, (req, res) => {
    body = req.body
    console.log(body)
    if (body === undefined) {
        res.status(400).json({ err: "missing body" })
    }

    EmailModel.find({ email: body.email }).then((result) => {
        if (result.length === 1) {
            if (result[0].Validated === true) {
                res.status(200).json({ "status": 1 })
            } else {
                new_email = result[0]

                var mailOptions = {
                    from: gmail_username,
                    to: body.email,
                    subject: 'Verification',
                    text: `Click This To Verify your email https://indoor-air-pollution-18.onrender.com/api/email/validate/${new_email.Alt_email}/${new_email.Password}`,
                }

                transporter.sendMail(mailOptions)
                res.status(200).json({ "status": 2 })
            }
        } else {
            const new_email = new EmailModel({
                date: new Date(),
                email: body.email,
                Validated: false,
                Password: randomstring.generate(11),
                Alt_email: randomstring.generate(11)
            })

            var mailOptions = {
                from: gmail_username,
                to: body.email,
                subject: 'Verification',
                text: `Click This To Verify your email https://indoor-air-pollution-18.onrender.com/api/email/validate/${new_email.Alt_email}/${new_email.Password}`,
            }

            flag = true;
            transporter.sendMail(mailOptions).then(() => {
                new_email.save().then(result => {
                    console.log('Saved Email , (unverified)');
                    res.status(200).json({ "status": 2 })
                }).catch(err => {
                    console.log("Couldnt add to database")
                    res.status(400).json("Succesfull");
                    console.log(err)
                })
            }).catch((err) => {
                res.status(400).json("Error");
            })
        }
    }).catch((err) => {
        console.log("find error", err)
    })
})

app.get('/api/email/validate/:altemail/:passwd', (req, res) => {
    const alt_email = req.params.altemail
    const passwd = req.params.passwd
    console.log(alt_email, passwd)
    EmailModel.updateMany({ Alt_email: alt_email, Password: passwd }, {
        $set: {
            Validated: true,
        },
    }).then((result) => {
        console.log(result);
        // var mailOptions = {
        //     from: gmail_username,
        //     to: body.email,
        //     subject: 'Verified',
        //     text: `Verification Succesfull`,
        // }

        // transporter.sendMail(mailOptions, (err, info) => {
        //     if (err) {
        //         console.log(err);
        //         res.status(400)
        //     } else {
        //         console.log("Succesfull email", info.response);
        //     }
        // })

        res.status(200).send("<body><h1>Email Verified.</h1><br><p>You will start recieving alerts</p>")
    }).catch((err) => {
        console.log(err);
        res.status(400).json({ err: "internal" })
    })
})

// middleware 
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

