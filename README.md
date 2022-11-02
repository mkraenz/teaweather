# TeaWeather

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploy on Vercel

Simply push to `main` branch to automatically trigger a deployment on Vercel.

## Deploy AWS resources

from repository root, run

```sh
# first time only
aws cloudformation create-stack --stack-name teaweather --template-body file://cloudformation-template.yaml --capabilities CAPABILITY_IAM
# update stack
aws cloudformation update-stack --stack-name teaweather --template-body file://cloudformation-template.yaml --capabilities CAPABILITY_IAM | jq .StackId

# describe stack
STACK_ID=$(aws cloudformation describe-stacks --stack-name teaweather | jq '.Stacks[0].StackId')

API_GATEWAY_KEY_ID=$(aws cloudformation describe-stacks --stack-name teaweather | jq '.Stacks[0].Outputs' | jq -r ' map(select(.OutputKey == "ApiKey"))[0].OutputValue')
API_GATEWAY_KEY_VALUE=$(aws apigateway get-api-keys --include-values --query 'items[0].value' --output text )
# use with care:
# echo $API_GATEWAY_KEY_VALUE

API_GATEWAY_ID=$(aws cloudformation describe-stacks --stack-name teaweather | jq '.Stacks[0].Outputs' | jq -r ' map(select(.OutputKey == "ApiId"))[0].OutputValue')
aws apigateway create-deployment --rest-api-id $API_GATEWAY_ID --stage-name prod
```

### Delete AWS resources

```sh
# delete stack
aws cloudformation delete-stack --stack-name teaweather
```

## Authentication / Authorization

- [Auth0 with Nextjs official docs](https://auth0.com/docs/quickstart/webapp/nextjs/01-log) (login to Auth0 with regular Google account)
- tenant: `teaweather`
- application name: `nextjs`
- [Protecting nextjs api routes](https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#protect-an-api-route)
