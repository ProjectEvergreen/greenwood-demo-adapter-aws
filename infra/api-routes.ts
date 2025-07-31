export const api = new sst.aws.ApiGatewayV2("Api");

const RUNTIME = "nodejs22.x";

// TODO need to handle basePath here?  (and / or all adapters?)
// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
// const apiRoutes = ((await import(new URL('../../public/manifest.json', import.meta.url), { with: { type: 'json' } })).default).apis.value;
// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const ssrPages = ((await import(new URL('../../public/graph.json', import.meta.url), { with: { type: 'json' } })).default).filter(page => page.isSSR);

// https://sst.dev/docs/component/aws/apigatewayv2
// https://sst.dev/docs/component/aws/function
ssrPages.forEach((page) => {
  const { id, route } = page;

  api.route(`GET /routes${route}`, {
    bundle: `.aws-output/routes/${id}`,
    handler: "index.handler",
    runtime: RUNTIME
  });
})

// apiRoutes.forEach((apiRoute) => {
//   const [route, details] = apiRoute;

//   api.route(`ANY ${route}`, {
//     bundle: `.aws-output/api/${details.id}`,
//     handler: "index.handler",
//     runtime: RUNTIME
//   })
// });