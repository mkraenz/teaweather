import { HStack, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { WeatherData } from "../../interfaces";
import WeatherDetails from "./WeatherDetails";
import WeatherIcon from "./WeatherIcon";

interface Props {
  weather: WeatherData;
  withLocation?: boolean;
}

const WeatherBlock: FC<Props> = ({ weather, withLocation }) => {
  return (
    <HStack gap="20px" alignItems={"flex-start"}>
      <WeatherIcon
        typeId={weather.weatherTypeId}
        description={weather.description}
      />
      <WeatherDetails {...weather} />
      <VStack alignItems={"flex-end"}>
        {withLocation && (
          <Text as="h3" fontSize={"2xl"}>
            {weather.location}
          </Text>
        )}
        <Text>
          {new Date(weather.time).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </Text>
        <Text fontSize={"lg"}>{weather.description}</Text>
      </VStack>
    </HStack>
  );
};

export default WeatherBlock;
