// TODO refactor code to use this
export const Env = {
  openWeatherApiKey: process.env.OPENWEATHERMAP_API_KEY!,
  baseUrl: process.env.BASE_URL!,
  awsRegion: process.env.AWS_REGION!,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  awsDynamoDbTableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
};

const assertEnv = () => {
  Object.entries(Env).forEach(([key, value]) => {
    if (!value) throw new Error(`Environment variable for ${key} not set.`);
  });
};

assertEnv();
