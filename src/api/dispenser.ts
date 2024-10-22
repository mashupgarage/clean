import axios from 'axios'

// Vending Machine
export const fetchVendingMachineAppearance = async () => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/vending-machine-appearance'

  return axios.get(endpoint).then(res => res.data)
}

export const fetchVendingMachineStatus = async () => {
  const endpoint = 'http://127.0.0.1:8000/api/dispenser/vending_machine/status'

  return axios.get(endpoint).then(res => res.data)
}
