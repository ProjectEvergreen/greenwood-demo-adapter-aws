export const api = new sst.aws.ApiGatewayV2("Api");

// TODO need to pull from manifest?
// TODO need to handle basePath here?  (and / or all adapters?)

// https://sst.dev/docs/component/aws/apigatewayv2
// https://sst.dev/docs/component/aws/function
api.route("GET /api/greeting", {
  bundle: ".aws-output/api/greeting",
  handler: "index.handler",
  // runtime: "nodejs22.x"
});

api.route("GET /api/fragment", {
  bundle: ".aws-output/api/fragment",
  handler: "index.handler",
});

api.route("POST /api/search", {
  bundle: ".aws-output/api/search",
  handler: "index.handler",
  // runtime: "nodejs22.x"
});

api.route("GET /routes/products", {
  bundle: ".aws-output/routes/products",
  handler: "index.handler",
  // runtime: "nodejs22.x"
});