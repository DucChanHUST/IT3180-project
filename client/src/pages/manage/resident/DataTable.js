import React, { useState, memo } from "react";
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
import Tooltip from "@mui/material/Tooltip";

const RESIDENT_COLUMNS = [
  { id: "id", label: "ID", minWidth: 30 },
  { id: "name", label: "Họ và tên", minWidth: 200 },
  { id: "year", label: "Tuổi", minWidth: 30, align: "center" },
  { id: "idnum", label: "Số CCCD", minWidth: 150, align: "center" },
  { id: "phoneNumber", label: "Số điện thoại", minWidth: 140, align: "center" },
  { id: "action", label: "Thao tác", minWidth: 70, align: "center" },
];

const NUMBER_OF_COLUMNS = RESIDENT_COLUMNS.length;

const DataTable = ({ allResident, handleOpenEditDialog, handleOpenDeleteDialog }) => {
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
      <TableContainer sx={{ maxHeight: 680 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {RESIDENT_COLUMNS.map(column => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allResident?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(resident => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={resident.id}>
                  {RESIDENT_COLUMNS.slice(0, NUMBER_OF_COLUMNS - 1).map(column => {
                    const value = resident[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number" ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell padding="normal">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton edge="end" color="primary" onClick={() => handleOpenEditDialog(resident)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton edge="end" color="error" onClick={() => handleOpenDeleteDialog(resident)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={allResident?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default memo(DataTable);
