#!/bin/sh
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

mv my-release-key.keystore android/app/

cd android && ./gradlew assembleRelease
