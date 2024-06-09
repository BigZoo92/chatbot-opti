// app/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/chatgpt', { prompt });
      setResponse(res.data.text);
    } catch (error) {
      console.error(error);
      setResponse('Error generating code');
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
      <div>
        <h2>Generated Code:</h2>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default Home;
