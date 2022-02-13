

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
        this.ig.story.seen
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
                const auth = await this.ig.account.login("nozhi999", "nurnozhhh999");
                const cookieJar = await this.ig.state.serializeCookieJar()
                fs.writeFileSync("cookies.json", JSON.stringify(cookieJar), 'utf-8')
                let device = (({ deviceString, deviceId, uuid, adid, build }) => ({ deviceString, deviceId, uuid, adid, build }))(this.ig.state)
                fs.writeFileSync("device.json", JSON.stringify(device), 'utf-8')
            })
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
    async getAccauntFollowers() {
        const followersFeed = await this.ig.feed.accountFollowers((await this.ig.account.currentUser()).pk);
        const list = []
        do {
            try { // in case you get blocked by instagram
                const items = await followersFeed.items()
                for (let index = 0; index < items.length; index++) {
                    fs.appendFileSync('foll.txt',`${items[index].pk}\n`)
                    const break_interval = Math.floor(Math.random() * (10 - 5 + 1)) + 5
                    await this.delay(break_interval*1000)
                }
                console.log('break between')
                const break_interval = Math.floor(Math.random() * (10 - 5 + 1)) + 5
                await this.delay(break_interval*1000)
            } catch (err) {
                console.log("error");
                console.log(err);
                break
            }
        } while (followersFeed.isMoreAvailable());

        // return items;
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
    async getCommentator(id,targetAccaunt) {
        let keywords = ['Цена',"цена",'стоит',"доставка","наличии","Доставка","купить","приобрести","почем"]
        let comments = await this.ig.feed.mediaComments(id).items()
        await this.delay(Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000)
        console.log('getCommentator target accaunt',targetAccaunt)
        for (let index = 0; index < comments.length; index++) {
            console.log('current index', index)
            const comment = comments[index];
            const userInfo = await this.ig.user.info(comment.user_id);
                if (userInfo.username !== targetAccaunt) {
                    for (let index = 0; index < keywords.length; index++) {
                        const word = keywords[index];
                        if (comment.text.includes(word)) {
                            await Speaker.findOrCreate({
                                where: { username: comment.user.username, pk:comment.user_id.toString() },
                              });
                              console.log('getCommentator added',userInfo.follower_count + " "  + userInfo.following_count + " " + comment.text)
                        }
                    }
                    if(userInfo.follower_count < 3000 && userInfo.following_count <= 300){
                        await Speaker.findOrCreate({
                            where: { username: comment.user.username, pk:comment.user_id.toString() },
                          });
                        console.log('getCommentator added',userInfo.follower_count + " "  + userInfo.following_count + " " + comment.text)
                        // list.push(element)
                        // console.log('added',"ok")
                    }
                }
                console.log('getCommentator target accaunt','break')
                console.log('current index', index)
                await this.delay(Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000)
        }
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
    async unfollowFromListUsers(){
        let contents = fs.readFileSync('filteredfoll.txt', 'utf8');
        console.log('current list',contents.split("\n").length)
        let list = contents.split("\n").filter((v, i, a) => a.indexOf(v) === i);
        console.log('unique list',list.length)
        for (let index = 1824; index < list.length; index++) {
            console.log('current index',index)
            const element = list[index];
            try {
                await this.ig.friendship.removeFollower(element)
                console.log(index+1,`removed ${element}`)
                await this.delay(Math.floor(Math.random() * (65000 - 60000 + 1)) + 60000)
            } catch (error) {
                console.log('error',error)
                Object.keys(error) && console.log('error object',Object.keys(error))
                console.log('current index',index)
                break
            }
        }
    }
    async FilterAccauntFollowers(){
        let contents = fs.readFileSync('foll.txt', 'utf8');
        let list = contents.split("\n")
        for (let index = 4016; index >= 2500; index--) {
            console.log('current index',index)
            try {
                const element = list[index];
                const userInfo = await this.ig.user.info(element).catch(e=>e);
                if(userInfo.follower_count && userInfo.following_count) {
                    console.log(`follower`,`${userInfo.follower_count}  ${userInfo.following_count.toString()}`)
                    if(userInfo.follower_count > 3000){
                        fs.appendFileSync('filteredfoll.txt',`${userInfo.pk.toString()}\n`)
                        list.push(element)
                        console.log('added',"ok")
                    }
                    if (userInfo.following_count > 300){
                        fs.appendFileSync('filteredfoll.txt',`${userInfo.pk.toString()}\n`)
                        list.push(element)
                        console.log('added',"ok")
                    }
                    console.log('break between info')
                    const break_interval = Math.floor(Math.random() * (45 - 30 + 1)) + 30
                    await this.delay(break_interval*1000)
                }
            }
            catch (error) {
                console.log('error',error)
                Object.keys(error) && console.log('error object',Object.keys(error))
                console.log('current index',index)
                break
            }
        }

    }

}