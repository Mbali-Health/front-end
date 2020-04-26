import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PeopleOutline from '@material-ui/icons/PeopleOutline';
import Box from '@material-ui/core/Box';

import UsersList from '../UsersList';
import SideNavHeading from '../../molecules/SideNavHeading';
import styled from 'styled-components';

const styles = (theme) => ({
  sideNav: {
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    width: '350px',
    height: '100vh',
    position: 'relative',
    paddingTop: '1px',
  },
  root: {
    flexGrow: 1,
  },
  tabsRoot: {
    marginLeft: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  tabsIndicator: {
    background: '#fafafa',
  },
  tabSelected: {
    background: '#43444f',
  },
  tabRoot: {
    color: '#43444f',
    marginRight: 0,
    marginLeft: 0,
    minWidth: 110,
    fontSize: '12px',
    fontWeight: theme.typography.fontWeightRegular,
  },
});
const StyledTabs = styled(Tabs)`
  background-color: #fafafa;
  color: #43444f;
`;
const StyledTab = styled(Tab)`
  outline: none;
`;
const ResultsWrapper = styled.aside`
  height: calc(100% - 49px);
`;
const NoResults = styled(PeopleOutline)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -45px;
  font-size: 90px;
  color: #8a8d91;
`;

const MessagePanel = ({ children, value, index, ...other }) => {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`message-tabpanel-${index}`}
      aria-labelledby={`message-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
};

const a11yProps = (index) => {
  return {
    id: `messages-tab-${index}`,
    'aria-controls': `messages-tabpanel-${index}`,
  };
};

const SideNav = ({ classes, consultations, activeConvo, onClick}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const waitingRoomKeys = Object.keys(consultations || {}).filter(roomId => {
    return !consultations[roomId].practitioner
  })

  const activeChats = []
  const waitingRoomChats = []
  Object.keys(consultations || {}).forEach(key =>{
    if (waitingRoomKeys.includes(key)) {
      waitingRoomChats.push(consultations[key])
    } else {
      activeChats.push(consultations[key])
    }
  })

  return (
    <aside className={classes.sideNav}>
      <SideNavHeading />
      <div className={classes.root}>
        <AppBar position="static">
          <StyledTabs
            value={activeTab}
            onChange={handleChange}
            aria-label="messages toggle tab"
            indicatorColor="primary">
            <StyledTab label="Active Chat" {...a11yProps(0)} />
            <StyledTab label="Waiting Room" {...a11yProps(1)} />
          </StyledTabs>
        </AppBar>
        <MessagePanel value={activeTab} index={0}>
          <UsersList 
            chats={activeChats} 
            activeConvo={activeConvo}
            onSidebarItemClicked={onClick}/>
        </MessagePanel>
        <MessagePanel value={activeTab} index={1}>
          <UsersList 
            chats={waitingRoomChats}
            activeConvo={activeConvo}
            onSidebarItemClicked={onClick}/>
        </MessagePanel>
      </div>
    </aside>
  );
};

export default withStyles(styles)(SideNav);
