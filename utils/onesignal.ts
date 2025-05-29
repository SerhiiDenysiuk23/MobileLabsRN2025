import Constants from "expo-constants";
import {LogLevel, NotificationWillDisplayEvent, OneSignal} from "react-native-onesignal";

const oneSignalAppId = Constants?.expoConfig?.extra?.oneSignalId
const oneSignalAuthToken = Constants?.expoConfig?.extra?.oneSignalAuthToken

const baseHeaders = {
  'Accept': 'application/json',
  'Authorization': `Basic ${oneSignalAuthToken}`,
  'Content-Type': 'application/json'
}

if (!oneSignalAppId || !oneSignalAuthToken) {
  throw new Error('OneSignal credentials not found');
}

export const send = async (title: string, description: string, time: Date) => {
  const result = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({
      app_id: oneSignalAppId,
      contents: {
        en: `${title}\n${description}`
      },
      included_segments: ['All'],
      send_after: time
    })
  })
  return result.json()
};

export const cancel = async (id: string) => {
  const result = await fetch(`https://api.onesignal.com/notifications/${id}?app_id=${oneSignalAppId}`, {
    method: 'DELETE',
    headers: baseHeaders,
  })
  return result.json()
};

const handleForegroundWillDisplay = (event: NotificationWillDisplayEvent) => {
  event.preventDefault()
  event.notification.display()
}

export function init() {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(oneSignalAppId);
  void OneSignal.Notifications.requestPermission(true);

  OneSignal.Notifications.addEventListener('foregroundWillDisplay', handleForegroundWillDisplay)
  return () => {
    OneSignal.Notifications.removeEventListener('foregroundWillDisplay', handleForegroundWillDisplay)
  }
}