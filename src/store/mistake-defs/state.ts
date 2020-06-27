import { ShotCategory } from './types.d';

const puttCategory: ShotCategory = {
  id: 0,
  name: 'Putt',
};

const teeCategory: ShotCategory = {
  id: 1,
  name: 'Tee',
};

const state = {
  id: 2,
  mistakeDefs: new Array(0),
  shotCategories: [puttCategory, teeCategory],
  currentEditingTab: 'ShotTypes',
};

export default state;
