import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        messages: true
      },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ text: 'Error fetching conversations' }, { status: 500 });
  }
}
