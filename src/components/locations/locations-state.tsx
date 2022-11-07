import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  Reducer,
  useContext,
  useReducer,
} from "react";
import type { ILocation } from "../../api/domain/Location";
import type { WeatherData } from "../interfaces";

type SomeError = string | null | undefined | Record<PropertyKey, unknown>;
export type WeatherLocation = {
  location: ILocation;
  weather: WeatherData;
  loading: boolean;
  error?: SomeError;
};
type NormalizedLocations = {
  [id: string]: WeatherLocation;
};

interface LocationsState {
  locations: NormalizedLocations;
}
const LocationsStateContext = createContext<{
  state: LocationsState;
  dispatch: Dispatch<Action>;
  allLocations: WeatherLocation[];
}>(null as any); // The defaultValue argument is only used when a component does not have a matching Provider above it in the tree.

type Action =
  | { type: "add"; location: Pick<WeatherLocation, "location" | "weather"> }
  | { type: "remove"; id: string }
  | { type: "fetch-weather"; id: string }
  | { type: "fetch-weather-failed"; id: string; error: SomeError }
  | { type: "set-custom-name"; id: string; customName: string | null }
  | { type: "set-weather"; id: string; weather: WeatherData };

const reducer: Reducer<LocationsState, Action> = (prevState, action) => {
  switch (action.type) {
    case "add":
      return {
        locations: {
          ...prevState.locations,
          [action.location.location.id]: { ...action.location, loading: false },
        },
      };
    case "remove":
      const { [action.id]: _, ...newLocations } = prevState.locations;
      return {
        locations: newLocations,
      };
    case "fetch-weather":
      return {
        locations: {
          ...prevState.locations,
          [action.id]: {
            ...prevState.locations[action.id],
            loading: true,
          },
        },
      };
    case "set-weather":
      return {
        locations: {
          ...prevState.locations,
          [action.id]: {
            ...prevState.locations[action.id],
            weather: action.weather,
            loading: false,
          },
        },
      };
    case "fetch-weather-failed":
      return {
        locations: {
          ...prevState.locations,
          [action.id]: {
            ...prevState.locations[action.id],
            loading: false,
          },
        },
      };
    case "set-custom-name":
      return {
        locations: {
          ...prevState.locations,
          [action.id]: {
            ...prevState.locations[action.id],
            location: {
              ...prevState.locations[action.id].location,
              customName: action.customName,
            },
          },
        },
      };
    default:
      return prevState;
  }
};

export const LocationsStateProvider: FC<{
  children: ReactNode;
  initialLocations: WeatherLocation[];
}> = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    locations: props.initialLocations.reduce<NormalizedLocations>(
      (acc, location) => {
        acc[location.location.id] = location;
        return acc;
      },
      {}
    ),
  });

  const allLocations = Object.values(state.locations);

  return (
    <LocationsStateContext.Provider
      value={{ state, dispatch, allLocations }}
      {...props}
    />
  );
};

export function useLocations() {
  const context = useContext(LocationsStateContext);
  if (context) return context;

  throw new Error(
    "You need to wrap your component tree with LocationsStateProvider."
  );
}
