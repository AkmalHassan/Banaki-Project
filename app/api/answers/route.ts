import { NextResponse } from 'next/server';
import { Answer } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const answers = await Answer.findAll({
      where: { sessionId },
      attributes: ['questionKey', 'value']
    });
    
    return NextResponse.json(answers);
  } catch (error) {
    console.error('Failed to fetch answers:', error);
    return NextResponse.json(
      { error: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}