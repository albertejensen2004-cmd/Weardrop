const express = require("express");

const app = express();

const PORT = 3000;


// Allow the server to receive JSON
app.use(express.json());


// Test route
app.get("/", function(req, res) {

    res.send("Closet AI backend is working! 👗✨");

});


// Start the server
app.listen(PORT, function() {

    console.log(
        `Closet AI backend running on port ${PORT}`
    );

});