export const api = new sst.aws.ApiGatewayV2("Api");

const RUNTIME = "nodejs22.x";

// TODO need to handle basePath here?  (and / or all adapters?)
// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const apiRoutes = ((await import(new URL('../../public/manifest.json', import.meta.url), { with: { type: 'json' } })).default).apis.value;
// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const ssrPages = ((await import(new URL('../../public/graph.json', import.meta.url), { with: { type: 'json' } })).default).filter(page => page.isSSR);

// https://sst.dev/docs/component/aws/apigatewayv2
// https://sst.dev/docs/component/aws/function
ssrPages.forEach((page) => {
  const { id, segment, route } = page;
  const suffix = segment?.key ? `${route.replace('[', '{').replace(']', '}')}` : route;
  console.log(`Setting up SSR API route: GET /routes${suffix}`);

  // TODO: unharcode
  api.route(`GET /routes/product/{id}`, {
    bundle: `.aws-output/routes/${id}`,
    handler: "index.handler",
    runtime: RUNTIME
  });
})

apiRoutes.forEach((apiRoute) => {
  const [route, { id }] = apiRoute;

  // swap out [] for {} in route for AWS API Gateway compatibility
  api.route(`ANY ${route.replace('[', '{').replace(']', '}')}`, {
    bundle: `.aws-output/api/${id}`,
    handler: "index.handler",
    runtime: RUNTIME
  })
});