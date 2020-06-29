import {
  ShotCategory,
  MistakeDef,
  MistakeDetails,
} from './types.d';

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
  mistakeDefs: [] as Array<MistakeDef>,
  mistakeDetails: [] as Array<MistakeDetails>,
  shotCategories: [puttCategory, teeCategory],
  currentEditingTab: 'ShotTypes',
};

export default state;
