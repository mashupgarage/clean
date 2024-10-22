import axios from 'axios'
import queryString from 'query-string'

// Vending Machine
export const selectVendingMachine = async (name: string) => {
  const params = queryString.stringify({ name })
  const endpoint = `http://127.0.0.1:8000/api/dispenser/select-vm?${params}`

  return axios.get(endpoint).then(res => res.data)
}

export const fetchVendingMachineAppearance = async () => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/vending-machine-appearance'

  return axios.get(endpoint).then(res => res.data)
}

export const fetchVendingMachineStatus = async () => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/vending_machine/status'

  return axios.get(endpoint).then(res => res.data)
}

export const getLockState = async () => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/vending_machine/lock-state/'

  return axios.get(endpoint).then(res => res.data)
}
