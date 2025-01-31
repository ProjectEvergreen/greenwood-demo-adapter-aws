// import { bucket } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api");

api.route("GET /api/hello", {
  // link: [bucket],
  handler: "functions/hello.handler",
});