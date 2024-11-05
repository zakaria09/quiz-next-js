import {v4 as uuidv4} from 'uuid';

export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();

export const defaultChoiceFields = [
  {id: uuidv4(), choice: '', isCorrect: false},
  {id: uuidv4(), choice: '', isCorrect: false},
];
