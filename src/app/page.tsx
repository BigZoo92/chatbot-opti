'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Conversation {
  id: number;
  prompt: string;
  response: string;
  createdAt: string; // Assure-toi que le type correspond au format de date/heure retourné par l'API
}

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/conversations');
      setConversations(res.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching conversations');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/chatgpt', { prompt });
      setResponse(res.data.text);
      fetchConversations(); // Fetch updated conversations
    } catch (error) {
      console.error(error);
      setError('Error generating code');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Code Generator Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          cols={50}
          placeholder="Enter your prompt here"
        />
        <br />
        <button type="submit">Generate Code</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Generated Code:</h2>
        <pre>{response}</pre>
      </div>
      <div>
        <h2>Previous Conversations:</h2>
        {conversations.map((conv) => (
          <div key={conv.id}>
            <p><strong>Prompt:</strong> {conv.prompt}</p>
            <p><strong>Response:</strong> {conv.response}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
