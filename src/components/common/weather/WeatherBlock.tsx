import { HStack, Text, VStack } from "@chakra-ui/react";
import type { FC } from "react";
import type { WeatherData } from "../../interfaces";
import WeatherDetails from "./WeatherDetails";
import WeatherIcon from "./WeatherIcon";

interface Props {
  weather: WeatherData;
  withLocation?: boolean;
  customLocation?: string | undefined;
}

const WeatherBlock: FC<Props> = ({ weather, withLocation, customLocation }) => {
  return (
    <HStack gap={4} alignItems={"flex-start"}>
      <WeatherIcon
        typeId={weather.weatherTypeId}
        description={weather.description}
      />
      <WeatherDetails {...weather} />
      <VStack alignItems={"flex-end"} pr={4}>
        {withLocation && (
          <Text as="h3" fontSize={"2xl"}>
            {customLocation || weather.location}
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
