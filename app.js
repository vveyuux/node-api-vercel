const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  url = "https://us21.api.mailchimp.com/3.0/lists/d36f8684cc";

  options = {
    method: "POST",
    auth: "vveyuux:6ffca3b6ba615fe8099b7aa88f47e895-us21",
  };

  const request = https.request(url, options, (response) => {
    const statusCode = response.statusCode;
    console.log("Status Code: " + statusCode);

    response.on("data", (data) => {
      data = JSON.parse(data);
      errorCode = data.errors[0].error_code;
      console.log(data);
      if (errorCode === "ERROR_CONTACT_EXISTS") {
        console.log(errorCode);
        res.sendFile(__dirname + "/failure.html");
      } else if (statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;

// API Key MailChimp
//6ffca3b6ba615fe8099b7aa88f47e895-us21

//List ID
//d36f8684cc
