import React, { useState } from "react";
import { FormControl, MenuItem, Select, Stack, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FIELD_MAPPING } from "./const";

const SearchBar = ({ allFee, setFilteredFee }) => {
  const [searchCategory, setSearchCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filterFee = () => {};

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
              {field.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default SearchBar;
