import { IncomingMessage } from "http";

function absoluteUrl(
  req?: IncomingMessage,
  localhostAddress = "localhost:3000",
  hostname?: string
) {
  const host = getHost(req, localhostAddress);
  const protocol = getProtocol(req, host);

  return {
    protocol,
    host,
    origin: `${protocol}//${host}`,
  };
}

function getHost(req?: IncomingMessage, localhostAddress = "localhost:3000") {
  if (
    req &&
    req.headers["x-forwarded-host"] &&
    typeof req.headers["x-forwarded-host"] === "string"
  ) {
    return req.headers["x-forwarded-host"];
  }

  const defaultHost = req?.headers?.host || localhostAddress;
  return defaultHost;
}

function getProtocol(req?: IncomingMessage, host: string) {
  if (
    req &&
    req.headers["x-forwarded-proto"] &&
    typeof req.headers["x-forwarded-proto"] === "string"
  ) {
    return `${req.headers["x-forwarded-proto"]}:`;
  }

  return isLocalNetwork(host) ? "http:" : "https:";
}

function isLocalNetwork(hostname: string) {
  return (
    hostname.startsWith("localhost") ||
    hostname.startsWith("127.0.0.1") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.0.") ||
    hostname.endsWith(".local")
  );
}

export default absoluteUrl;
