'use client';

import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Divider, ListItemButton, Skeleton } from '@mui/material';
import Link from 'next/link';

import axios from 'axios';
import { Conversation } from '@prisma/client';

const Sidebar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/conversations');
      setConversations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <nav style={{ width: 'clamp(150px, 40%, 300px)' }}>
      <List>
        {loading ? (
          Array.from(new Array(5)).map((_, index) => (
            <ListItem key={index}>
              <Skeleton variant="rectangular" width="100%" height={40} />
            </ListItem>
          ))
        ) : (
          conversations.map((conv) => (
            <Link key={conv.id} href={`/conv/${conv.id}`} passHref>
              <ListItemButton>
                <ListItemText primary={conv.title || `Conversation ${conv.id}`} />
              </ListItemButton>
            </Link>
          ))
        )}
      </List>
      <Divider />
      <Link href="/" passHref>
        <ListItemButton>
          <ListItemText primary="New Conversation" />
        </ListItemButton>
      </Link>
    </nav>
  );
};

export default Sidebar;
