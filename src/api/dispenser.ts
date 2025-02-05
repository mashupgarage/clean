import axios from "axios";
import queryString from "query-string";

// axios.defaults.headers.common["ngrok-skip-browser-warning"] = true;
// axios.defaults.headers.common["User-Agent"] = "PostmanRuntime/7.42.0";

const baseUrl = `${import.meta.env.VITE_CLOUD_SERVER_URL}`;

export type DispenserItem = {
  name: string;
  SKU: string;
  id: number;
  drink_image: string;
  drink_name: string;
  drink_name2: string;
  drink_size: string;
  price_large: string;
  price_small: string;
};

// Menu
export const fetchMenuItems = async (): Promise<DispenserItem[]> => {
  const endpoint = `${baseUrl}/api/dispenser/menu-items`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

// Machine Actions

// NOTE: setPump allows to run the pump for a given duration.
// This is different from startDrinkDispensing which infers the duration from the size of the drink
// Current types in the backend are the ff:
// dispenser: Tap-A | Tap-B
// size: Small | Large

export const setPump = async (dispenserName: string, duration: number) => {
  const params = queryString.stringify({
    dispenser: dispenserName,
    duration: duration,
  });
  const endpoint = `${baseUrl}/api/dispenser/set-pump?${params}`;

  return axios
    .put(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const startDrinkDispensing = async (
  dispenserName: string,
  size: string,
) => {
  const endpoint = `${baseUrl}/api/dispenser/start-drink-dispensing/`;
  const body = JSON.stringify({ dispenser: dispenserName, size });

  return axios
    .post(endpoint, body, { headers: { "Content-Type": "application/json" } })
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const stopDrinkDispensing = async (dispenserName: string) => {
  const endpoint = `${baseUrl}/api/dispenser/stop-drink-dispensing/`;
  const body = JSON.stringify({ dispenser: dispenserName });

  return axios
    .post(endpoint, body, { headers: { "Content-Type": "application/json" } })
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

// Similar to setCleaner but operates on the dispenser instance and the specified mode
export const cleanDispenser = async (dispenserName: string, mode: number) => {
  const endpoint = `${baseUrl}/api/dispenser/clean/`;
  const body = JSON.stringify({ dispenser_name: dispenserName, mode: mode });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

// Set Cleaner is to restart the cleaner mode to 0 and operate it again into given mode number
export const setCleaner = async (dispenserName: string, mode: number) => {
  const params = queryString.stringify({
    dispenser: dispenserName,
    mode: mode,
  });
  const endpoint = `${baseUrl}/api/dispenser/set-cleaner?${params}`;

  return axios
    .put(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const setHeater = async (
  dispenserName: string,
  heaterStatus: boolean,
) => {
  const endpoint = `${baseUrl}/api/dispenser/set-heater/`;
  const body = JSON.stringify({
    dispenser_name: dispenserName,
    heater_status: heaterStatus,
  });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const setTempRegulation = async (
  dispenserName: string,
  tempRegulation: boolean,
) => {
  const endpoint = `${baseUrl}/api/dispenser/set-temp-regulation/`;
  const body = JSON.stringify({
    dispenser_name: dispenserName,
    temperature_regulation: tempRegulation,
  });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const turnOnTap = async (dispenserName: string) => {
  const endpoint = `${baseUrl}/api/dispenser/turn-on-tap/`;
  const body = JSON.stringify({ dispenser_name: dispenserName });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const turnOffTap = async (dispenserName: string) => {
  const endpoint = `${baseUrl}/api/dispenser/turn-off-tap/`;
  const body = JSON.stringify({ dispenser_name: dispenserName });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

// Dispenser
export const dispenserTest = async () => {
  const endpoint = `${baseUrl}/api/dispenser/test/`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const checkCupPresence = async (dispenserName: string) => {
  const params = queryString.stringify({ dispenser: dispenserName });
  const endpoint = `${baseUrl}/api/dispenser/check-cup-presence?${params}`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const getTemperature = async (dispenserName: string) => {
  const params = queryString.stringify({ dispenser: dispenserName });
  const endpoint = `${baseUrl}/api/dispenser/get-temperature?${params}`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const getThermosWeight = async (dispenserName: string) => {
  const params = queryString.stringify({ dispenser: dispenserName });
  const endpoint = `${baseUrl}/api/dispenser/get-thermos-weight?${params}`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const getVersion = async () => {
  const endpoint = `${baseUrl}/api/dispenser/get-version`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const setHeaterStrength = async (
  dispenserName: string,
  strength: number,
) => {
  const params = queryString.stringify({
    dispenser: dispenserName,
    strength: strength,
  });
  const endpoint = `${baseUrl}/api/dispenser/set-heater?${params}`;

  return axios
    .put(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

// This API request is using the same action as setHeaterStrength
// To-do: Figure out what's the `duration` should be use for from the backend.
// This might be the heating cycle time?
// export const setHeaterDuration = async (dispenserName: string, duration: number) => {
//   const params = queryString.stringify({ dispenser: dispenserName, duration: duration })
//   const endpoint = `${baseUrl}/api/dispenser/set-heater?${params}`

//   return axios.put(endpoint).then(res => res.data).catch(err => err.response.data.error)
// }

// Vending Machine
export const selectVendingMachine = async (name: string) => {
  const params = queryString.stringify({ name: name });
  const endpoint = `${baseUrl}/api/dispenser/select-vm?${params}`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

export const fetchVendingMachineAppearance = async () => {
  const endpoint = `${baseUrl}/api/dispenser/vending-machine-appearance`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const fetchVendingMachineStatus = async () => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/status/`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const updateVendingMachineStatus = async (
  status: string,
  message: string,
  dispenser_name: string,
) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/status/update/`;
  const body = JSON.stringify({
    status: status,
    message: message,
    dispenser_name: dispenser_name,
  });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data[0]);
};

export const fetchLockState = async () => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/lock-state/`;

  return axios
    .get(endpoint)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const setLockState = async (lockState: boolean) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/lock-state/set/`;
  const body = JSON.stringify({ is_locked: lockState });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const setPinCode = async (pinCode: string) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/set-pin/`;
  const body = JSON.stringify({ pin_code: pinCode });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};

export const verifyPinCode = async (pinCode: string) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/verify-pin/`;
  const body = JSON.stringify({ pin_code: pinCode });

  return axios
    .post(endpoint, body)
    .then((res) => res.data)
    .catch((err) => err.response.data.error);
};
