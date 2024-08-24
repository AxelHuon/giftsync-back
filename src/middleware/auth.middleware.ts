import { IncomingHttpHeaders } from "node:http";

export const getToken = (headers: IncomingHttpHeaders): string | undefined => {
  let authorizationHeader = headers["authorization"];
  if (authorizationHeader) {
    return authorizationHeader.slice(7, authorizationHeader.length);
  }
};
