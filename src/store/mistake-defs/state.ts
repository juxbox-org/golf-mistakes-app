import { ShotCategory } from './types.d';

const puttCategory: ShotCategory = {
  id: 0,
  name: 'Putt',
};

const state = {
  mistakeDefs: new Array(0),
  shotCategories: [puttCategory],
};

export default state;
