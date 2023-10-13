function affiliateEventsReducer(state, action: { type: string }) {
  if (action.type === "none") {
    return {
      CURRENT_EVENT: "none",
    };
  }
  if (action.type === "deposit") {
    return {
      CURRENT_EVENT: "deposit",
    };
  }
  if (action.type === "registration") {
    return {
      CURRENT_EVENT: "registration",
    };
  }
  throw Error("Unknown action.");
}

export default affiliateEventsReducer;
