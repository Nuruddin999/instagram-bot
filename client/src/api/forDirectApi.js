/* eslint-disable import/no-anonymous-default-export */
import { constants } from "../constants/constants";

export default function (instance) {
    return {
        async getPostId(targetacc) {
            let result = await instance.get(`/postId/${targetacc}`)
            return result.data
        },
        async getUser(id) {
            let result = await instance.get(`/fordirect/${id}`)
            return result.data
        },
        async writeToUser(id) {
            let result = await instance.get(`/write/${id}`).catch(error => error)
            return result.data
        },
        async createUser(name, pk) {
            let result = await instance.post(`/fordirect/`, {
                username: name, pk
            })
            return result.data
        },
        async getUsersFromDb() {
            let result = await instance.get(`/fordirect/`)
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

