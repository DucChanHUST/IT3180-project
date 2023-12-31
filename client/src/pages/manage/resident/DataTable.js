import React, { useState, memo, Fragment } from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
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
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

const RESIDENT_COLUMNS = [
  { id: "id", label: "Mã nhân khẩu", minWidth: 30, align: "center" },
  { id: "name", label: "Họ và tên", minWidth: 160, align: "left" },
  { id: "dob", label: "Ngày sinh", minWidth: 80, align: "center" },
  { id: "gender", label: "Giới tính", minWidth: 50, align: "center" },
  { id: "idNumber", label: "Số CCCD", minWidth: 150, align: "center" },
  { id: "phoneNumber", label: "Số điện thoại", minWidth: 140, align: "center" },
  { id: "registrationId", label: "Mã hộ", minWidth: 30, align: "center" },
  { id: "relationship", label: "Quan hệ với chủ hộ", minWidth: 120, align: "center" },
  { id: "action", label: "Thao tác", minWidth: 70, align: "center" },
];

const NUMBER_OF_COLUMNS = RESIDENT_COLUMNS.length;

const DataTable = ({ filteredResident, handleOpenEditDialog, handleOpenDeleteDialog, isLeader }) => {
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
              {(isLeader ? RESIDENT_COLUMNS : RESIDENT_COLUMNS.slice(0, -1)).map(column => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResident?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(resident => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={resident.id}>
                  {RESIDENT_COLUMNS.slice(0, NUMBER_OF_COLUMNS - 1).map(column => {
                    const value = resident[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id !== "relationship" ? (
                          value
                        ) : value ? (
                          value
                        ) : (
                          <Tooltip title="Lỗi">
                            <IconButton edge="end" color="error">
                              <ErrorOutlineRoundedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    );
                  })}
                  {isLeader ? (
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
                  ) : (
                    <Fragment />
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredResident?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default memo(DataTable);
