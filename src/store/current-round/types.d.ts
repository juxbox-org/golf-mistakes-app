import { Round } from '@/store/rounds/types.d';

export interface CurrentRoundState extends Round {
  currentHole: number;
  inProgress: boolean;
  isAddingShot: boolean;
  isEditingHole: boolean;
}

export interface CurrentRoundRecord {
  course: string;
  date: string;
}

export interface CourseDetails {
  course: string;
  date: string;
  rating?: number;
  slope?: number;
  tees?: string;
}

export interface RoundDetails {
  shots: number;
  mistakes: number;
  penalties: number;
  score: number;
  holesPlayed: number;
  putts: number;
}
