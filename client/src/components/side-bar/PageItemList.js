import React, { useState } from "react";
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
    name: "Gia đình",
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
    name: "Báo cáo",
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
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <List>
        {PAGE_ITEM_LIST.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              display: "block",
              backgroundColor: selected === index ? "#b0c4de" : "transparent", // Set the background color for the selected item
            }}
            onClick={() => {
              navigate(item.path);
              setSelected(index); // Update the selected item
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
