import Image from "next/image";
import { FC } from "react";

const weatherToIcon = {
  "Mostly sunny": {
    filename: "day",
    alt: "A sunny day",
  },
};

interface IconProps {
  size: number;
  alt: string;
  animated?: boolean;
  filename: string;
}

const AmChartWeatherIcon: FC<IconProps> = ({
  size,
  alt,
  animated = true,
  filename,
}) => (
  <Image
    src={`/amcharts-weather-icons${
      animated ? "/animated" : ""
    }/${filename}.svg`}
    alt={alt}
    width={size}
    height={size}
  />
);

interface Props {
  weather: string;
}

const WeatherIcon: FC<Props> = ({ weather }) => {
  const iconData = weatherToIcon[weather as keyof typeof weatherToIcon];
  return (
    <AmChartWeatherIcon
      size={100}
      alt={iconData.alt}
      filename={iconData.filename}
    />
  );
};

export default WeatherIcon;
