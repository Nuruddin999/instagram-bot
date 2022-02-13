const express = require("express");
const router = express.Router();
const { getForDirectUsers, newForDirectUser, findOrCreateForDirectUser, findUser, deleteUser } = require("../controllers/forDirectController");
router.route("/").post(newForDirectUser);
router.route("/").get(getForDirectUsers);
router.route("/find_or").post(findOrCreateForDirectUser)
router.route("/find").post(findUser);
router.route("/delete").post(deleteUser)
module.exports = router;