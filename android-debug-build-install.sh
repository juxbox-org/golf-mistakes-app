#!/bin/bash

npm run cordova-build-only-www-android
cd src-cordova
cordova build android --debug
cd platforms/android/app/build/outputs/apk/debug
adb install app-debug.apk
