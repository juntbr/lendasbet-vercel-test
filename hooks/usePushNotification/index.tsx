import FirebaseCloudMessaging from "config/notifications/firebase";
import { AppContext } from "contexts/context";
import { useContext, useState } from "react";
import {
  linkUserDevice,
  unlinkUserDevice,
} from "config/notifications/fast-track-push-notifications";

export default function usePushNotification() {
  const { userId } = useContext(AppContext);
  const [mounted, setMounted] = useState(false);

  async function linkDevice(userId) {
    await FirebaseCloudMessaging.init();
    const token = await FirebaseCloudMessaging.tokenInLocalForage();
    await linkUserDevice(token, userId);
    if (token) {
      setMounted(true);
    }
  }

  async function unlinkDevice() {
    await FirebaseCloudMessaging.init();
    const token = await FirebaseCloudMessaging.tokenInLocalForage();
    if (!userId) return;
    await unlinkUserDevice(token, userId);
    if (token) {
      setMounted(true);
    }
  }

  if (mounted) {
    FirebaseCloudMessaging.onMessage();
  }

  return { linkDevice, unlinkDevice };
}
