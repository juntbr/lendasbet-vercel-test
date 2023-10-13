// determine what is the current domain
export const verifyHostName = () => {
  const whichHostname = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL.replace("http://", "").replace(
        "https://",
        ""
      )
    : "localhost";
  switch (whichHostname) {
    case "lendasbet.com":
      return "production";
    case "lendasbet.io":
      return "staging";
    case "localhost":
      return "local";
    default:
      return "local";
  }
};
