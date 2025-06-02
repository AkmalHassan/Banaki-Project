import { sequelize } from '../lib/db.js';
import { Question, QuestionOption } from '../lib/db.js';
import 'dotenv/config';

async function seed() {
  try {
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    
    // Clear existing data and recreate tables
    await sequelize.sync({ force: true });
    
    // Create questions in order
    const questions = [
      // Question 1: Travel Style
      {
        key: 'travel_style',
        text: 'How do you like to camp?',
        type: 'multiple_choice',
        order_index: 1,
        options: [
          { value: 'glamper', text: 'Glamper (Comfort first!)' },
          { value: 'adventurer', text: 'Adventurer (Challenges)' },
          { value: 'balanced', text: 'Balanced Mix' }
        ]
      },
      // Question 2: Accommodation
      {
        key: 'accommodation',
        text: "What’s your setup?",
        type: 'multiple_choice',
        order_index: 2,
        options: [
          { value: 'tent', text: 'Tent' },
          { value: 'rv', text: 'RV/Camper Van' },
          { value: 'not_sure', text: 'Not Sure' }
        ]
      },
      // Question 3: Group Type
      {
        key: 'group_type',
        text: 'Who is Joining?',
        type: 'multiple_choice',
        order_index: 3,
        options: [
          { value: 'family', text: 'Family' },
          { value: 'friends', text: 'Friends' },
          { value: 'solo', text: 'Solo' },
          { value: 'couple', text: 'Couple' }
        ]
      },
      // Question 4: Activity Priority (Conditional)
      {
        key: 'activity_priority',
        text: 'What is your group vibe?',
        type: 'multiple_choice',
        order_index: 4,
        options: [
          { value: 'fishing_hiking', text: 'Fishing/Hiking' },
          { value: 'campfire_stories', text: 'Campfire Stories' },
          { value: 'scenic_photos', text: 'Scenic Photos' }
        ]
      },
      // Question 5: Challenge Level (Conditional)
      {
        key: 'challenge_level',
        text: 'How adventurous are you?',
        type: 'multiple_choice',
        order_index: 5,
        options: [
          { value: 'beginner', text: 'Beginner' },
          { value: 'intermediate', text: 'Intermediate' },
          { value: 'expert', text: 'Expert' }
        ]
      },
      // Question 6: Hookup Needs (Conditional)
      {
        key: 'hookup_needs',
        text: 'What utilities do you need?',
        type: 'multiple_choice',
        order_index: 6,
        options: [
          { value: 'full_hookup', text: 'Full hookup' },
          { value: 'electricity', text: 'Electricity only' },
          { value: 'boondocking', text: 'Boondocking' }
        ]
      },
      // Question 7: Shelter Priority (Conditional)
      {
        key: 'shelter_priority',
        text: 'What’s non-negotiable?',
        type: 'multiple_choice',
        order_index: 7,
        options: [
          { value: 'weatherproof', text: 'Weatherproof' },
          { value: 'firepit', text: 'Firepit' },
          { value: 'flat_ground', text: 'Flat Ground' }
        ]
      },
      // Question 8: Preferred Month
      {
        key: 'preferred_month',
        text: 'When are you going?',
        type: 'date',
        order_index: 8,
        options: []
      },
      // Question 9: Location Suggestion
      {
        key: 'location_suggestion',
        text: 'Any place in your mind?',
        type: 'text',
        order_index: 9,
        options: []
      },
      // Question 10: Dealbreakers
      {
        key: 'dealbreakers',
        text: 'Any must haves and no-gos?',
        type: 'multiple_select',
        order_index: 10,
        options: [
          { value: 'no_beer', text: 'No beer' },
          { value: 'restrooms', text: 'Restrooms' },
          { value: 'rainproof', text: 'Rainproof shelter' }
        ]
      }
    ];

    // Create questions and options
   for (const q of questions) {
      console.log(`Creating question: ${q.key}`);
      const question = await Question.create({
        key: q.key,
        text: q.text,
        type: q.type,
        order_index: q.order_index
      });
      
      if (q.options && q.options.length > 0) {
        console.log(`Creating ${q.options.length} options for question: ${q.key}`);
        
        // Create options one by one to ensure foreign key relationship
        for (const option of q.options) {
          await QuestionOption.create({
            questionId: question.id, // Ensure foreign key is set
            value: option.value,
            text: option.text
          });
        }
      }
    }

    console.log('Database seeded successfully with questions and options');
    
    // Verify data
    const allQuestions = await Question.findAll({
      include: [{ model: QuestionOption, as: 'QuestionOptions' }]
    });
    
    console.log('Verifying data:');
    allQuestions.forEach(q => {
      console.log(`- Question: ${q.text} (ID: ${q.id})`);
      console.log(`  Options: ${q.QuestionOptions.length}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}


seed();

