# Android release signing

Do not commit real keystores, passwords, or `android/keystore.properties`.

## Current Gradle setup

- Android module: `android/app`.
- Package: `ru.nightvex.messenger`.
- Release signing reads `android/keystore.properties`.
- If `android/keystore.properties` is missing, Gradle can build `app-release-unsigned.apk`.
- Real signing files are ignored by `.gitignore`: `*.jks`, `*.keystore`, `keystore.properties`, `*.pem`, `*.key`.

## Create a local release keystore

Run in Windows PowerShell:

```powershell
cd "C:\Users\Dmitriy\OneDrive\Desktop\Messengers_project 1.0\android"
keytool -genkeypair `
  -v `
  -keystore "$env:USERPROFILE\nightvex-release.jks" `
  -storetype JKS `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000 `
  -alias nightvex
```

Keep this file outside the repository or inside an ignored local-only folder.

## Configure signing

Copy the example:

```powershell
Copy-Item android\keystore.properties.example android\keystore.properties
```

Edit `android\keystore.properties`:

```properties
storeFile=C:/Users/<you>/nightvex-release.jks
storePassword=<local-password>
keyAlias=nightvex
keyPassword=<local-password>
```

## Build commands

Debug APK:

```powershell
cd "C:\Users\Dmitriy\OneDrive\Desktop\Messengers_project 1.0\android"
.\gradlew.bat :app:assembleDebug
```

Signed release APK, after adding local keystore:

```powershell
.\gradlew.bat :app:assembleRelease
```

Release AAB:

```powershell
.\gradlew.bat :app:bundleRelease
```

Outputs:

- `android/app/build/outputs/apk/debug/app-debug.apk`
- `android/app/build/outputs/apk/release/app-release.apk` or `app-release-unsigned.apk`
- `android/app/build/outputs/bundle/release/app-release.aab`

## SHA256 fingerprints

Debug certificate:

```powershell
keytool -list -v `
  -alias androiddebugkey `
  -keystore "$env:USERPROFILE\.android\debug.keystore" `
  -storepass android `
  -keypass android
```

Release certificate:

```powershell
keytool -list -v `
  -alias nightvex `
  -keystore "$env:USERPROFILE\nightvex-release.jks"
```

Copy only the SHA256 fingerprint into production `assetlinks.json`. Do not commit passwords or keystore files.
