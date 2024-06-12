import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  console.info(prompt)

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ text: 'Missing API key' }, { status: 500 });
  }

  if (!prompt) {
    return NextResponse.json({ text: 'Prompt is required' }, { status: 400 });
  }

  if (!/html|css|javascript/i.test(prompt)) {
    return NextResponse.json({ text: 'Le chatbot ne peut répondre qu’à des questions concernant le HTML, CSS, ou JavaScript.' }, { status: 400 });
  }

  const messages = [
    { role: 'system', content: 'You are a helpful assistant specialized in generating HTML, CSS, and JavaScript code.' },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 2048,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const generatedText = response.data.choices[0].message.content;

    const conversation = await prisma.conversation.create({
      data: {
        title: prompt.slice(0, 30),
        messages: {
          create: [
            { content: prompt, role: 'user' },
            { content: generatedText, role: 'assistant' },
          ],
        },
      },
      include: { messages: true },
    });

    return NextResponse.json({ text: generatedText, conversationId: conversation.id });
  } catch (error) {
    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    console.error('Error generating text:', error.response?.data || error.message);
    return NextResponse.json({ text: 'Error generating text' }, { status: 500 });
  }
}
