// THIS FILE WILL CONTAIN CONFIGURATION WHICH IS RELATED TO EXPRESS
const path = require("path");
const Email = require("./utils/email");
const axios = require("axios");
const express = require("express");
const cookieParser = require("cookie-parser");
const isSiteDown = require("is-site-down");
const pug = require("pug");
const request = require("request");

// const bodyParser = require("body-parser");

const sendMail = async (liveStatus, website) => {
  await new Email(liveStatus, "anuj992393@gmail.com", website).sendWebStatus();
};

const app = express();

app.set("view engine", "pug");
// __dirname -> current directory
app.set("views", path.join(__dirname, "views"));

// FOR GOING TO THE EXACT PATH, IN THE PUG, WE ARE MOVING CURRENT DIR TO PUBLIC
app.use(express.static(path.join(__dirname, "/public")));

// express.json() is a middleware, it parses the json in the incoming req object
app.use(express.json());

// IT ENABLES US TO USE DATA RECEIVED IN REQ.BODY
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// TO ACCESS COOKIE AT BACKEND
app.use(cookieParser());

const handleRequest = async (req, res, next) => {
  const link = "https://nodejss.org/";

  request(link, async (error, response, body) => {
    if (error) {
      let changeStatus = "true";

      if (req.cookies.live == "false" || req.cookies.live == undefined) {
        changeStatus = "false";
      }
      if (changeStatus == "true") {
        console.log("turned off");
        res.cookie("live", "false", {
          expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
        await sendMail("Down", link);
      }

      res.status(200).render("base", {
        title: "Site Checker",
      });
    } else if (response.statusCode == 200) {
      let changeStatus = "true";

      if (req.cookies.live == "true" || req.cookies.live == undefined)
        changeStatus = "false";

      if (changeStatus == "true") {
        console.log("turned on");
        res.cookie("live", "true", {
          expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });

        await sendMail("Live", link);
      }
      res.status(200).render("base", {
        title: "Site Checker",
      });
    } else {
      let changeStatus = "true";

      if (req.cookies.live == "false" || req.cookies.live == undefined) {
        changeStatus = "false";
      }

      if (changeStatus == "true") {
        console.log("turned off");
        res.cookie("live", "false", {
          expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });

        // await sendMail("Down", link);
      }
      res.status(200).render("base", {
        title: "Site Checker",
      });
    }
  });

  //   });
};

// MOUNTING ROUTERS
app.get("/", handleRequest);

// Catching Errors -> a very basic error handler
app.use((err, req, res, next) => {
  console.log("Inside Error Handler function....");
  console.log(err);
});

// END OF ERROR HANDLER FUNC

module.exports = app;
