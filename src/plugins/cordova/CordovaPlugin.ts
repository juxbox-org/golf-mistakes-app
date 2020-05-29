/* eslint-disable */
import _Vue from 'vue';

/*
 * Add the Cordova property to Vue class here
 * instead of in it's own d.ts file to avoid
 * having to use typeRoots in tsconfig.json
 */
declare module 'vue/types/vue' {
  interface Vue {
    $cordova: any;
    $sqlite: any;
  }
}

declare global {
  interface Window {
    cordova: any;
    sqlitePlugin: any;
  }
}

export default function CordovaPlugin(Vue: typeof _Vue): void {
  document.addEventListener('deviceready', () => {
    Vue.prototype.$cordova = window.cordova;

    if (window.cordova.platformId !== 'browser' && window.sqlitePlugin) {
      window.sqlitePlugin.selfTest(() => {
        Vue.prototype.$sqlite = window.sqlitePlugin;
      }, () => {
        console.error('Current platform doesn\'t support SQLite plugin');
        Vue.prototype.$sqlite = null;
      });
    } else {
      console.warn('Current platform doesn\'t support SQLite plugin');
      Vue.prototype.$sqlite = null;
    }
  });
}
