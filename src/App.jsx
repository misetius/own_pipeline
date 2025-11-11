import { use, useEffect, useState } from 'react'
import Person from './components/Person'
import personsService from './services/persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import Error from './components/Error'



const App = () => {

  const [newNumber, setNewNumber] = useState('')
  const [newName, setNewName] = useState('')
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFP] = useState(persons)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)


  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
        setFP(response.data)
        console.log(response.data)
      })
  }, [])



//Add person function  or change phonenumber
  const addPerson = (event) => {
    event.preventDefault()

    const names = persons.map(person => person.name)
    
    if (names.includes(newName)){
      if (window.confirm(`${newName} already exists. Do you want to change the phonenumber of the person?`)){
        const specificPerson = persons.find((p) => p.name === newName)
        const changedPerson = {...specificPerson, number: newNumber}
        personsService
          .changePersonNumber(specificPerson.id, changedPerson)
          .then(response => {
                  setPersons(persons.map((person) => (person.id !== specificPerson.id ? person : response)))
                  setFP(persons.map((person) => (person.id !== specificPerson.id ? person : response)))
                  console.log(response)
                  setMessage(`Number changed for '${specificPerson.name}'`)
                  setTimeout(() => {
                    setMessage(null)
                  }, 2000)
          })
      }
      return 
    }

    const personObject = {name: newName, number:newNumber} 
    personsService
      .sendPersonData(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setFP(persons.concat(response.data))
        console.log(response)
        setMessage(`'${personObject.name}' added`)
                  setTimeout(() => {
                    setMessage(null)
                  }, 2000)

      })
      .catch(error => {
                  const errorMessage = error.response.data 
                  setError(`${errorMessage.error}`)
                  console.log(errorMessage.error)
                  setTimeout(() => {
                    setError(null)
                  }, 2000)

      })


  }



//Delete person function
  const deletePersonFrom = (id) => {
    const person = persons.filter(p => p.id === id)
    console.log(person)
    if (window.confirm(`Delete ${person[0].name}?`)){
    console.log(persons)
    const newPersons = persons.filter(p => p.id !== id);
    setPersons(newPersons)
    setFP(newPersons)
  
    console.log(newPersons)

    personsService
      .deletePerson(id)
      .then(response => {
        console.log(response)
        setMessage(`'${person[0].name}' deleted`)
        setTimeout(() => {
            setMessage(null)
        }, 2000)

      })
  }

}

//Save input to new name variable for submit
  const handlePersonChange = (event) =>{
    setNewName(event.target.value)
  }


  
//Save input to new number variable for submit
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }


  //Filter persons when input is given to the
  const filterPersons = (event) => {
    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setFP(personsToShow)
  }

  return (
    <div>
      <Error message={error} />
      <Notification message={message} />
      <h2>Phonebook</h2>
      <div>
        <Filter onChange={filterPersons} />
</div>
      <h2>Add a new</h2>

      <PersonForm handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange} addPerson={addPerson} newName={newName} newNumber={newNumber}/>


      <h2>Numbers</h2>
              <div>
      {filteredPersons.map(person => 
        <Person key={person.name}  name={person.name} number={person.number} id={person.id} deletePerson={() => deletePersonFrom(person.id)}/>
      )}   
      </div>  
        
    </div>
  )
}

const Filter = (props) => {

    return(
        <div>filter shown with <input onChange={props.onChange}></input></div>
    )

}



export default App
