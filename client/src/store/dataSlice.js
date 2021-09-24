import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import commentatorApi from "../api/index"
import { getTestSpeakers } from '../api/test/test_api';
export const fetchPostId = createAsyncThunk(
    'commentators/fetchPostId',
    async (props) => {
        const response = await commentatorApi.commentatorsModule.getPostId(props.target_acc)
        return response
    }
)
export const getSpeaker = createAsyncThunk(
    'commentators/getspeaker',
    async (props, thunkAPI) => {
        const response = await commentatorApi.commentatorsModule.getSpeaker(props.id)
        for (let index = 90; index < response.length; index++) {
            await commentatorApi.commentatorsModule.createSpeaker(response[index].username, response[index].id.toString())
        }
        const speakersFromDb = await commentatorApi.commentatorsModule.getSpeakersFromDb()
        return speakersFromDb;
    }
)

export const getUserInfo = createAsyncThunk('commentators/userinfo', async (props, thuncAPI) => {
    const { speakersFollowed, comments } = thuncAPI.getState().data
    localStorage.setItem("currentUser", props.currentIndex)
    const response = await commentatorApi.commentatorsModule.getUserInfo(props.id)
    let prevComments = comments
    let newAdded = speakersFollowed
    if (response.following_count <= 500 && response.follower_count <= 5000) {
        const followResponse = await commentatorApi.commentatorsModule.followUser(props.id).catch(error => error);
        if (followResponse.following === true || followResponse.is_private === true) {
            prevComments = comments.map(el => el.pk === props.id ? ({ ...el, watching: true, subscribed: true }) : el)
            newAdded = [...speakersFollowed, comments.find(el => el.pk === props.id)]
        }
        else {
            prevComments = comments.map(el => el.pk === props.id ? ({ ...el, watching: true }) : el)
        }
    }

    return { prevComments, speakersFollowed: newAdded, currentIndex: props.currentIndex }

})
export const sendMessageInDirect = createAsyncThunk('commentators/sentindirect', async (props, thuncAPI) => {
    const { directFollowed, comments } = thuncAPI.getState().data
    let newAdded = directFollowed
    let error = false
    const directResponse = await commentatorApi.commentatorsModule.writeToUser(props.id).catch(error => error);
    if (directResponse.message_is_sent) {
        localStorage.setItem("currentDirectIndex", props.currentIndex)
        newAdded = [...directFollowed, comments.find(el => el.pk === props.id)]
    }
    else if (directResponse.exists) {
        localStorage.setItem("currentDirectIndex", props.currentIndex)
    }
    else {
        error = true
    }
    return { newAdded, currentDirectIndex: localStorage.getItem("currentDirectIndex"), error }

})
export const readFromDb = createAsyncThunk('commentators/readspeakers', async (props, thuncAPI) => {
    const speakersFromDb = await commentatorApi.commentatorsModule.getFromDb(props.url)
    return speakersFromDb.map(el => ({ ...el, watching: false, subscribed: false, isReceiveDirect: false }))
})
export const readUsersFromDb = createAsyncThunk('commentators/readusers', async (props, thuncAPI) => {
    const usersFromDb = await commentatorApi.commentatorsModule.getUsersFromDb()
    return usersFromDb
})
export const getLastAccounts = createAsyncThunk("commentators/getlastaccounts", async () => {
    const response = await commentatorApi.last_accounts.getLastAccaunts()
    return response
})
export const createLastAccounts = createAsyncThunk("commentators/create_lastaccounts", async (props) => {
    const response = await commentatorApi.last_accounts.createLastAccout(props.name, props.lastactions)
    if (response) {
        const result = await commentatorApi.last_accounts.getLastAccaunts()
        return result
    }
})
export const saveSpeakerForDirect = createAsyncThunk(
    'commentators/save_for_direct',
    async (props, thuncAPI) => {
        const { comments } = thuncAPI.getState().data
        for (let index = 0; index < comments.length; index++) {
            await commentatorApi.commentatorsModule.saveToDirectDb(comments[index].username, comments[index].pk)
        }
        const speakersFromDb = await commentatorApi.commentatorsModule.getSpeakersFromDb()

        return speakersFromDb;
    }
)
export const dataSlice = createSlice({
    name: 'data',
    initialState: {
        postIds: [],
        more_available: false,
        comments: [],
        speakersAreInFile: false,
        isLastSpeaker: false,
        speakersFollowed: [],
        directFollowed: [],
        isFriend: false,
        lastAccounts: [],
        allFollowed: [],
        currentUser: null,
        skeletonSpeakers: [],
        currentDirectIndex: 145,
        directError: false
    },
    reducers: {
        changeField: (state, action) => {
            state[action.payload.field] = action.payload.value
        },
        getCurrentIndex: (state, action) => {
            let num = localStorage.getItem(action.payload.field === "currentDirectIndex" ? "currentDirectIndex" : "currentUser")
            if (num) {
                state[action.payload.field] = num
            }
        },
        deleteIndexFromLocalStorage: (state, action) => {
            localStorage.removeItem("currentUser")
            state.currentUser = 0
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPostId.fulfilled, (state, action) => {

            state.postIds = action.payload
        })
        builder.addCase(getSpeaker.fulfilled, (state, action) => {
            state.comments = action.payload

        })
        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            state.comments = action.payload.prevComments
            state.speakersFollowed = action.payload.speakersFollowed
            state.currentIndex = action.payload.currentIndex
        })
        builder.addCase(sendMessageInDirect.fulfilled, (state, action) => {
            state.directFollowed = action.payload.newAdded
            state.currentDirectIndex = action.payload.currentDirectIndex
            state.directError = action.payload.error
        })
        builder.addCase(readFromDb.pending, (state, action) => {
            state.skeletonSpeakers = [{ "id": 1, "pk": "0010", "username": "testSpeaker 1" }, { "id": 2, "pk": "0011", "username": "testSpeaker 2" }, { "id": 3, "pk": "0012", "username": "testSpeaker 3" }, { "id": 4, "pk": "0013", "username": "testSpeaker 4" }, { "id": 5, "pk": "0014", "username": "testSpeaker 5" }, { "id": 6, "pk": "0015", "username": "testSpeaker 6" }, { "id": 7, "pk": "0016", "username": "testSpeaker 7" }, { "id": 8, "pk": "0017", "username": "testSpeaker 8" }, { "id": 9, "pk": "0018", "username": "testSpeaker 9" }, { "id": 10, "pk": "0019", "username": "testSpeaker 10" }, { "id": 11, "pk": "00110", "username": "testSpeaker 11" }, { "id": 12, "pk": "00111", "username": "testSpeaker 12" }, { "id": 13, "pk": "00112", "username": "testSpeaker 13" }, { "id": 14, "pk": "00113", "username": "testSpeaker 14" }, { "id": 15, "pk": "00114", "username": "testSpeaker 15" }, { "id": 16, "pk": "00115", "username": "testSpeaker 16" }, { "id": 17, "pk": "00116", "username": "testSpeaker 17" }, { "id": 18, "pk": "00117", "username": "testSpeaker 18" }, { "id": 19, "pk": "00118", "username": "testSpeaker 19" }, { "id": 20, "pk": "00119", "username": "testSpeaker 20" }, { "id": 21, "pk": "00120", "username": "testSpeaker 21" }, { "id": 22, "pk": "00121", "username": "testSpeaker 22" }, { "id": 23, "pk": "00122", "username": "testSpeaker 23" }, { "id": 24, "pk": "00123", "username": "testSpeaker 24" }, { "id": 25, "pk": "00124", "username": "testSpeaker 25" }, { "id": 26, "pk": "00125", "username": "testSpeaker 26" }, { "id": 27, "pk": "00126", "username": "testSpeaker 27" }, { "id": 28, "pk": "00127", "username": "testSpeaker 28" }, { "id": 29, "pk": "00128", "username": "testSpeaker 29" }, { "id": 30, "pk": "00129", "username": "testSpeaker 30" }]

        })
        builder.addCase(readFromDb.fulfilled, (state, action) => {
            state.comments = action.payload
            state.skeletonSpeakers = []

        })
        builder.addCase(readUsersFromDb.fulfilled, (state, action) => {
            state.allFollowed = action.payload
        })
        builder.addCase(getLastAccounts.fulfilled, (state, action) => {
            state.lastAccounts = action.payload
        })
        builder.addCase(createLastAccounts.fulfilled, (state, action) => {
            state.lastAccounts = action.payload
        })
    }
})

// Action creators are generated for each case reducer function
export const { changeField, getCurrentIndex, deleteIndexFromLocalStorage } = dataSlice.actions

export default dataSlice.reducer