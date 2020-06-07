import actions from './actions';
import state from './state';
import mutations from './mutations';
import getters from './getters';

const mistakeTypes = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default mistakeTypes;
