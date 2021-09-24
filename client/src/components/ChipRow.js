import React from 'react';
import {Chip, Grid} from "@material-ui/core";
import {useSelector} from "react-redux";

const ChipRow = () => {
    const state = useSelector(state => state.data);
    return    <Grid container>
        <Grid item>
            {state.postIds.length > 0 && <Chip label={"id постов получены"}/>}
        </Grid>
        <Grid item>
            {state.comments.length > 0 && <Chip label={"собираем комментаторов"}/>}
        </Grid>
        <Grid item>
            {state.isLastSpeaker && <Chip label={"Комментаторы собраны , сохраняем"}/>}
        </Grid>
    </Grid>
};

export default ChipRow;