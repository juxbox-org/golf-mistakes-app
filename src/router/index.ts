import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import ViewRounds from '@/views/ViewRounds.vue';
import store from '@/store/index';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/review',
    name: 'ViewRounds',
    component: ViewRounds,
  },
  {
    path: '/track',
    name: 'TrackRound',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "track" */ '@/views/TrackRound.vue'),
    beforeEnter: (to, from, next) => {
      const currRoundState = store.state.currentRound;
      if (currRoundState.inProgress) {
        next({ path: `/track/hole/${currRoundState.currentHole}` });
      } else {
        next();
      }
    },
  },
  {
    path: '/track/hole/:hole_no',
    component: () => import(/* webpackChunkName: "currentround" */ '@/views/screens/track-round/CurrentRound.vue'),
    beforeEnter: (to, from, next) => {
      const currRoundState = store.state.currentRound;
      if (!currRoundState.inProgress) {
        next({ path: '/track' });
      } else {
        next();
      }
    },
  },
  {
    path: '/summary',
    name: 'Summary',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "summary" */ '@/views/Summary.vue'),
  },
  {
    path: '/',
    redirect: '/review',
  },
];

const router = new VueRouter({
  routes,
});

export default router;
