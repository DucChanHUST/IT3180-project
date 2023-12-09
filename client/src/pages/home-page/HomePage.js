import React from "react";
import { images } from "./images";
import { SideBar, NavBar } from "../../components";
import { Box, Grid, Stack, Paper, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const HomePage = () => {
  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        
        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Stack alignItems="center">
            <Typography variant="h4" fontWeight="bold" style={{ textDecoration: "underline" }}>
              Tin tức
            </Typography>
          </Stack>

          <Carousel>
            {images.map((image, index) => (
              <Paper
                key={index}
                style={{
                  height: 550,
                  padding: 20,
                  display: "flex",
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Paper>
            ))}
          </Carousel>
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
