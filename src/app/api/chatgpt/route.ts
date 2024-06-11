import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching conversations:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error fetching conversations:', error);
    }
    return NextResponse.json({ text: 'Error fetching conversations' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  console.log('API Key:', process.env.OPENAI_API_KEY);
  
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ text: 'Missing API key' }, { status: 500 });
  }

  if (!prompt) {
    return NextResponse.json({ text: 'Prompt is required' }, { status: 400 });
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

    await prisma.conversation.create({
      data: {
        prompt,
        response: generatedText,
      },
    });

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error generating text:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error generating text:', error);
    }
    return NextResponse.json({ text: 'Error generating text' }, { status: 500 });
  }
}
