import axios from 'axios'

export const fetchVendingMachineAppearance = async () => {
  const endpoint = '/api/vending-machine-appearance'

  return axios.get(endpoint).then(res => res.data)
}
