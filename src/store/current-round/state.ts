import { RoundHole } from '@/store/rounds/types.d';

const state = {
  course: '',
  date: '',
  holes: [] as Array<RoundHole>,
  inProgress: false,
  isAddingShot: false,
  isEditingHole: false,
  currentHole: 1,
};

export default state;
