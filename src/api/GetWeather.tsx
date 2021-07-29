import axios from 'axios'

/**
 * Responsible to create the axios instance with basic parameters.
 */
const ApiService = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5'
})

export default ApiService;