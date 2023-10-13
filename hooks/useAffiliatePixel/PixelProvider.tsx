import { useAffiliatePixel } from "@/hooks/useAffiliatePixel";
import { createContext, useReducer } from "react";
import affiliateEventsReducer from "./reducer";

export const PixelContext = createContext({
  affiliate: {},
  affiliateEventState: {
    CURRENT_EVENT: "none",
  },
  dispatchAffiliateEvent: (action: { type: string }) => {},
});

const PixelProvider = ({ children }) => {
  const { affiliate } = useAffiliatePixel();

  const [affiliateEventState, dispatchAffiliateEvent] = useReducer(
    affiliateEventsReducer,
    { CURRENT_EVENT: "none" }
  );

  return (
    <PixelContext.Provider
      value={{
        affiliate,
        affiliateEventState,
        dispatchAffiliateEvent,
      }}
    >
      {children}
    </PixelContext.Provider>
  );
};

export default PixelProvider;
