
import { Switch, Route, Link } from 'react-router-dom';
import CommentatorsPage from './pages/commentators_page';
import { Box, makeStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import "./App.css"
import DirectPage from './pages/direct_page';
import { ListItemText } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { List } from '@material-ui/core';
import { StylesContext } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '14%',
    height: "100%",
    borderRight: "1px solid purple",
    background: "#1C4E80",
    color: "#EDE9EE",
    '& a': {
      textDecoration: "none",
      color: "inherit"
    }
  },
}));
function App() {
  const styles = useStyles()

  return (
    <div className="App">
      <Box className={styles.root}>

        <List component="nav" aria-label="main mailbox folders">
          <Link to="commentators">
            <ListItemText primary="Подписка" />
          </Link>
          <Link to="userinfo">
            <ListItemText primary="Директ" />
          </Link>
        </List>
      </Box>
      <Box height="100%" borderRight={1} borderColor={"primary"} width={"80%"} position="absolute" left={"20%"} top={0}>
        <Switch>
          <Route exact path="/commentators" render={(prop) => <CommentatorsPage />} />
          <Route exact path="/userinfo" render={(prop) => <DirectPage />} />
        </Switch>
      </Box>
      {/* <Grid container>
        <Grid item md={2}>
        </Grid>
        <Grid item md={10}>
          <Switch>
            <Route path="/commentators" render={(prop) => <CommentatorsPage />} />
            <Route path="/userinfo" render={(prop) => <UserInfoPage />} />
          </Switch>
        </Grid>
      </Grid> */}


    </div>
  );
}

export default App;
