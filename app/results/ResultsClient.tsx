'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AnswerData {
  questionKey: string;
  value: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [answers, setAnswers] = useState<AnswerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!sessionId) {
        setError('Session ID is missing');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/answers?sessionId=${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch answers');

        const data = await res.json();
        setAnswers(data || []);
      } catch (err) {
        setError('Failed to fetch answers');
        console.error('Error fetching answers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [sessionId]);

  if (loading) return <div className="text-center p-8">Loading your results...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <div className="bg-green-500 text-white p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Questionnaire Completed!
        </h1>
        <p className="text-gray-600">
          Your camping adventure is just beginning
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Special Offer Unlocked!
          </h2>
          <p className="text-blue-700">
            You earned 5% off your next camping trip! Use code:
            <span className="font-bold ml-2">CAMP5</span>
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Answers:</h2>

        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-gray-700 capitalize">
                {formatQuestionKey(answer.questionKey)}
              </h3>
              <p className="text-gray-900 mt-1">
                {formatAnswerValue(answer.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2">Next Steps</h3>
          <p className="mb-4">Get personalized camping recommendations</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">
            View Recommendations
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-2">Share Your Results</h3>
          <p className="mb-4">Compare with friends and family</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium">
            Share on Social Media
          </button>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Start New Questionnaire
        </button>
      </div>
    </div>
  );
}

function formatQuestionKey(key: string): string {
  const replacements: Record<string, string> = {
    'travel_style': 'Travel Style',
    'accommodation': 'Accommodation Type',
    'group_type': 'Group Type',
    'activity_priority': 'Activity Priority',
    'challenge_level': 'Challenge Level',
    'hookup_needs': 'Hookup Needs',
    'shelter_priority': 'Shelter Priority',
    'preferred_month': 'Preferred Month',
    'location_suggestion': 'Location Suggestion',
    'dealbreakers': 'Dealbreakers'
  };

  return replacements[key] || key.replace(/_/g, ' ');
}

function formatAnswerValue(value: string): string {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(v => v.replace(/_/g, ' ')).join(', ');
    }
    return parsed.replace(/_/g, ' ');
  } catch {
    return value.replace(/_/g, ' ');
  }
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
