@app
greenwood-demo-adapter-aws

@http
/api/fragment
  method get
  src .aws-output/api/fragment

/api/greeting
  method get
  src .aws-output/api/greeting

/api/search
  method post
  src .aws-output/api/search

/products/*
  method get
  src .aws-output/routes/products

@aws
# profile default
region us-east-1
runtime nodejs22.x
architecture arm64