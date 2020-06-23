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
  rating?: number;
  slope?: number;
  tees?: string;
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

export interface ShotInfo {
  shotIndex: number;
  category: string;
  mistake: boolean;
  penalty: boolean;
  shotType: ShotType;
  result?: number;
  club?: number;
  distance?: number;
  swing?: number;
}

export interface ClubData {
  shotId: number;
  club?: number;
  distance?: number;
  swing?: number;
}

export interface ShotType {
  title: string;
  desc: string;
}

export interface ResultData {
  shotId: number;
  result: number;
}

export interface ScoringSummary {
  gir: number;
  par: number;
  birdie: number;
  eagle: number;
  bogey: number;
  double: number;
  triple: number;
}
