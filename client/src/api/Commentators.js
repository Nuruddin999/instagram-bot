/* eslint-disable import/no-anonymous-default-export */
import { constants } from "../constants/constants";

export default function (instance) {
    return {
        async getPostId(targetacc) {
            let result = await instance.get(`/postId/${targetacc}`)
            return result.data
        },
        async getSpeaker(id) {
            let result = await instance.get(`/getspeaker/${id}`)
            return result.data
        },
        async getIdByName(name) {
            let result = await instance.get(`/getidbyname/${name}`)
            return result.data
        },
        async getUserInfo(id) {
            let result = await instance.get(`/userinfo/${id}`)
            console.log(result)
            return result.data
        },
        async readFromSpeakersFromFile(path) {
            let result = await instance.get(`/readspeakers/${path}`)
            return result.data
        },
        async followUser(id) {
            let result = await instance.get(`/follow/${id}`).catch(error => error)
            return result.data
        },
        async writeToUser(id) {
            let result = await instance.get(`/write/${id}`).catch(error => error)
            return result.data
        },
        async createSpeaker(name, pk) {
            let result = await instance.post(`/speakers/`, {
                username: name, pk
            })
            return result.data
        },
        async getFromDb(url) {
            let result = await instance.get(url)
            console.log(result)
            return result.data.data
        },
        async getUsersFromDb() {
            let result = await instance.get(`/users/${constants.INSTAGRAM_ACCOUNT}`)
            return result.data.data
        },
        async saveToDirectDb(name, pk) {
            let result = await instance.post(`/direct_user/${constants.INSTAGRAM_ACCOUNT}`, {
                username: name, pk
            })
            return result.data.data
        },
    }
}

