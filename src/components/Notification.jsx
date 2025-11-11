const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="gooderror">
      {message}
    </div>
  )
}

export default Notification