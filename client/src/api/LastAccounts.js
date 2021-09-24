import {constants} from "../constants/constants";

export default function (instance) {
    return {
        async getLastAccaunts() {
            let result = await instance.get(`/last_accounts/${constants.INSTAGRAM_ACCOUNT}`)
            return result.data.data
        },
        async createLastAccout(name,actns) {
            let result = await instance.post(`/last_accounts/`,{
name,lastactions:actns
            })
            return result.data
        },
    }
}

