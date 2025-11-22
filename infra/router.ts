import { frontend } from './static';
import { api } from './api-routes';

// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const ssrPages = ((await import(new URL('../../public/graph.json', import.meta.url), { with: { type: 'json' } })).default).filter(page => page.isSSR);
const ssrRoutes = {};

// TODO handle base path
ssrPages.forEach((page) => {
  console.log("Setting up SSR routing:", page);
  const { route, id, segment } = page;

  ssrRoutes[page.route] = {
    url: api.url,
    rewrite: {
      // swap out [] for a wilcard for Cloudfront routing compatibility
      regex: `^${route.replace(`[${segment}]`, '*')}$`,
      to: `/routes/${id}`
    }
  }
})

console.log("SSR Routes:", ssrRoutes);

// https://sst.dev/docs/component/aws/router
export const router = new sst.aws.Router("MyRouter", {
  routes: {
    "/api/*": api.url,
    // ...ssrRoutes,
    "/*": frontend.url
  },
  invalidation: true,
});