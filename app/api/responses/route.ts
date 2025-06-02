import { NextResponse } from 'next/server';
import { Answer, Session, sequelize } from '../../../lib/db.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  try {
    const answers = await Answer.findAll({
      where: { sessionId },
      attributes: ['questionKey', 'value'],
    });

    return NextResponse.json({ answers });
  } catch (error) {
    console.error('Failed to fetch answers:', error);
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const transaction = await sequelize.transaction();

  try {
    const { sessionId, answers } = await request.json();

    // Create the session 
    let session = await Session.findByPk(sessionId);
    if (!session) {
      session = await Session.create({ id: sessionId }, { transaction });
    }

    const answerEntries = Object.entries(answers).map(([questionKey, value]) => ({
      sessionId: session.get('id'),
      questionKey,
      value: Array.isArray(value) ? JSON.stringify(value) : String(value)
    }));

    for (const entry of answerEntries) {
      await Answer.create(entry, { transaction });
    }

    await transaction.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to save responses:', error);
    return NextResponse.json(
      { error: 'Failed to save responses' },
      { status: 500 }
    );
  }
}

