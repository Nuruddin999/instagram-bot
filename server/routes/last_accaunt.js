const express = require("express");
const router = express.Router();
const { getLastAccaunts,newLastAccaunt } = require("../controllers/LastAccaunt");


router.route("/").post( newLastAccaunt);
router.route("/:accaunt").get(getLastAccaunts);

module.exports = router;