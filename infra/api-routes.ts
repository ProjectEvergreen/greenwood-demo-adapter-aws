// import { bucket } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api");

// TODO need to loop
// TODO need to handle basePath here?  (and / or all adapters?)

api.route("GET /api/hello", {
  handler: "functions/hello.handler",
});

// api.route("GET /api/fragment", {
//   handler: ".aws/api/fragment/index.handler",
// });

api.route("GET /api/greeting", {
  handler: ".aws/api/greeting/index.handler",
});

api.route("POST /api/search", {
  handler: ".aws/api/search/index.handler",
});