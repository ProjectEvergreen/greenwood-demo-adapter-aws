# greenwood-demo-adapter-aws

A demonstration repo for deploying a full-stack [**Greenwood**](https://www.greenwoodjs.dev/) app with AWS and [**Architect**](https://arc.codes/) for static hosting and deploying serverless functions.

## Setup

To run locally
1. Clone the repo
1. Run `npm ci`

You can now run these npm scripts locally:
- `npm run dev` - Start the demo with Greenwood local dev server
- `npm run serve` - Start the demo with a production Greenwood build

## Demo

This repo aims to demonstrate a couple of Greenwood's features ([API Routes](https://www.greenwoodjs.dev/docs/pages/api-routes/) and [SSR pages](https://www.greenwoodjs.dev/docs/pages/server-rendering/)) leveraging Netlify's serverless and edge function capabilities, focused on using Web Components (WCC) and Web Standards to deliver the content for the demo.

## Status

|Feature    |Greenwood |Lambda |
|---------- |----------|-------|
|API Routes |   ✅     |   ✅  |
|SSR Pages  |   ✅     |   ✅  |

You can see the live demo at [https://y9ytogm4l7.execute-api.us-east-1.amazonaws.com/](https://y9ytogm4l7.execute-api.us-east-1.amazonaws.com/).

## Serverless

The serverless demos include the following examples:

### API Routes

- ✅  [`/api/greeting?name{xxx}`](https://greenwood-demo-adapter-vercel.vercel.app/api/greeting) - An API that returns a JSON response and optionally uses the `name` query param for customization.  Otherwise returns a default message.
- ✅ [`/api/fragment`](https://greenwood-demo-adapter-vercel.vercel.app/api/fragment) - An API for returning fragments of server rendered Web Components as HTML, that are then appended to the DOM.  The same card component used in SSR also runs on the client to provide interactivity, like event handling.
- ✅ [`/api/search`](https://greenwood-demo-adapter-vercel.vercel.app/api/event) - An API for handling a search using  `request.formData()`
- ✅ [`/api/event`](https://greenwood-demo-adapter-vercel.vercel.app/api/event) - An API for mimicking a webhook `POST` request that uses `request.json()`

### SSR Pages

- ✅ [`/products/`](https://greenwood-demo-adapter-vercel.vercel.app/products/) - SSR page for rendering Greenwood pages.