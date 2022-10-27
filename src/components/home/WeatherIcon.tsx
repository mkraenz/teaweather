import Image from "next/image";
import { FC } from "react";

/** @see https://openweathermap.org/weather-conditions */
const weatherToIcon = {
  200: { filename: "thunder" }, // thunderstorm with light rain
  201: { filename: "thunder" }, // thunderstorm with rain
  202: { filename: "thunder" }, // thunderstorm with heavy rain
  210: { filename: "thunder" }, // light thunderstorm
  211: { filename: "thunder" }, // thunderstorm
  212: { filename: "thunder" }, // heavy thunderstorm
  221: { filename: "thunder" }, // ragged thunderstorm
  230: { filename: "thunder" }, // thunderstorm with light drizzle
  231: { filename: "thunder" }, // thunderstorm with drizzle
  232: { filename: "thunder" }, // thunderstorm with heavy drizzle

  300: { filename: "rainy-1" }, // light intensity drizzle
  301: { filename: "rainy-1" }, // drizzle
  302: { filename: "rainy-2" }, // heavy intensity drizzle
  310: { filename: "rainy-2" }, // light intensity drizzle rain
  311: { filename: "rainy-2" }, // drizzle rain
  312: { filename: "rainy-3" }, // heavy intensity drizzle rain
  313: { filename: "rainy-3" }, // shower rain and drizzle
  314: { filename: "rainy-3" }, // heavy shower rain and drizzle
  321: { filename: "rainy-3" }, // shower drizzle

  500: { filename: "rainy-4" }, // light rain
  501: { filename: "rainy-5" }, // moderate rain
  502: { filename: "rainy-5" }, // heavy intensity rain
  503: { filename: "rainy-6" }, // very heavy rain
  504: { filename: "rainy-6" }, // extreme rain
  511: { filename: "snowy-4" }, // freezing rain
  520: { filename: "rainy-4" }, // light intensity shower rain
  521: { filename: "rainy-5" }, // shower rain
  522: { filename: "rainy-6" }, // heavy intensity shower rain
  531: { filename: "rainy-6" }, // ragged shower rain
  600: { filename: "snowy-3" }, // light snow
  601: { filename: "snowy-5" }, // snow
  602: { filename: "snowy-6" }, // heavy snow
  611: { filename: "snowy-2" }, // sleet
  612: { filename: "snowy-1" }, // Light shower sleet
  613: { filename: "snowy-2" }, // shower sleet
  615: { filename: "snowy-1" }, // light rain and snow
  616: { filename: "snowy-5" }, //	rain and snow
  620: { filename: "snowy-4" }, // light shower snow
  621: { filename: "snowy-5" }, // shower snow
  622: { filename: "snowy-6" }, // heavy shower snow

  // TODO specify filenames in this block
  701: { filename: "TODO" }, // mist
  711: { filename: "TODO" }, // smoke
  721: { filename: "TODO" }, // haze
  731: { filename: "TODO" }, // sand, dust whirls
  741: { filename: "TODO" }, // fog
  751: { filename: "TODO" }, // sand
  761: { filename: "TODO" }, // dust
  762: { filename: "TODO" }, // volcanic ash
  771: { filename: "TODO" }, // squalls
  781: { filename: "TODO" }, // tornado

  800: { filename: "day" }, // clear sky
  801: { filename: "cloudy-day-1" }, // few clouds
  802: { filename: "cloudy-day-2" }, // scattered clouds
  803: { filename: "cloudy-day-3" }, // broken clouds
  804: { filename: "cloudy" }, // overcast clouds
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
  typeId: number;
  description: string;
}

const WeatherIcon: FC<Props> = ({ typeId, description }) => {
  const iconData =
    weatherToIcon[typeId as keyof typeof weatherToIcon] || weatherToIcon[800];
  return (
    <AmChartWeatherIcon
      size={100}
      alt={description}
      filename={iconData.filename}
    />
  );
};

export default WeatherIcon;
