export const api = new sst.aws.ApiGatewayV2("Api");

const RUNTIME = "nodejs22.x";

// TODO need to handle basePath here?  (and / or all adapters?)
// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const apiRoutes = ((await import(new URL('../../public/manifest.json', import.meta.url), { with: { type: 'json' } })).default).apis.value;
// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const ssrPages = ((await import(new URL('../../public/graph.json', import.meta.url), { with: { type: 'json' } })).default).filter(page => page.isSSR);

// https://sst.dev/docs/component/aws/apigatewayv2
// https://sst.dev/docs/component/aws/function
// NOTE: API Gateway routes can NOT end in a trailing /
ssrPages.forEach((page) => {
  const { id, segment, route } = page;
  const { key, pathname } = segment;
  const routePattern = segment?.key
    ? pathname.replace(`:${key}/`, '{proxy+}')
    : `/${route.split('/').filter((segment) => segment !== '').join('/')}`;
  console.log(`Setting up SSR API route: GET /routes${routePattern}`);

  api.route(`GET /routes${routePattern}`, {
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