var express = require("express");
var router = express.Router();
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
const { create } = require("../models/Comments");

router.post("/create", (req, res, next) => {
    if (!req.session.username) {
        errorPrint("You must be logged in to comment!");
        res.json({
            code: -1,
            status: "danger",
            message: "You must be logged in to comment!"
        });
    } else {
        let {comment, postId} = req.body;
        let username = req.session.username;
        let userId = req.session.userId;
        let avatar = (userId % 5) + 1;
    
        create(userId, postId, comment)
        .then((wasSuccessful) => {
            if (wasSuccessful != -1) {
                successPrint("Comment successfully created!");
                res.json({
                    code: 1,
                    status: "success",
                    message: "Comment successfully created!",
                    comment: comment,
                    username: username,
                    avatar: avatar
                });
            } else {
                errorPrint("Comment was not saved.");
                res.json({
                    code: -1,
                    status: "danger",
                    message: "Comment was not saved."
                });
            }
        })
        .catch((err) => next(err));
    }
});

module.exports = router;