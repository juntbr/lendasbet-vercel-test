import { useEffect } from "react";
import Script from "next/script";
import { useAffiliatePixel } from ".";

const LoadScript = ({ event }) => {
  const { affiliate } = useAffiliatePixel();
  const scriptId = `${affiliate.id}-content-script-${event.name}`;
  const scriptClassName = `affiliate-${affiliate.id}-content-script-event`;

  useEffect(() => {
    const scriptElements = document.querySelectorAll(`.${scriptClassName}`);
    scriptElements.forEach((element) => {
      if (element.id !== scriptId) {
        element.remove();
      }
    });
  }, [scriptId]);

  useEffect(() => {
    if (!event.noScript) return () => null;
    var noscriptElement = document.getElementById("noscript_main");

    if (noscriptElement) {
      const htmlString = event.noScript;

      noscriptElement.innerHTML += htmlString;
    }
  }, [event]);

  if (event.scriptUrl) {
    return (
      <Script
        key={scriptId}
        id={scriptId}
        className={scriptClassName}
        strategy="afterInteractive"
        src={event.scriptUrl}
        onLoad={() => { }}
      />
    );
  }

  return (
    <Script
      key={scriptId}
      id={scriptId}
      strategy="afterInteractive"
      className={scriptClassName}
      dangerouslySetInnerHTML={{
        __html: event.scriptContent,
      }}
      onLoad={(e) => console.log("load")}
      onError={(e) => { console.log(e, 'error'); }}
      onReady={(e) => { console.log('ready'); }}
    />
  );
};

export default function Pixels() {
  const { btag, affiliate, affiliateEventState } = useAffiliatePixel();

  if (!btag) return null;

  if (!affiliate) return null;

  const masterId = `${affiliate.id}-content-script`;

  const event = affiliate.events.find(
    (evt) => evt.name === affiliateEventState.CURRENT_EVENT
  );

  return (
    <div id="pixels-container">
      {affiliate.scriptUrl && (
        <Script
          key={masterId}
          id={masterId}
          strategy="afterInteractive"
          src={affiliate.scriptUrl}
          onLoad={() => { }}
        />
      )}
      {event && <LoadScript event={event} />}
    </div>
  );
}
