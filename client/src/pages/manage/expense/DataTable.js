import React, { Fragment, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { FIELD_MAPPING } from "./const";
import { formatAmount } from "../helper";

const DataTable = ({ filteredExpense, isAccountant, handleOpenEditDialog, handleOpenDeleteDialog }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 510 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {(isAccountant ? FIELD_MAPPING : FIELD_MAPPING.slice(0, -1)).map(column => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredExpense?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(expense => (
              <TableRow hover role="checkbox" tabIndex={-1} key={`${expense.feeId}_${expense.registrationId}`}>
                {FIELD_MAPPING.slice(0, -1).map(column => (
                  <TableCell key={column.id} align={column.align}>
                    {column.id === FIELD_MAPPING[3].id ? formatAmount(expense[column.id]) : expense[column.id]}
                  </TableCell>
                ))}
                {isAccountant ? (
                  <TableCell>
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton edge="end" color="primary" onClick={() => handleOpenEditDialog(expense)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton edge="end" color="error" onClick={() => handleOpenDeleteDialog(expense)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                ) : (
                  <Fragment />
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredExpense?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
