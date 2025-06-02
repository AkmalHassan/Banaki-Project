export function getNextQuestionKey(
  currentKey: string | null, 
  answers: Record<string, unknown>
): string | null {
  const questionFlow: Record<string, string | null> = {
    'travel_style': 'accommodation',
    'accommodation': 'group_type',
    'group_type': null,
    'activity_priority': 'preferred_month',
    'challenge_level': 'preferred_month',
    'hookup_needs': 'preferred_month',
    'shelter_priority': 'preferred_month',
    'preferred_month': 'location_suggestion',
    'location_suggestion': 'dealbreakers',
    'dealbreakers': null
  };

  if (!currentKey) return 'travel_style';
  
  // Handle conditional questions
  if (currentKey === 'group_type') {
    if (['family', 'friends'].includes(String(answers['group_type']))) {
      return 'activity_priority';
    } else if (['solo', 'couple'].includes(String(answers['group_type']))) {
      return 'challenge_level';
    }
  }
  
  if (currentKey === 'accommodation') {
    if (answers['accommodation'] === 'rv') {
      return 'hookup_needs';
    } else if (answers['accommodation'] === 'tent') {
      return 'shelter_priority';
    }
  }
  
  return questionFlow[currentKey] || null;
}