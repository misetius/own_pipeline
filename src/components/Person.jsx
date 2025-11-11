const Person = (props) =>{
  console.log(props.deletePerson)
    
    return (
      <div>
      <p>{props.name} {props.number}</p>
      
      <button type="button" onClick={props.deletePerson}>Delete</button> 
    </div>
    )
  }



export default Person  