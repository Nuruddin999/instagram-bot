

const igApiClient = require("instagram-private-api")
const Bluebird = require('bluebird');
const inquirer = require('inquirer');
const fs = require("fs")
const { IgCheckpointError } = require("instagram-private-api");
const { User, Speaker, DirectUser } = require("./db/sequelize");
module.exports = class BotClient {
    ig;
    constructor() {
        this.ig = new igApiClient.IgApiClient()
    }
    async login() {

        let cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"))
        let device = JSON.parse(fs.readFileSync("device.json", "utf8"))
        if (Object.keys(cookies).length > 0 && Object.keys(cookies).length > 0) {
            console.log('loading device and session from disk...')
            let savedCookie = fs.readFileSync("cookies.json", 'utf-8')
            let savedDevice = fs.readFileSync("device.json", 'utf-8')
            await this.ig.state.deserializeCookieJar(savedCookie)
            this.ig.state.deviceString = JSON.parse(savedDevice).deviceString
            this.ig.state.deviceId = JSON.parse(savedDevice).deviceId
            this.ig.state.uuid = JSON.parse(savedDevice).uuid
            this.ig.state.adid = JSON.parse(savedDevice).adid
            this.ig.state.build = JSON.parse(savedDevice).build
        } else {
            this.ig.state.generateDevice("nozhi");
            await this.ig.simulate.preLoginFlow();
            Bluebird.try(async () => {
                const auth = await this.ig.account.login("your insta login", "your insta pass");
                const cookieJar = await this.ig.state.serializeCookieJar()
                fs.writeFileSync("cookies.json", JSON.stringify(cookieJar), 'utf-8')
                let device = (({ deviceString, deviceId, uuid, adid, build }) => ({ deviceString, deviceId, uuid, adid, build }))(this.ig.state)
                fs.writeFileSync("device.json", JSON.stringify(device), 'utf-8')
            }).catch(IgCheckpointError, async () => {// Checkpoint info here
                await this.ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
                // Challenge info here
                const { code } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'code',
                        message: 'Enter code',
                    },
                ]);
                console.log(await this.ig.challenge.sendSecurityCode(code));
            }).catch(e => console.log('Could not resolve checkpoint:', e, e.stack));
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    async getPost(accountToParse) {

        const id = await this.ig.user.getIdByUsername(accountToParse)
        let newpost = await this.ig.feed.user(id).items().catch(err => err)
        return newpost
    }
    async getPosts(accountToParse) {
        const id = await this.ig.user.getIdByUsername(accountToParse)
        const feed = await this.ig.feed.user(String(id));
        console.log("feed   " + JSON.stringify(feed))
        let posts = []
        let more_available = true
        do {
            try { // in case you get blocked by instagram
                let newpost = await this.ig.feed.user(id).request().catch(err => err)
                posts.push(newpost);
                more_available = newpost.more_available
                console.log(newpost.status + " " + " " + newpost.more_available)
                await this.delay(Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000)
            } catch (err) {
                console.log("error");
                console.log(err);
            }
        }
        while (posts.length < 7 && more_available)
        return posts
    }
    async getAllPostsByHandle(targetHandle) {
        const pk = await this.ig.user.getIdByUsername(targetHandle);
        const feed = await this.ig.feed.user(pk);
        let items = [];
        let page = 1;
        do {
            try { // in case you get blocked by instagram
                console.log(`fetching page... ${page++}`);
                items = items.concat(await feed.items());
                await this.delay(Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000)
            } catch (err) {
                console.log("error");
                console.log(err);
            }
        } while (feed.isMoreAvailable() && page < 9);

        return items;
    }
    async getIDs(accountToParse) {
        let previewComments = []
        let itemslist = []
        let posts = await this.getPosts(accountToParse)
        posts.forEach(post => post.items && post.items.forEach(item => itemslist.push(item.id)))
        return itemslist
    }
    async getCommentator(id) {
        let usersList = []
        let comments = await this.ig.feed.mediaComments(id).items()
        comments.forEach(comment => usersList.push({ username: comment.user.username, id: comment.user_id }))
        return usersList
    }
    async getCommentators(targetHandle) {
        let items = await this.getAllPostsByHandle(targetHandle);
        for (const id of items) {
            console.log(id.caption.media_id)
            /*    let comments = await this.ig.feed.mediaComments(id).items()
                idList.push(comments)*/
            await this.delay(Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000)
        }
        return idlist
    }
    async getIdByUsername(username) {
        const accaunt_name = await this.ig.user.getIdByUsername(username)
        return accaunt_name
    }
    writeToFileTempCommentators(path, data) {
        fs.writeFileSync(path, JSON.stringify(data.speakers), 'utf-8')
    }
    async getUserInfo(id) {
        const userInfo = await this.ig.user.info(id);
        return userInfo
    }
    async readSpeakerFromFile(path) {
        let speakers = JSON.parse(fs.readFileSync(path, "utf8"))
        return speakers
    }
    async followUser(id) {
        const info = await this.ig.user.info(id).catch(error => error)
        const friendshipStatus = await this.ig.friendship.show(id).catch(error => error);
        if (friendshipStatus.following === true) return friendshipStatus;
        let result = await User.findOne({
            where: {
                pk: id,
                username: info.username
            }
        });
        if (result === null) {
            try {
                let makeFriend = await this.ig.friendship.create(id)
                await User.create({
                    pk: id,
                    username: info.username
                })
                return makeFriend
            } catch (error) {
                console.log("Error" + JSON.stringify(error.response.body))
                return JSON.stringify(error.response.body)
            }
        }
    }
    async writeToUser(id) {
        const info = await this.ig.user.info(id).catch(error => error)
        let result = await DirectUser.findOne({
            where: {
                pk: id,
                username: info.username
            }
        });
        if (result === null) {
            try {
                const thread = this.ig.entity.directThread([id.toString()]);
                await thread.broadcastText('Здравствуйте ! У нас интересный выбор ножей , мужских колец , сувенирного оружия, заходите к нам на страницу');
                await DirectUser.create({
                    pk: id,
                    username: info.username
                })
                return { message_is_sent: true }
            } catch (error) {
                console.log("Error" + JSON.stringify(error))
                return JSON.stringify(error)
            }
        } else {
            return { exists: true }
        }
    }

}