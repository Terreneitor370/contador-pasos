# Contador de Pasos

Aplicación móvil hecha con Expo/React Native que cuenta pasos en tiempo real usando el acelerómetro del dispositivo, y estima distancia recorrida, ritmo (pasos/min) y si el usuario está caminando o corriendo.

## Requisitos previos

- [Node.js](https://nodejs.org/) 22.13 o superior
- npm (se instala junto con Node.js)
- La app **Expo Go** instalada en tu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)), **o** Android Studio / Xcode si prefieres usar un emulador
- Un dispositivo físico es lo recomendado: el conteo de pasos depende del acelerómetro real, que los emuladores y la versión web no simulan de forma confiable

## Instalación

```bash
git clone https://github.com/Terreneitor370/contador-pasos.git
cd contador-pasos
npm install
```

## Ejecución

Inicia el servidor de desarrollo:

```bash
npm start
```

Esto abre Expo CLI con un código QR:

- **Celular físico**: abre la app Expo Go y escanea el código QR (Android) o usa la cámara nativa (iOS). El celular y la computadora deben estar en la **misma red Wi-Fi**.
- **Emulador Android**: con el servidor corriendo, ejecuta `npm run android` (requiere Android Studio configurado).
- **Simulador iOS**: con el servidor corriendo, ejecuta `npm run ios` (requiere macOS + Xcode).
- **Navegador**: `npm run web` (el conteo de pasos no funcionará sin un acelerómetro real).

## Solución de problemas

**"Cannot connect to Expo CLI" / no conecta con el servidor de desarrollo:**

- Verifica que `npm start` siga corriendo en la computadora.
- Confirma que el celular y la computadora estén en la misma red Wi-Fi (no una red de invitados que aísle dispositivos).
- Si usas un dispositivo Android por USB, ejecuta `adb reverse tcp:8081 tcp:8081`.
- Revisa que el firewall de Windows no esté bloqueando el puerto 8081 para Node.js.

**El acelerómetro no está disponible:**

- Algunos emuladores no exponen sensores de movimiento; prueba en un dispositivo físico.

## Estructura del proyecto

```
App.tsx                      # Punto de entrada de la UI
src/
  screens/
    HomeScreen.tsx           # Pantalla principal (UI del contador)
  hooks/
    useFitnessSensor.ts      # Lógica de detección de pasos con el acelerómetro
```
