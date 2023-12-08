import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { FIELD_MAPPING } from "./const";
import { FormControl, MenuItem, Select, Stack, TextField, InputAdornment } from "@mui/material";

const SearchBar = ({ expenseData, setFilteredExpense }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const handleCategoryChange = event => {
    const category = event.target.value;
    setSearchCategory(category);

    filterFee(searchTerm, category);
  };

  const handleSearchChange = event => {
    const term = event.target.value;
    setSearchTerm(term);

    filterFee(term, searchCategory);
  };

  const filterFee = (term, searchCategory) => {
    const filteredExpense = expenseData.filter(item => {
      const value = item[searchCategory];

      if (searchCategory === "all") {
        return Object.values(item).some(val => val && val.toString().includes(term.toLowerCase()));
      } else {
        return value.toString().toLowerCase().includes(term.toLowerCase());
      }
    });

    setFilteredExpense(filteredExpense);
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
          {FIELD_MAPPING.slice(0, -1).map(field => (
            <MenuItem key={field.id} value={field.id}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default SearchBar;
