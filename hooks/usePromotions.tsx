import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useModal } from "./useModal";

export type PromotionContextType = {
  currentPromo: string;
  setCurrentPromo: (url: string) => void;
  openPromotion: (url: string, logged: boolean) => void;
  activeCategory: string;
  setActiveCategory: (url: string) => void;
};

const defaultContext: PromotionContextType = {
  currentPromo: "",
  setCurrentPromo: (url: string) => {},
  openPromotion: (url: string, logged: boolean) => {},
  activeCategory: "",
  setActiveCategory: (url: string) => {},
};

const PromotionContext = createContext(defaultContext);

export const PromotionProvider = ({ children }: PropsWithChildren) => {
  const { push } = useRouter();
  const [currentPromo, setCurrentPromo] = useState<string>("");
  const { handleOpenModalOfferNotAllowedUnlogged } = useModal();
  const [activeCategory, setActiveCategory] = useState("");

  const openPromotion = (url: string, logged: boolean) => {
    const hasSentTheEmail = Cookies.get("hasSubscribedEmail");

    if (!logged && hasSentTheEmail !== "true") {
      handleOpenModalOfferNotAllowedUnlogged();
      setCurrentPromo(url);
      return;
    } else {
      push(url);
    }
  };

  return (
    <PromotionContext.Provider
      value={{
        currentPromo,
        setCurrentPromo,
        openPromotion,
        activeCategory,
        setActiveCategory,
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
};

export default function usePromotion() {
  const {
    currentPromo,
    setCurrentPromo,
    openPromotion,
    activeCategory,
    setActiveCategory,
  } = useContext(PromotionContext);
  
  return {
    currentPromo,
    setCurrentPromo,
    openPromotion,
    activeCategory,
    setActiveCategory,
  };
}
