import { useEffect, useState } from "react";

export default function useGeolocationBasedWeather<T>(
  getUrl: (latitude: number, longitude: string) => string
) {
  const [fetchResult, setFetchResult] = useState<T | null>(null);
  const [loading, setLoading] = useState(false); // TODO implement
  const [error, setError] = useState(); // TODO implement

  // TODO not the best code but works for now
  useEffect(() => {
    // based on https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

    const fetchWeather = async (position: { lat: number; lon: number }) => {
      const res = await fetch(
        `/api/weather-current?lat=${position.lat}&lon=${position.lon}`
      );
      if (!res.ok) {
        // TODO handle error
      }
      const data: T = await res.json();
      setFetchResult(data);
    };

    const onPositionRevealed: PositionCallback = async (pos) => {
      console.log("pos", pos);
      const position = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      document.cookie = `teaweather-location=${JSON.stringify(
        position
      )}; max-age=7200`; // 7200 seconds = 2 hours
      await fetchWeather(position);
    };
    const onPositionDenied: PositionErrorCallback = (err) => {
      console.error("permission denied", err);
    };

    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        onPositionRevealed,
        onPositionDenied,
        {
          maximumAge: 7200 * 1000, // 2 hours in millis
        }
      );
    };

    async function getGeolocation() {
      if (document.cookie.includes("teaweather-location")) {
        const locationCookieValue = document.cookie
          .split("teaweather-location=")[1]
          .split(";")[0];
        console.log("location cookie found:", locationCookieValue);
        const position = JSON.parse(locationCookieValue);
        return fetchWeather(position);
      }

      const result = await navigator.permissions.query({ name: "geolocation" });
      console.log(result.state);
      if (result.state === "granted") {
        getPosition();
      } else if (result.state === "prompt") {
        getPosition();
      } else if (result.state === "denied") {
        // do nothing. Consider showing message: "you have declined location permissions, so we can't automatically show the weather for your location"
      }
      result.onchange = function () {
        console.log("geolocation permission changed.", result.state);
      };
    }

    getGeolocation();
  }, []);

  return { data: fetchResult, loading, error };
}
