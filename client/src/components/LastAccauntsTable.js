import {makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getLastAccounts} from "../store/dataSlice";


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const LastAccauntsTable=()=>{
    const dispatch=useDispatch()
    const state = useSelector(state => state.data)
    useEffect(()=>{
        dispatch(getLastAccounts());
    },[])
    return  <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Действие</TableCell>
                    <TableCell>Дата</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {state.lastAccounts.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell>
                            {row.name}
                        </TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}
export default  LastAccauntsTable