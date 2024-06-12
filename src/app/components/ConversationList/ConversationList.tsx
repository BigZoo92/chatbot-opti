'use client';

import React from 'react';
import { List, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';
import Link from 'next/link';
import { Conversation } from '@prisma/client';

const ConversationList = ({ conversations }: {conversations: Conversation[]}) => {
  return (
    <List>
      {conversations.map((conv) => (
        <Link key={conv.id} href={`/conv/${conv.id}`} passHref>
          <ListItemButton>
            <ListItemText primary={conv.title || `Conversation ${conv.id}`} />
          </ListItemButton>
        </Link>
      ))}
      <Divider />
    </List>
  );
};

export default ConversationList;
