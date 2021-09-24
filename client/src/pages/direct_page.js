
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteIndexFromLocalStorage, getCurrentIndex, getSpeaker, getUserInfo } from '../store/dataSlice';
import { useSelector } from 'react-redux';
import { delayInRequest } from '../utils/utils';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Box, Button, makeStyles, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import AccauntsFields from "../components/AccauntsFields";
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ChipRow from "../components/ChipRow";
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
    "@keyframes myEffect": {
        "0%": {
            background: "#dddddd",
        },
        "100%": {
            background: "#c6c6c6",
        }
    },
})
function DirectPage() {
    const styles = useStyles()
    const dispatch = useDispatch()
    const state = useSelector(state => state.data);
    useEffect(() => {
        //  dispatch(readSpeakersFromDb());
        dispatch(getCurrentIndex("currentDirectIndex"))
    }, [])
    return (
        <div className={styles.subscribe}>
            <Typography variant="h5" color="primary">
                Сбор комментаторов и их сохранение
            </Typography>
            <Box>
                {
                    state.comments.length > 0 && <Box><Button variant={"contained"}>Сохранить для direct </Button><Button variant={"contained"}>Подписка</Button></Box>}


                <ChipRow />
                <Box width="100%" display="flex" justifyContent={state.skeletonSpeakers.length > 0 && "center"}>
                    <Box width={state.skeletonSpeakers.length > 0 || state.speakersFollowed.length === 0 ? "90%" : "50%"}>
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
                                {state.comments.length > 0 && state.comments.map((el, index) =>
                                    <TableRow className={el.watching && !el.subscribed && styles.trow}>
                                        <TableCell className={el.watching && !el.subscribed && styles.cellColor}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className={el.watching && !el.subscribed && styles.cellColor}>
                                            {el.username}
                                        </TableCell>
                                        {el.subscribed && <TableCell>
                                            <CheckCircleIcon className={styles.iconColor} />
                                        </TableCell>}
                                    </TableRow>)}
                            </TableBody>
                        </table>
                    </Box>
                    {state.speakersFollowed.length > 0 && <Box width="50%">
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

export default DirectPage;
