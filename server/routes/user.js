const express = require("express");
const router = express.Router();
const { getUsers,newUser,findOrCreateUser } = require("../controllers/User");


router.route("/").post( newUser);
router.route("/:accaunt").get(getUsers);
router.route("/find_or").post(findOrCreateUser)

module.exports = router;