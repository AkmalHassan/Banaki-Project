'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getNextQuestionKey } from '../../lib/questionFlow';

type QuestionType = {
  id: number;
  key: string;
  text: string;
  type: string;
  order_index: number;
  QuestionOptions: {
    id: number;
    value: string;
    text: string;
  }[];
};

type AnswerValue = string | string[]; // or extend as needed for other types

export default function QuestionFlow() {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [sessionId] = useState(uuidv4());
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentValue, setCurrentValue] = useState<AnswerValue>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Fetch all questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/questions');
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data);
        setCurrentQuestion(data.find((q: QuestionType) => q.key === 'travel_style') || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Update progress
  useEffect(() => {
    if (questions.length > 0 && currentQuestion) {
      const answeredCount = Object.keys(answers).length;
      const totalVisible = getVisibleQuestions(answers, questions).length;
      setProgress(Math.round((answeredCount / totalVisible) * 100));
    }
  }, [answers, currentQuestion, questions]);


  const handleSubmit = async (value?: AnswerValue) => {
    const finalValue = value !== undefined ? value : currentValue;
    
    if (!currentQuestion || 
        (Array.isArray(finalValue) && finalValue.length === 0) ||
        (!Array.isArray(finalValue) && !finalValue)) {
      return;
    }

    // Update answers
    const newAnswers = {
      ...answers,
      [currentQuestion.key]: finalValue
    };
    setAnswers(newAnswers);
    setCurrentValue('');

    // Get next question
    const nextKey = getNextQuestionKey(currentQuestion.key, newAnswers);
    
    if (nextKey) {
      const nextQuestion = questions.find(q => q.key === nextKey);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      } else {
        setError(`Question not found: ${nextKey}`);
      }
    } else {
      // Submit all answers at the end
      try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answers: newAnswers })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Submission failed');
      }
      
      // Redirect to results page with sessionId
      window.location.href = `/results?sessionId=${sessionId}`;
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Submission error');
    }
  }
};

   useEffect(() => {
    if (currentQuestion) {
      console.log('Current Question:', currentQuestion);
      console.log('Question Options:', currentQuestion.QuestionOptions);
    }
  }, [currentQuestion]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {currentQuestion?.text}
        </h2>
        
        {currentQuestion?.type === 'multiple_choice' && (
          <div className="space-y-3">
            {currentQuestion.QuestionOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleSubmit(option.value)}
                className={`w-full p-3 text-left rounded-lg transition-all
                           bg-gray-50 hover:bg-blue-50 border border-gray-200
                           hover:border-blue-300 text-gray-700 hover:text-blue-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           ${answers[currentQuestion.key] === option.value ? 
                             'bg-blue-100 border-blue-500' : ''}`}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}

        {currentQuestion?.type === 'multiple_select' && (
          <div className="space-y-3">
            {currentQuestion.QuestionOptions.map(option => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${currentQuestion.id}-${option.id}`}
                  checked={Array.isArray(currentValue) && currentValue.includes(option.value)}
                  onChange={() => {
                    const newValue = Array.isArray(currentValue) 
                      ? currentValue.includes(option.value)
                        ? currentValue.filter(v => v !== option.value)
                        : [...currentValue, option.value]
                      : [option.value];
                    setCurrentValue(newValue);
                  }}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <label 
                  htmlFor={`${currentQuestion.id}-${option.id}`} 
                  className="ml-2 text-gray-700"
                >
                  {option.text}
                </label>
              </div>
            ))}
            <button
              onClick={() => handleSubmit()}
              disabled={!Array.isArray(currentValue) || currentValue.length === 0}
              className="mt-4 w-full p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Continue
            </button>
          </div>
        )}

        {currentQuestion?.type === 'text' && (
          <div className="space-y-3">
            <textarea
              value={typeof currentValue === 'string' ? currentValue : ''}
              onChange={e => setCurrentValue(e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Type your answer here..."
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!currentValue}
              className="mt-2 w-full p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Continue
            </button>
          </div>
        )}

        {currentQuestion?.type === 'date' && (
          <div className="space-y-3">
            <input
              type="date"
              value={typeof currentValue === 'string' ? currentValue : ''}
              onChange={e => setCurrentValue(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!currentValue}
              className="mt-2 w-full p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to calculate visible questions
function getVisibleQuestions(answers: Record<string, AnswerValue>, allQuestions: QuestionType[]): string[] {
  const visible: string[] = [];
  
  for (const question of allQuestions) {
    if (question.key === 'activity_priority') {
      if (['family', 'friends'].includes(String(answers['group_type']))) {
        visible.push(question.key);
      }
    } 
    else if (question.key === 'challenge_level') {
      if (['solo', 'couple'].includes(String(answers['group_type']))) {
        visible.push(question.key);
      }
    }
    else if (question.key === 'hookup_needs') {
      if (answers['accommodation'] === 'rv') {
        visible.push(question.key);
      }
    }
    else if (question.key === 'shelter_priority') {
      if (answers['accommodation'] === 'tent') {
        visible.push(question.key);
      }
    }
    else {
      visible.push(question.key);
    }
  }
  
  return visible;
}