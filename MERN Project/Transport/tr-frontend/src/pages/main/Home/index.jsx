import React, { Fragment } from 'react'
import { Outlet } from 'react-router'
import Box from "@mui/material/Box";
import SideBar from '../../../components/auth/sidebar';
import Header from '../../../components/auth/header';
import { ProSidebarProvider } from "react-pro-sidebar";

const Home = () => {
  return (
    <Fragment>
      <ProSidebarProvider>
        <Box
          component="section"
          sx={{ width: "100%", minHeight: "100vh", display: "flex" }}
        >
          {/* Side Bar */}
          <SideBar />

          <Box
            sx={{ display: "flex", flexDirection: "column", flex: "1 1 0%" }}
          >
            {/* Header Bar */}
            <Header />

            <main className="flex flex-1 bg-muted/40 p-4 md:p-6">
              <Outlet />
            </main>
          </Box>
        </Box>
      </ProSidebarProvider>
    </Fragment>
  );
}

export default Home