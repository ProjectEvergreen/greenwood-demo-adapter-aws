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
    // const routeKey = route.replace(`[${segment.key}]`, '(.*)'); // `/${id.replaceAll('-', '')}/`;
    const routeKey = route.replace(`[${segment.key}]`, '*'); // `/${id.replaceAll('-', '')}/`;
    console.log('segmented routing', ` - route: ${regexRoute} -> /routes/${id}`);
    console.log({ route, id, routeKey });

    ssrRoutes['/product/*/'] = {
      url: api.url,
      rewrite: {
        // TODO: un-hardcode
        regex: "^/product/(.*)$",
        to: "/routes/product/$1"
        // regex: `^${regexRoute}$`,
        // to: '/route/product/1/'
        // to: `/routes/${id}`
        // regex:  `^/products/$`,
        // to: `/routes/${id}/$1`
      }
    }
  } else {
    const r = `/${route.split('/').filter((segment) => segment !== '').join('/')}`;
    console.log('non segment page', { r, route });
    ssrRoutes[route] = {
      url: api.url,
      rewrite: {
        regex: `^${route}$`,
        to: `/routes/${r}`
      }
    }
  }
})

// https://sst.dev/docs/component/aws/router
export const router = new sst.aws.Router("MyRouter", {
  routes: {
    "/api/*": api.url,
    ...ssrRoutes,
    "/*": frontend.url
  },
  invalidation: true,
});