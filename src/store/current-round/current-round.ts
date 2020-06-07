import mutations from './mutations';
import getters from './getters';
import state from './state';

const currentRound = {
  namespaced: true,
  mutations,
  getters,
  state,
};

export default currentRound;
