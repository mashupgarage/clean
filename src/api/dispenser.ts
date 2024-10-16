import axios from 'axios'
import queryString from 'query-string'

// Vending Machine Appearance
export const fetchVendingMachineAppearance = async () => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/vending-machine-appearance'

  return axios.get(endpoint).then(res => res.data)
}

// Dispenser Functions
export const fetchDispenserTest = async () => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/test-mock'

  return axios.get(endpoint).then(res => res.data)
}

export const checkCupPresence = async (
  dispenserName: string
) =>{
  const param = queryString.stringify(
    { dispenser_name: dispenserName }
  )
  const endpoint = `http://127.0.0.1:8000/api/dispenser/check-cup-presence-mock?${param}`

  return axios.get(endpoint).then(res => res.data)
}

export const startDrinkDispensing = async (
  dispenserName: string,
  drinkSize: string
) => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/start-drink-dispensing-mock'

  return axios.post(endpoint, {
    dispenser_name: dispenserName,
    drink_size: drinkSize
  }).then(res => res.data)
}

export const stopDrinkDispensing = async (
  dispenserName: string
) => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/stop-drink-dispensing-mock'

  return axios.post(endpoint, {
    dispenser_name: dispenserName
  }).then(res => res.data)
}
