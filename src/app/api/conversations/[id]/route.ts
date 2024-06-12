import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import axios from 'axios';

//@ts-ignore
export async function GET(request: NextRequest, {params}) {
    const id = params.id;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: Number(id) },
      include: { messages: true },
    });

    if (!conversation) {
      return NextResponse.json({ text: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ text: 'Error fetching conversation' }, { status: 500 });
  }
}
//@ts-ignore
export async function POST(request: NextRequest, {params}) {
    const id = params.id;
    const { prompt } = await request.json();

    console.info(prompt)
  
    if (!prompt) {
      return NextResponse.json({ text: 'Prompt is required' }, { status: 400 });
    }
  
    if (!/html|css|javascript/i.test(prompt)) {
      return NextResponse.json({ text: 'Le chatbot ne peut répondre qu’à des questions concernant le HTML, CSS, ou JavaScript.' }, { status: 400 });
    }
  
    try {
      const existingConversation = await prisma.conversation.findUnique({
        where: { id: Number(id) },
        include: { messages: true },
      });
      console.info(existingConversation)
  
      if (!existingConversation) {
        return NextResponse.json({ text: 'Conversation not found' }, { status: 404 });
      }
  
      const messages = [
        { role: 'system', content: 'You are a helpful assistant specialized in generating HTML, CSS, and JavaScript code.' },
        ...existingConversation.messages.map((message: any) => ({
          role: message.role,
          content: message.content
        })),
        { role: 'user', content: prompt }
      ];
  
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

      console.info(generatedText)
  
      await prisma.message.create({
        data: {
          content: prompt,
          role: 'user',
          conversationId: Number(id),
        },
      });
  
      await prisma.message.create({
        data: {
          content: generatedText,
          role: 'assistant',
          conversationId: Number(id),
        },
      });
  
      return NextResponse.json({ text: generatedText });
    } catch (error) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      console.error('Error generating text:', error.response?.data || error.message);
      return NextResponse.json({ text: 'Error generating text' }, { status: 500 });
    }
  }
