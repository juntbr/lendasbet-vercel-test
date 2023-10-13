import "dayjs/locale/pt-br";

import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import dayjs from "dayjs";

dayjs.locale("pt-br");

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault("America/Sao_Paulo")

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
// dayjs.extend(isSameOrBefore);

if (typeof window !== "undefined" && window["dayjs"] === undefined) {
  window["dayjs"] = dayjs;
}

export default dayjs;
