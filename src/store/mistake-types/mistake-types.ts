import actions from './actions';
import state from './state';
import mutations from './mutations';

const mistakeTypes = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default mistakeTypes;
