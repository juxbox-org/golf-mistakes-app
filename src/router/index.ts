import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import ViewRounds from '@/views/ViewRounds.vue';

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
