@app
greenwood-demo-adapter-aws

@http
/api/fragment
  method any
  src .aws-output/api/fragment

/api/greeting
  method any
  src .aws-output/api/greeting

/api/search
  method any
  src .aws-output/api/search

/api/webhook/event
  method any
  src .aws-output/api/webhook-event

/products/*
  method get
  src .aws-output/routes/products

/products/blog/first-post*
  method get
  src .aws-output/routes/blog-first-post

@aws
# profile default
region us-east-1
runtime nodejs22.x
architecture arm64