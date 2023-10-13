export enum Platform {
  PC = "PC",
  iPad = "iPad",
  iPhone = "iPhone",
  Android = "Android",
}

export interface GameCategory {
  id: string;
  name: string;
  games: { count: number };
}

export interface Game {
  href: string;
  id: string;
  gameId: number;
  name: string;
  launchUrl: string;
  backgroundImageUrl: string;
  popularity: 0.0;
  isNew: false;
  width: 1280;
  height: 720;
  hasFunMode: true;
  hasAnonymousFunMode: true;
  thumbnail: string;
  subVendor: string;
  subVendorId: 140;
  defaultThumbnail: string;
  type: string;
  logo: string;
  slug: string;
  theoreticalPayOut: 0.9485;
  platform: Platform;
}

export interface CasinoGroup {
  id: string;
  name: string;
  games: {
    count: number;
    total: number;
    items: Game[];
  };
}
export interface CasinoGroupsResponse {
  count: number;
  total: number;
  items: CasinoGroup[];
}

export interface BasicCasinoResponse<T> {
  count: number;
  total: number;
  items: T[];
  pages: {
    first: string;
    next: string | null;
    previous: string | null;
    last: string;
  };
}

export interface Vendor {
  href: string;
  id: number;
  indentity: string;
  enabled: boolean;
  name: string;
  logo?: string;
  games?: {
    count: number;
    total: number;
    items: Game[];
  };
}

export type SubVendor = Vendor;
