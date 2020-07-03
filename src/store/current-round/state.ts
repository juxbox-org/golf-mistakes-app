import { RoundHole } from '@/store/rounds/types.d';
import { CurrentRoundState } from './types.d';

const state = {
  course: '',
  date: '',
  rating: null,
  slope: null,
  tees: '',
  holes: [] as Array<RoundHole>,
  inProgress: false,
  isAddingShot: false,
  isEditingHole: false,
  currentHole: 1,
  isSaving: false,
} as CurrentRoundState;

export default state;
