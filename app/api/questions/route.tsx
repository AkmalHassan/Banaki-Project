// import { NextResponse } from 'next/server';
// import { Question, QuestionOption } from '../../../lib/db.js';

// export async function GET() {
//   try {
//     const questions = await Question.findAll({
//       order: [['order_index', 'ASC']],
//       include: [{
//         model: QuestionOption,
//         as: 'QuestionOptions'
//       }]
//     });
    
//     // Log the first question to verify options
//     if (questions.length > 0) {
//       const firstQuestion = questions[0].toJSON();
//       console.log('First question options:', firstQuestion.QuestionOptions);
//     }
    
//     return NextResponse.json(questions);
//   } catch (error) {
//     console.error('Failed to fetch questions:', error);
//     return NextResponse.json(
//       { error: "Failed to fetch questions" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Question } from '@/lib/models/Question';

export async function GET() {
  await connectToDatabase();
  try {
    const questions = await Question.find({}).sort({ order_index: 1 }).lean();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
