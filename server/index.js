const express = require("express");
const BotClient = require("./Bot");
var cors = require('cors')
const user = require("./routes/user");
const last_accaunts = require("./routes/last_accaunt")
const speaker = require("./routes/speaker")
const app = express();
const ig = new BotClient() //класс сторонней библиотеки
const log = async () => {
    await ig.login()
}
log()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users", user);
app.use("/last_accounts", last_accaunts)
app.use("/speakers", speaker)
app.get("/", function (request, response) {
    ig.ig.account.currentUser().then(r => response.send(r.username))

});
app.get("/about", function (request, response) {
    ig.ig.user.getIdByUsername("edelgiri").then(r => {
        ig.ig.user.info(r).then(r => response.send(r))
    })
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.get("/contact", function (request, response) {
    ig.ig.account.logout().then(r => response.send(r))
});
app.get("/postId/:accaunt", function (request, response) {
    ig.getAllPostsByHandle(request.params["accaunt"]).then(r => response.send(r))
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.get("/getspeaker/:id", function (request, response) {
    ig.getCommentator(request.params["id"]).then(r => response.send(r))
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.get("/getidbyname/:name", function (request, response) {
    ig.getIdByUsername(request.params["name"]).then(r => response.send(r))
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.post("/write_temp_comm/", function (request, response) {
    ig.writeToFileTempCommentators(request.body.path, request.body.list)
    response.send("is written successfylly")
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.get("/userinfo/:id", function (request, response) {
    ig.getUserInfo(request.params["id"]).then(r => response.send(r))
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.get("/readspeakers/:path", function (request, response) {
    ig.readSpeakerFromFile(request.params["path"]).then(r => response.send(r))
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.get("/follow/:id", function (request, response) {
    ig.followUser(request.params["id"]).then(r => response.send(r))
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
app.get("/write/:id", function (request, response) {
    ig.writeToUser(request.params["id"]).then(r => response.send(r)).catch(error => response.status(500).send({
        message: 'This is an error!'
    }))
    // ig.getCommentators("nozhi_kizlyar_imran").then(r => response.send(r))
    //  ig.ig.account.currentUser().then(r => response.send(r.full_name))
});
const server = app.listen(0, function () {
    console.log('Listening on port ' + server.address().port)
})