import { Box } from '@mui/material';
import React, { Fragment } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

const SideBar = () => {
  return (
    <Fragment>
      {/* w-64 flex-col border-r bg-background p-6 lg:flex */}
      <Sidebar width="256px" style={{ borderRight: "1px solid #ccc", padding: "24px"}}>
        <Box sx={{width:'100%'}}>
            <img src="" alt="logo" />
        </Box>
        <Menu>
          <SubMenu label="Charts">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu>
          <MenuItem> Documentation </MenuItem>
          <MenuItem> Calendar </MenuItem>
        </Menu>
      </Sidebar>
    </Fragment>
  );
}

export default SideBar