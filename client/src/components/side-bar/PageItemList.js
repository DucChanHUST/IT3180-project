import React from "react";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useNavigate } from "react-router-dom";
import { PathConstant } from "../../const";

const PAGE_ITEM_LIST = [
  {
    name: "Nhân khẩu",
    path: PathConstant.POPULATION,
    icon: <PersonRoundedIcon />,
  },
  {
    name: "Hộ khẩu",
    path: PathConstant.RESIDENCE,
    icon: <HomeRoundedIcon />,
  },
  {
    name: "Khoản phí",
    path: PathConstant.FEE,
    icon: <CreditCardRoundedIcon />,
  },
  {
    name: "Đóng phí",
    path: PathConstant.PAY_FEE,
    icon: <SavingsRoundedIcon />,
  },
  {
    name: "Thống kê",
    path: PathConstant.STATISTIC,
    icon: <InsightsRoundedIcon />,
  },
  {
    name: "Cài đặt",
    path: PathConstant.POPULATION,
    icon: <SettingsRoundedIcon />,
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
            sx={{ display: "block" }}
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
