import { frontend } from './static';
import { api } from './api-routes';

// TODO don't hardcode SSR page routes
// https://sst.dev/docs/component/aws/router
export const router = new sst.aws.Router("MyRouter", {
  routes: {
    "/api/*": api.url,
    "/products/": {
      url: api.url,
      rewrite: {
        regex: "^/products/$",
        to: "/routes/products"
      }
    },
    "/*": frontend.url
  },
  invalidation: true,
});