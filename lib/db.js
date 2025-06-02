import { Sequelize, DataTypes } from 'sequelize';
import mysql2 from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file

// Verify environment variables
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false
});

// Question Model
export const Question = sequelize.define('Question', {
  key: { type: DataTypes.STRING, unique: true },
  text: DataTypes.TEXT,
  type: DataTypes.ENUM(
    'multiple_choice', 
    'text', 
    'date', 
    'multiple_select'
  ),
  order_index: DataTypes.INTEGER
});

// Define QuestionOption model
export const QuestionOption = sequelize.define('QuestionOption', {
  value: DataTypes.STRING,
  text: DataTypes.STRING
});

// Define Session model
const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
});

// Define Answer model
export const Answer = sequelize.define('Answer', {
  questionKey: DataTypes.STRING,
  value: DataTypes.TEXT
});


// Define relationships
Question.hasMany(QuestionOption, {
  as: 'QuestionOptions',
  foreignKey: 'questionId',
  onDelete: 'CASCADE'
});

QuestionOption.belongsTo(Question, {
  foreignKey: 'questionId'
});


Session.hasMany(Answer, {
  foreignKey: 'sessionId'
});
Answer.belongsTo(Session, {
  foreignKey: 'sessionId'
});

export { sequelize, Session };
