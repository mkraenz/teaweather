export const Env = {
  openWeatherApiKey: process.env.OPENWEATHERMAP_API_KEY!,
  baseUrl: process.env.BASE_URL!,
  awsRegion: process.env.TEAWEATHER_AWS_REGION!,
  awsAccessKeyId: process.env.TEAWEATHER_AWS_ACCESS_KEY_ID!,
  awsSecretAccessKey: process.env.TEAWEATHER_AWS_SECRET_ACCESS_KEY!,
  awsDynamoDbTableName: process.env.TEAWEATHER_AWS_DYNAMODB_TABLE_NAME!,
  arcgisApiKey: process.env.ARCGIS_API_KEY!,
};

const assertEnv = () => {
  Object.entries(Env).forEach(([key, value]) => {
    if (!value) throw new Error(`Environment variable for ${key} not set.`);
  });
};

assertEnv();
