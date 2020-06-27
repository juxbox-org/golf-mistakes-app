import Vue from 'vue';
import VueTouchEvents from 'vue2-touch-events';

Vue.use(VueTouchEvents, {
  touchHoldTolerance: 750,
  swipeTolerance: 100,
});
