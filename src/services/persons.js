import axios from 'axios'
//const baseUrl = 'http://localhost:5173/api/persons'
const baseUrl = '/api/persons'



const getAll = () => {
    return axios.get(baseUrl)
}
const sendPersonData = (personObject) => {
    return axios.post(baseUrl, personObject)

}
const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}
const changePersonNumber = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}


export default { 
  getAll: getAll,
  sendPersonData: sendPersonData,
  deletePerson: deletePerson,
  changePersonNumber: changePersonNumber
}