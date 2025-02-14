import { frontend } from './static';
import { api } from './api-routes';

export const router = new sst.aws.Router("MyRouter", {
  routes: {
    "/api/*": api.url,
    "/*": frontend.url
  },
  invalidation: true,
});