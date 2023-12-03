import React from 'react'
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import { FIELD_MAPPING } from './const';

const DataTable = ({isAccountant}) => {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden"}}>
      <TableContainer sx={{maxHeight: 510}}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
            <TableRow>
              {(isAccountant ? FIELD_MAPPING : FIELD_MAPPING.slice(0, -1)).map(column => (
                <TableCell key={column.id} align={column.align ? column.align : "center"} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default DataTable