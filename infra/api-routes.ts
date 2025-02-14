export const api = new sst.aws.ApiGatewayV2("Api");

// TODO handle base path
const POST_ROUTES = ['/api/search']
const apiRoutes = ((await import(new URL('../../public/manifest.json', import.meta.url), { with: { type: 'json' } })).default).apis.value;
const ssrPages = ((await import(new URL('../../public/graph.json', import.meta.url), { with: { type: 'json' } })).default).filter(page => page.isSSR);

ssrPages.forEach((page) => {
  const { route, id } = page;

  api.route(`GET /routes/${id}`, {
    bundle: `.aws-output/routes/${id}`,
    handler: "index.handler",
    // runtime: "nodejs22.x"
  });
})

// TODO need to pull from manifest?
// TODO need to handle basePath here?  (and / or all adapters?)
// https://sst.dev/docs/component/aws/apigatewayv2
// https://sst.dev/docs/component/aws/function
apiRoutes.forEach((apiRoute) => {
  const [route] = apiRoute;
  const method = POST_ROUTES.includes(route) ? 'POST' : 'GET';

  api.route(`${method} ${route}`, {
    bundle: `.aws-output/${route}`,
    handler: "index.handler",
    // runtime: "nodejs22.x"
  })
});