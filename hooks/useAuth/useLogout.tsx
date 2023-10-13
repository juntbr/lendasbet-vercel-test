import { useContext } from "react";
import { useRouter } from "next/router";
import * as Sentry from "@sentry/browser";

import { AppContext } from "contexts/context";

import { useSession } from "../useSession";
import { doToast } from "utils/toastOptions";
import usePushNotification from "../usePushNotification";

export function useLogout() {
  const router = useRouter();

  const { session } = useSession();
  const context = useContext(AppContext);
  const { unlinkDevice } = usePushNotification();

  const { setLogged } = context;

  async function handleLogout(withRedirect = true) {
    try {
      session
        .call("/user#logout", {})
        .then(async () => {
          setLogged(false);

          if (window.pusher) {
            window.pusher.unsubscribe(
              process.env.NEXT_PUBLIC_FAST_TRACK_PUSHER_CHANNEL
            );
          }
          withRedirect && router.push("/");
          await unlinkDevice();
        })
        .catch((error) => {
          //Mesmo com falha no logout ele continua com os outros passos.
          Sentry.captureException(error, {
            extra: {
              message: "Erro ao fazer logout",
            },
          });
        });
    } catch (error) {
      doToast("Tivemos algum erro, retorne novamente mais tarde.");

      Sentry.captureException(error, {
        extra: {
          message: "Erro ao fazer logout[INTERNO]",
        },
      });
    }
  }

  return {
    handleLogout,
  };
}
