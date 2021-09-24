
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    deleteIndexFromLocalStorage,
    getCurrentIndex,
    getSpeaker,
    getUserInfo,
    readSpeakersFromDb,
    readFromDb,
    sendMessageInDirect
} from '../store/dataSlice';
import { useSelector } from 'react-redux';
import { delayInRequest } from '../utils/utils';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Box, Button, Chip, Grid, makeStyles, TableBody, TableCell, TableRow, TextField, Typography } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EmailIcon from '@material-ui/icons/Email';
import SaveIcon from '@material-ui/icons/Save';
import ChipRow from "../components/ChipRow";
import { constants } from '../constants/constants';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
const useStyles = makeStyles({
    table: {
        height: "100%",
        width: "100%"
    },
    subscribe: {
        height: "100%",
        overflowY: "auto"
    },
    trow: {
        background: "grey",
    },
    cellColor: {
        color: "white"
    },
    iconColor: {
        color: "green"
    },
    skeleton_row: { background: "#fff" },
    skeleton: {
        background: "#dddddd",
        borderRadius: "5px",
        width: "80%",
        height: "20px",
        animation: `$myEffect 1s linear infinite alternate`
    },
    cell: {
        width: "10%"
    },
    btnsTitle: {
        fontSize: ".5em",
        letterSpacing: "1px",
        color: "#813147",
        '& svg': {
            fontSize: "2rem"
        },
        cursor: "pointer"
    },
    "@keyframes myEffect": {
        "0%": {
            background: "#dddddd",
        },
        "100%": {
            background: "#c6c6c6",
        }
    },

})
function CommentatorsPage() {
    const [localState, setState] = useState({
        sendDirectIsClicked: false
    })
    const styles = useStyles()
    const dispatch = useDispatch()
    const state = useSelector(state => state.data);
    const getCommentIds = async () => {
        for (let index = 0; index < state.postIds.length; index++) {
            if (state.postIds[index].caption) {
                dispatch(getSpeaker({ id: state.postIds[index].caption.media_id }))
                await delayInRequest(Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000)
            }

        }
    }
    const getInfo = async () => {
        if (state.currentUser !== null) {
            for (let index = state.currentUser; index < state.comments.length; index++) {
                dispatch(getUserInfo({ id: state.comments[index].pk, currentIndex: index }))
                if (state.directError) {
                    return
                }
                await delayInRequest(Math.floor(Math.random() * (65000 - 60000 + 1)) + 60000)
                if (index === state.comments.length - 1) {
                    dispatch(deleteIndexFromLocalStorage())
                }
            }
        }

    }
    const sendInDirect = async () => {
        setState(state => ({ ...state, sendDirectIsClicked: !state.sendDirectIsClicked }))
        if (state.currentDirectIndex !== null) {
            for (let index = state.currentDirectIndex; index < state.comments.length; index++) {
                dispatch(sendMessageInDirect({ id: state.comments[index].pk, currentIndex: index }))
                await delayInRequest(Math.floor(Math.random() * (70000 - 65000 + 1)) + 65000)
                if (index === state.comments.length - 1) {
                    dispatch(deleteIndexFromLocalStorage())
                }
            }
        }
    }
    useEffect(() => {
        if (state.postIds.length > 0 && !state.isLastSpeaker) {
            getCommentIds()
        }
    }, [state.postIds, state.isLastSpeaker])
    useEffect(() => {
        dispatch(readFromDb({ url: `/speakers/${constants.INSTAGRAM_ACCOUNT}` }));
        dispatch(getCurrentIndex({ field: "currentUser" }))
        dispatch(getCurrentIndex({ field: "currentDirectIndex" }))
    }, [])
    return (
        <div className={styles.subscribe}>
            <Typography variant="h5" color="primary">
                Сбор комментаторов и их сохранение
            </Typography>

            <Box>
                {
                    state.comments.length > 0 && <Box display="flex" justifyContent="space-around" width="50%" mt={2} mx="auto">
                        <Box display="flex" flexDirection="column" onClick={sendInDirect} alignItems="center" className={styles.btnsTitle}>
                            <EmailIcon />
                            <span>Рассылка direct</span>
                        </Box>
                        <Box display="flex" flexDirection="column" onClick={getInfo} alignItems="center" className={styles.btnsTitle}>
                            <AssignmentIndIcon />

                            <span>Подписка</span>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center" className={styles.btnsTitle}>
                            <Box display="flex" justifyContent="cneter"><EmailIcon />
                                <SaveIcon />
                            </Box>
                            <span>Сохранение для direct</span>
                        </Box>
                        <Box display="flex" flexDirection="column" onClick={getInfo} alignItems="center" className={styles.btnsTitle}>
                            <DeleteIcon />
                            <span>Очистить</span>
                        </Box>
                    </Box>}
                <Box width="100%" display="flex" flexDirection="column" justifyContent={state.skeletonSpeakers.length > 0 && "center"} alignItems="center">
                    <Box width={state.skeletonSpeakers.length > 0 || state.speakersFollowed.length === 0 ? "90%" : "50%"}>
                        <Box mt={3}>
                            <Typography>Текущие пользователи</Typography>
                        </Box>
                        <table className={styles.table}>
                            <TableBody>
                                {state.postIds.length > 0 && state.comments.length === 0 && state.postIds.map((el, index) => <tr><td>{index + 1})</td><td>{el.id}</td></tr>)}
                                {state.skeletonSpeakers.length > 0 && state.skeletonSpeakers.map((el, index) =>
                                    <TableRow className={styles.skeleton_row}>
                                        <TableCell className={styles.cell}>
                                            <div className={styles.skeleton}>

                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={styles.skeleton}>

                                            </div>
                                        </TableCell>
                                    </TableRow>)}

                                <TableRow>
                                    <TableCell>
                                        <span>direct</span>
                                    </TableCell>
                                    <TableCell>
                                        {state.currentDirectIndex}
                                    </TableCell>
                                    <TableCell>
                                        {state.currentDirectIndex !== null && state.comments.length > 0 && state.comments[state.currentDirectIndex].username}
                                    </TableCell>
                                    <TableCell>
                                        {state.directError && <span>"Ошибка, надо подождать"</span>}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <span>подписка</span>
                                    </TableCell>
                                    <TableCell>
                                        {state.currentUser}
                                    </TableCell>
                                    <TableCell>
                                        {state.comments.length > 0 && state.cu && state.comments[state.currentUser].username}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </table>
                    </Box>
                    {state.directFollowed.length > 0 && <Box width="100%" height="50vh" overflow="auto">
                        <Box mt={2}>
                            <Typography>Сообщение получили</Typography>
                            <table className={styles.table}>
                                <TableBody>
                                    {state.directFollowed.length > 0 && state.directFollowed.map((el, index) => <TableRow><TableCell>{index + 1})</TableCell><TableCell>{el.username}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </table>
                        </Box>
                    </Box>}
                    {state.speakersFollowed.length > 0 && !localState.sendDirectIsClicked && <Box width="50%">
                        <Box >
                            <Typography>Подписанные пользователи</Typography>
                            <table className={styles.table}>
                                <TableBody>
                                    {state.skeletonSpeakers.length > 0 && state.skeletonSpeakers.map((el, index) => <TableRow className={styles.skeleton}><TableCell className={styles.skeleton}>{index + 1})</TableCell><TableCell className={styles.skeleton}>{el.username}</TableCell></TableRow>)}
                                    {state.speakersFollowed.length > 0 && state.speakersFollowed.map((el, index) => <TableRow><TableCell>{index + 1})</TableCell><TableCell>{el.username}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </table>
                        </Box>
                    </Box>}
                </Box>

            </Box>
        </div>
    );
}

export default CommentatorsPage;
