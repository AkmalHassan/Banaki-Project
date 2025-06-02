// import { NextResponse } from 'next/server';
// import { Answer, Session, sequelize } from '../../../lib/db.js';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const sessionId = searchParams.get('sessionId');

//   if (!sessionId) {
//     return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
//   }

//   try {
//     const answers = await Answer.findAll({
//       where: { sessionId },
//       attributes: ['questionKey', 'value'],
//     });

//     return NextResponse.json({ answers });
//   } catch (error) {
//     console.error('Failed to fetch answers:', error);
//     return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   const transaction = await sequelize.transaction();

//   try {
//     const { sessionId, answers } = await request.json();

//     // Create the session 
//     let session = await Session.findByPk(sessionId);
//     if (!session) {
//       session = await Session.create({ id: sessionId }, { transaction });
//     }

//     const answerEntries = Object.entries(answers).map(([questionKey, value]) => ({
//       sessionId: session.get('id'),
//       questionKey,
//       value: Array.isArray(value) ? JSON.stringify(value) : String(value)
//     }));

//     for (const entry of answerEntries) {
//       await Answer.create(entry, { transaction });
//     }

//     await transaction.commit();
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Failed to save responses:', error);
//     return NextResponse.json(
//       { error: 'Failed to save responses' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Answer } from '@/lib/models/Answer';
import { Session } from '@/lib/models/Session';

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });

  try {
    const answers = await Answer.find({ sessionId }).lean();
    return NextResponse.json({ answers });
  } catch (error) {
    console.error('Failed to fetch answers:', error);
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const { sessionId, answers } = await request.json();

    const existingSession = await Session.findById(sessionId);
    if (!existingSession) {
      await Session.create({ _id: sessionId });
    }

    const entries = Object.entries(answers).map(([questionKey, value]) => ({
      sessionId,
      questionKey,
      value: Array.isArray(value) ? JSON.stringify(value) : String(value)
    }));

    await Answer.insertMany(entries);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save responses:', error);
    return NextResponse.json({ error: 'Failed to save responses' }, { status: 500 });
  }
}
