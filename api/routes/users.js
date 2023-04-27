const router = require("express").Router();
const User = require("../models/model.user");
const bcrypt = require("bcrypt");

//Update user
router.put("/:id", async (request, response) => {
    if (request.body.userId === request.params.id || request.body.isAdmin) {
        if (request.body.password) {
            try {
            const salt = await bcrypt.genSalt(10);
            request.body.password = await bcrypt.hash(request.body.password, salt);
            } catch (error) {
                return response.status(500).json(error);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(request.params.id, {
                $set: request.body
            });
            response.status(200).json("Account has been updated!");
        } catch (error) {
            return response.status(500).json(error);
        }

    } else {
        return response.status(403).json("You can update only your account")
    }
});

//Delete user
router.delete("/:id", async (request, response) => {
    if (request.body.userId === request.params.id || request.body.isAdmin) {
        try{
            const user = await User.findByIdAndDelete(request.params.id);
            response.status(200).json("Account has been deleted!");
        } catch (error) {
            return response.status(500).json(error);
        }

    } else {
        return response.status(403).json("You can delete only your account")
    }
});

//Get a user
router.get("/", async (request, response) => {
    const userId = request.query.userId;
    const username = request.query.username;
    try{
        const user = userId 
        ? await User.findById(userId) 
        : await User.findOne({username : username});
        // here we don't show password and updatedAd, we show other info (avatar, username etc)
        const {password, updatedAt, ...other} = user._doc;
        response.status(200).json(other);
    } catch (error) {
        response.status(500).json(error);
    }
})

// 1st get a user?
// router.get("/:id", async (request, response) => { /* THE CODE FROM PART 1 */
//     try{
//         const user = await User.findById(request.params.id);
//         // here we don't show password and updatedAd, we show other info (avatar, username etc)
//         const {password, updatedAt, ...other} = user._doc;
//         response.status(200).json(other);
//     } catch (error) {
//         response.status(500).json(error);
//     }
// })

// Get friends
router.get("/friends/:userId", async (request, response) => {
    try {
        const user = await User.findById(request.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map(friend => {
            const {_id, username, avatar} = friend;
            friendList.push({_id, username, avatar});
        })
        response.status(200).json(friendList);
    } catch (error) {
        response.status(500).json
    }
})

//Follow a user
router.put("/:id/follow",  async (request, response) => {
    if (request.body.userId !== request.params.id) {
        try {
            const user = await User.findById(request.params.id);
            const currentUser = await User.findById(request.body.userId);
            if (!user.followers.includes(request.body.userId)) {
                await user.updateOne({$push: {followers: request.body.userId}});
                await currentUser.updateOne({$push: {followings: request.params.id}});
                response.status(200).json("User has been followed");
            } else {
                response.status(200).json("You already follow this user");
            }

        } catch (error) {
            response.status(500).json(error);
        }
    } else {
        response.status(403).json("You can't follow yourself");
    }
});

//Unfollow a user
router.put("/:id/unfollow",  async (request, response) => {
    if (request.body.userId !== request.params.id) {
        try {
            const user = await User.findById(request.params.id);
            const currentUser = await User.findById(request.body.userId);
            if (user.followers.includes(request.body.userId)) {
                await user.updateOne({$pull: {followers: request.body.userId}});
                await currentUser.updateOne({$pull: {followings: request.params.id}});
                response.status(200).json("User has been unfollowed");
            } else {
                response.status(403).json("You don't this user");
            }

        } catch (error) {
            response.status(500).json(error);
        }
    } else {
        response.status(403).json("You can't unfollow yourself");
    }
});




module.exports = router;