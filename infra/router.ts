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
    const routeKey = route.replace(`[${segment.key}]`, '*');
    const basePattern = segment.pathname.replace(`/:${segment.key}/`, '')
    console.log('segmented routing', ` - route: ${regexRoute} -> /routes/${id}`);
    console.log({ route, id, routeKey, basePattern });

    // segment: { key: 'id', pathname: '/product/:id/' }
    ssrRoutes[`${basePattern}/*`] = {
      url: api.url,
      rewrite: {
        regex: `^${basePattern}/(.*)$`,
        to: `/routes${basePattern}/$1`
      }
    }
  } else {
    const routePattern = `/${route.split('/').filter((segment) => segment !== '').join('/')}`;
    console.log('non segment page', { routePattern, route });
    ssrRoutes[route] = {
      url: api.url,
      rewrite: {
        regex: `^${route}$`,
        to: `/routes/${routePattern}`
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