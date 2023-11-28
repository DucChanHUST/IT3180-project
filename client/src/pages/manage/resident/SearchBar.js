import React, { useState } from "react";
import { FormControl, MenuItem, Select, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FIELD_MAPPING } from "./const";

const SearchBar = ({ flattenedResident, setFilteredResident }) => {
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryChange = event => {
    const category = event.target.value;
    setSearchCategory(category);

    filterResident(searchTerm, category);
  };

  const handleSearchChange = event => {
    const term = event.target.value;
    setSearchTerm(term);

    filterResident(term, searchCategory);
  };

  const filterResident = (term, searchCategory) => {
    const filteredResident = flattenedResident.filter(item => {
      if (!item) {
        return false;
      }

      const value = item[searchCategory];

      if (searchCategory === "all") {
        return Object.values(item).some(val => val && val.toString().toLowerCase().includes(term.toLowerCase()));
      } else {
        return value && value.toString().toLowerCase().includes(term.toLowerCase());
      }
    });

    setFilteredResident(filteredResident);
  };

  return (
    <Stack direction="row" spacing={2} style={{ width: "100%" }}>
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl style={{ width: "35%" }}>
        <Select value={searchCategory} onChange={handleCategoryChange}>
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="id">ID</MenuItem>
          <MenuItem value="name">{FIELD_MAPPING.name}</MenuItem>
          <MenuItem value="dob">{FIELD_MAPPING.dob}</MenuItem>
          <MenuItem value="gender">{FIELD_MAPPING.gender}</MenuItem>
          <MenuItem value="idNumber">{FIELD_MAPPING.idNumber}</MenuItem>
          <MenuItem value="phoneNumber">{FIELD_MAPPING.phoneNumber}</MenuItem>
          <MenuItem value="registrationId">{FIELD_MAPPING.registrationId}</MenuItem>
          <MenuItem value="relationship">{FIELD_MAPPING.relationship}</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

export default SearchBar;
