import { slugify } from "utils/iframe";

const createSportsBookUrl = (item: any) => {
  const TORUNAMENT_LOCATION = "localização-do-torneio/";
  const SPORT_NAME = slugify(item.shortSportName) + "/";
  const COUNTRY = slugify(item.categoryName) + "/";
  const LOCAL_ID = item.venueId + "/";
  const TORUNAMENT = slugify(item.name) + "/";
  const ID = item.id;

  const urlPath =
    TORUNAMENT_LOCATION +
    SPORT_NAME +
    item.sportId +
    "/" +
    COUNTRY +
    LOCAL_ID +
    TORUNAMENT +
    ID;

  return urlPath;
};

export { createSportsBookUrl };
