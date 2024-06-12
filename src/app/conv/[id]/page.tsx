'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Paper, Skeleton, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Conversation } from '@prisma/client';

const ConversationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchConversation = async () => {
    try {
      const res = await axios.get(`/api/conversations/${id}?id=${id}`);
      setConversation(res.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching conversation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConversation();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/html|css|javascript/i.test(prompt)) {
      setError('Le chatbot ne peut répondre qu’à des questions concernant le HTML, CSS, ou JavaScript.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`/api/conversations/${id}?id=${id}`, { prompt });
      setPrompt('');
      const newConversationId = res.data.conversationId;
      fetchConversation();
      router.push(`/conv/${newConversationId}`);
    } catch (error) {
      console.error(error);
      setError('Error generating code');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', pb: 8, height: 'calc(100dvh - 60px)', overflowY: 'auto', overflowX: 'hidden', width: 'calc(100dvw - clamp(150px, 40%, 300px))' }}>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <Box sx={{ mt: 3 }}>
          {Array.from(new Array(3)).map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="100%" height={80} sx={{ mb: 2 }} />
          ))}
        </Box>
      ) : (
        conversation && (
          <Box sx={{ mt: 3, flexGrow: 1, overflow: 'auto' }}>
            {/* @ts-ignore */}
            {conversation?.messages.map((msg: any) => (
              <Paper
                key={msg.id}
                /* @ts-ignore */
                sx={{
                  mb: 2,
                  p: 2,
                  maxWidth: msg.role === 'user' ? '60%' : '100%',
                  minWidth: '300px',
                  marginLeft: msg.role === 'user' ? '40%' : '0',
                  backgroundColor: msg.role === 'user' && '#3a3a3a',
                  color: msg.role === 'user' && theme.palette.getContrastText('#3a3a3a'),
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  {msg.role}:
                </Typography>
                <ReactMarkdown
                  components={{
                    code({
                      node,
                      inline,
                      className,
                      children,
                      ...props
                    }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </Paper>
            ))}
            <div ref={bottomRef} />
          </Box>
        )
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 'calc(100% - clamp(150px, 40%, 300px))',
          display: 'flex',
          alignItems: 'center',
          p: 1,
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="prompt"
          label="Enter your prompt here"
          name="prompt"
          autoFocus
          value={prompt}
          onChange={(e: any) => setPrompt(e.target.value)}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>
    </Container>
  );
};

export default ConversationPage;
