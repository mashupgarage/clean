import axios from 'axios'
import queryString from 'query-string'

const baseUrl = `${import.meta.env.VITE_CLOUD_SERVER_URL}`

// Dispenser
export const dispenserTest = async () => {
  const endpoint = `${baseUrl}/api/dispenser/test/`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const checkCupPresence = async (dispenserName: string) => {
  const params = queryString.stringify({ name: dispenserName })
  const endpoint = `${baseUrl}/api/dispenser/check-cup-presence?${params}`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const getTemperature = async (dispenserName: string) => {
  const params = queryString.stringify({ name: dispenserName })
  const endpoint = `${baseUrl}/api/dispenser/get-temperature?${params}`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const getThermosWeight = async (dispenserName: string) => {
  const params = queryString.stringify({ name: dispenserName })
  const endpoint = `${baseUrl}/api/dispenser/get-thermos-weight?${params}`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const setHeaterStrength = async (dispenserName: string, strength: number) => {
  const params = queryString.stringify({ name: dispenserName, strength: strength })
  const endpoint = `${baseUrl}/api/dispenser/set-heater?${params}`

  return axios.put(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const setHeaterDuration = async (dispenserName: string, duration: number) => {
  const params = queryString.stringify({ name: dispenserName, duration: duration })
  const endpoint = `${baseUrl}/api/dispenser/set-heater?${params}`

  return axios.put(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const setPump = async (dispenserName: string, duration: number) => {
  const params = queryString.stringify({ name: dispenserName, duration: duration })
  const endpoint = `${baseUrl}/api/dispenser/set-pump?${params}`

  return axios.put(endpoint).then(res => res.data).catch(err => err.response.data.error)
} 

export const setCleaner = async (dispenserName: string, mode: number) => {
  const params = queryString.stringify({ name: dispenserName, mode: mode })
  const endpoint = `${baseUrl}/api/dispenser/set-cleaner?${params}`

  return axios.put(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

// Vending Machine
export const selectVendingMachine = async (name: string) => {
  const params = queryString.stringify({ name: name })
  const endpoint = `${baseUrl}/api/dispenser/select-vm?${params}`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data)
}

export const fetchVendingMachineAppearance = async () => {
  const endpoint = `${baseUrl}/api/dispenser/vending-machine-appearance`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const fetchVendingMachineStatus = async () => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/status/`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const updateVendingMachineStatus = async (
  status: string,
  message: string,
  dispenser_name: string
) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/status/update/`
  const body = JSON.stringify({
    status: status,
    message: message,
    dispenser_name: dispenser_name,
  })

  return axios.post(endpoint, body).then(res => res.data).catch(err => err.response.data[0])
}

export const fetchLockState = async () => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/lock-state/`

  return axios.get(endpoint).then(res => res.data).catch(err => err.response.data.error)
}

export const setLockState = async (lockState: boolean) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/lock-state/set/`
  const body = JSON.stringify({ is_locked: lockState })

  return axios.post(endpoint, body).then(res => res.data).catch(err => err.response.data.error)
}

export const setPinCode = async (pinCode: string) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/set-pin/`
  const body = JSON.stringify({ pin_code: pinCode })

  return axios.post(endpoint, body).then(res => res.data).catch(err => err.response.data.error)
}

export const verifyPinCode = async (pinCode: string) => {
  const endpoint = `${baseUrl}/api/dispenser/vending_machine/verify-pin/`
  const body = JSON.stringify({ pin_code: pinCode })

  return axios.post(endpoint, body).then(res => res.data).catch(err => err.response.data.error)
}
