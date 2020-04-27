import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

import UserItem from '../../molecules/UserItem';

import { PRACTITIONER_ID, PRACTIONER_ID } from '../../../utils/Constants.js'
const styles = {
  List: {
    padding: 0,
    margin: 0,
  },
  ListItem: {
    padding: 0,
    margin: 0,
  },
};
const UsersListWrapper = styled.aside`
  height: calc(100% - 49px);
`;
const UsersListItems = styled.div`
  overflow: scroll;
  height: calc(100%);
`;
const UserSelected = styled(ListItem)`
  border-right: 3px solid #ccc;
  background: rgba(0, 0, 0, 0.08);
`;
const UserNotSelected = styled(ListItem)`
  border-right: 3px solid transparent;

  &:hover {
    border-right: 3px solid #ccc;
    background: rgba(0, 0, 0, 0.08);
  }
`;

const UsersList = ({ classes, chats, activeConvo, onSidebarItemClicked}) => {
  return (
    <UsersListWrapper>
      <UsersListItems>
        <List component="nav" className={classes.List}>
          {chats.map((chat, i) => {
            console.log(chat)
            if (!chat.messages) return <div />
            const recentMsg = chat.messages[chat.messages.length -1]
            if(chat._id === activeConvo) {
              return <UserSelected key={i}
              button
              onClick={(e) => onSidebarItemClicked(chat._id)}
              className={classes.ListItem} >
              <UserItem key={i} 
              name={chat.name}
                lastMessage={recentMsg.content.message}
                date={recentMsg.sent_ts}
                />
              </UserSelected>
            } else {

          return <UserNotSelected key={i}
          button
          onClick={() => onSidebarItemClicked(chat._id)}
          className={classes.ListItem}>
          <UserItem 
              name={chat.name}
                lastMessage={recentMsg.content.message}
                date={recentMsg.sent_ts}/>
        </UserNotSelected>
            }
          })}
        </List>
      </UsersListItems>
    </UsersListWrapper>
  );
};

export default withStyles(styles)(UsersList);
