import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";
import { WeatherData } from "../../interfaces";

type Props = Pick<
  WeatherData,
  | "temperature"
  | "temperatureUnit"
  | "humidity"
  | "humidityUnit"
  | "wind"
  | "windUnit"
  | "windDirection"
  | "precipitationProbabilityInPercent"
>;

const WeatherDetails: FC<Props> = ({
  humidity,
  humidityUnit,
  precipitationProbabilityInPercent,
  temperature,
  temperatureUnit,
  wind,
  windDirection,
  windUnit,
}) => {
  return (
    <Box>
      <Text>
        Temperature: {temperature}&nbsp;{temperatureUnit}
      </Text>
      <Text>Precipitation: {precipitationProbabilityInPercent}&nbsp;%</Text>
      <Text>
        Humidity: {humidity}&nbsp;{humidityUnit}
      </Text>
      <Text>
        Wind: {wind}&nbsp;{windUnit}&nbsp;{windDirection}
      </Text>
    </Box>
  );
};

export default WeatherDetails;
