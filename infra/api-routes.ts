// import { bucket } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api");

// TODO need to loop
// TODO need to handle basePath here?  (and / or all adapters?)

api.route("GET /api/hello", {
  // link: [bucket],
  handler: "functions/hello.handler",
});

api.route("GET /api/greeting", {
  // link: [bucket],
  handler: ".aws/api/greeting/index.handler",
});