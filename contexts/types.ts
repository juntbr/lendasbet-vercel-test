import { ProfileField } from "interfaces/profile.interface";
import { userCpfData } from "services/CpfCnpjApi";

export interface ContextProps {
  fetchAuthenticatedUser: any;
  openSideBar: boolean;
  setOpenSideBar: any;
  loading: any;
  setLoading: any;
  logged: boolean;
  setLogged: any;
  userId: string | null;
  setUserId: (data: string) => void;
  sessionId: string | null;
  setSessionId: (data: string) => void;
  userCpfData: userCpfData | null;
  setUserCpfData: any;
  notify: any;
  activeCategorySport: any;
  setActiveCategorySport: any;
  profileOption: any;
  setProfileOption: any;
  account: ProfileField;
  setAccount: (profile: ProfileField) => void;
  betSlipBettingSelectionsCount: any;
  setBetSlipBettingSelectionsCount: any;
  setIframeRef: any;
  iframeRef: any;
  betSlipOverlay: any;
  setBetSlipOverlay: any;
  setSidebarSearchQuery: (value: string) => void;
  sidebarSearchQuery: null | string;
  loadingAuth: any;
  setLoadingAuth: any;
  accountPanels: any;
  setAccountPanels: any;
  isEmailVerified: boolean;
  setIsEmailVerified: (value: boolean) => void;
  wallet: any;
  setWallet: any;
  activeAccount: boolean;
  setActiveAccount: (value: boolean) => void;
  setDynamicUrl: (value: string) => void;
  dynamicUrl: string;
  setIsInitialLoginLoading: (value: boolean) => void;
  isInitialLoginLoading: boolean;
  isOnTermsOfService: boolean;
  setIsOnTermsOfService: (value: boolean) => void;
  roles: string[] | null;
  setRoles: (value: string[] | null) => void;
  setIframeLink: (url: string) => void;
  createUrl: (item: any) => void;
  toProfile: () => void;
  toExtract: () => void;
  currentSidebar: string;
  setCurrentSidebar: (value: string) => void;
  isGmailSignup: boolean
}

export interface Query {
  r?: string;
  om?: string;
}
