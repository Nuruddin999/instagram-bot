import {Button, Grid, TextField} from "@material-ui/core";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createLastAccounts, fetchPostId} from "../store/dataSlice";

const  AccauntsFields=()=>{
    const dispatch=useDispatch()
    const [localState,setLocalState]=useState({
        target_account:"",
        actions_with_account:""
    });
    function handleChange(field, e) {
        setLocalState(state=>({...state,[field]:e.target.value}))
    }
const runOperation=()=>{
        dispatch(createLastAccounts({name: localState.target_account,lastactions:localState.actions_with_account}))
        dispatch(fetchPostId({target_acc:localState.target_account}))

}
    return     <Grid container justify={"space-around"} alignItems={"center"} >
        <Grid item>
            <TextField placeholder={"с какого аккаунта собираем"} value={localState.target_account} onChange={(e)=>handleChange("target_account",e)} variant={"outlined"} />
        </Grid>
        <Grid item>
            <TextField placeholder={"название действия "} value={localState.actions_with_account} onChange={(e)=>handleChange("actions_with_account",e)} variant={"outlined"} />
        </Grid>
        <Grid item>
            <Button variant={"contained"} onClick={runOperation}>Запустить </Button>
        </Grid>
    </Grid>
}
export default  AccauntsFields