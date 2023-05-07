const router = require("express").Router();
const User = require("../models/model.user");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (request, response) => {

    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(request.body.password, salt);

        // create new user
        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            password: hashPassword
        });

        // save user and return respond
        const user = await newUser.save();
        response.status(200).json(user);
    } catch (error) {
        response.status(500).json(error);
    }

});

//Login
router.post("/login", async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (!user) {
            response.status(404).json("User isn't exist");
        } else {
            const validPassword = await bcrypt.compare(request.body.password, user.password);
            if (!validPassword) {
                response.status(404).json("Wrong password");
            } else {
                response.status(200).json(user);
            }
        }
    } catch (error) {
        response.status(500).json(error);
    }
});

// Login ver 1
// router.post("/login", async (request, response) => {
//     try {
//         const user = await User.findOne({ email: request.body.email });
//         !user && response.status(404).json("User isn't exist");

//         const validPassword = await bcrypt.compare(request.body.password, user.password);
//         !validPassword && response.status(404).json("Wrong password");

//         response.status(200).json(user);
//     } catch (error) {
//         response.status(500).json(error);
//     }
// })

// Logout
router.get("/logout", (request, response) => {
    response.cookie("userToken", null, {
        httpOnly: true,
        expires: new Date(0),
    });
    response.redirect("/login");
});

module.exports = router;