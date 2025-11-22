import { frontend } from './static';
import { api } from './api-routes';

// @ts-expect-error see https://github.com/microsoft/TypeScript/issues/42866
const ssrPages = ((await import(new URL('../../public/graph.json', import.meta.url), { with: { type: 'json' } })).default).filter(page => page.isSSR);
const ssrRoutes = {};

// TODO handle base path
ssrPages.forEach((page) => {
  console.log("Setting up SSR routing:", page);
  const { route, id, segment } = page;

  if(segment?.key) {
    // swap out [] for a wildcard for Cloudfront routing compatibility
    const regexRoute  = route.replace(`[${segment.key}]`, `(.*)`);
    console.log(` - route: ${regexRoute} -> /routes/${id}`);
    const routeKey = route.replaceAll('-', '');
    console.log({ routeKey });

    ssrRoutes[routeKey] = {
      url: api.url,
      rewrite: {
        regex:  `^/products/$`,
        // regex: `^${regexRoute}$`,
        to: `/routes/${id}`
      }
    }
  } else {
    ssrRoutes[page.route] = {
      url: api.url,
      rewrite: {
        regex: `^${route}$`,
        to: `/routes/${id}`
      }
    }
  }
})

console.log("SSR Routes:", ssrRoutes);

// https://sst.dev/docs/component/aws/router
export const router = new sst.aws.Router("MyRouter", {
  routes: {
    "/api/*": api.url,
    ...ssrRoutes,
    "/*": frontend.url
  },
  invalidation: true,
});