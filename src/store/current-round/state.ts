import { Hole } from './types.d';

const state = {
  course: '',
  date: '',
  holes: [] as Array<Hole>,
  inProgress: false,
  isAddingShot: false,
  currentHole: 1,
};

export default state;
