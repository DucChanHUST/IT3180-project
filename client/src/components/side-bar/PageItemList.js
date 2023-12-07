import React, { useState, useEffect } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import { PathConstant } from "../../const";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const PAGE_ITEM_LIST = [
  {
    name: "Nhân khẩu",
    path: PathConstant.RESIDENT,
    icon: <PersonRoundedIcon />,
  },
  {
    name: "Gia đình",
    path: PathConstant.REGISTRATION,
    icon: <HomeRoundedIcon />,
  },
  {
    name: "Khoản phí",
    path: PathConstant.FEE,
    icon: <CreditCardRoundedIcon />,
  },
  {
    name: "Khoản nộp",
    path: PathConstant.EXPENSE,
    icon: <SavingsRoundedIcon />,
  },
  {
    name: "Báo cáo",
    path: PathConstant.STATISTIC,
    icon: <InsightsRoundedIcon />,
  },
];

const PageItemList = ({ open }) => {
  const navigate = useNavigate();

  return (
    <div>
      <List>
        {PAGE_ITEM_LIST.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              display: "block",
            }}
            onClick={() => {
              navigate(item.path);
            }}
          >
            <ListItemButton sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PageItemList;
