const express = require("express");
const router = express.Router();
const { getUsers,newUser,findSpeaker,deleteSpeaker } = require("../controllers/Speaker");


router.route("/").post( newUser);
router.route("/:accaunt").get(getUsers);
router.route("/find").post(findSpeaker);
router.route("/delete").post(deleteSpeaker)
module.exports = router;