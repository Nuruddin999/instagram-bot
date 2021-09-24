const express = require("express");
const router = express.Router();
const { getDirectUsers, newDirectUser, findOrCreateDirectUser } = require("../controllers/DirectUser");
router.route("/").post(newDirectUser);
router.route("/:accaunt").get(getDirectUsers);
router.route("/find_or").post(findOrCreateDirectUser)

module.exports = router;