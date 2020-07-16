const successMsg = success => {
    return (
    <div class="alert alert-success" style={{height:'60px',width:'80%'}}>
        {success}
    </div>
    )}

const errorMsg = error => {
    return (
    <div class="alert alert-danger" style={{height:'60px',width:'80%'}}>
        {error}
    </div>
)}

export {
    successMsg,
    errorMsg
}