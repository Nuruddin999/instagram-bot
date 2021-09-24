import { Container } from '@material-ui/core';
import React from 'react'
import { Link, Redirect } from "react-router-dom";
import { Grid } from '@material-ui/core';
import { Button } from '@material-ui/core';
const MainPage = () => {
    return (
        <div>
            <Grid container direction={"column"} justifyContent={"center"} alignItems={"center"}>
                <Link to="commentators"><Button variant={"contained"}>сбор комментаторов</Button></Link>
                <Link to="userinfo"><Button variant={"contained"}>Подписка</Button></Link>
            </Grid>

        </div>
    )
}

export default MainPage
