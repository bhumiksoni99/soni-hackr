import Layout from '../components/Layout';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {successMsg,errorMsg} from '../helpers/alerts'
import {API} from '../config';

const forgotPassword = () => {
    const [state,setState] = useState({
        email:'',
        error:'',
        success:'',
        buttonText:'Submit'  
    })

    const {email,buttonText,success,error} = state

    const handleChange = (name) => (event) => {
        setState({...state,[name]:event.target.value,error:'',success:'',buttonText:'Submit'})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setState({...state,buttonText:'Sending'})

        try{
            const res = await axios.put(`${API}/forgot`,{
                email
            })

            setState({
                ...state,
                email:'',
                buttonText:'Sent',
                success:res.data.message
            })
            
        }catch(e){
            setState({
                ...state,
                buttonText:'Submit',
                error:e.response.data.error
            })
        }
    }

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Password Reset</h1>
                <br></br> 
                <div style={{width:"125%"}}>
                    {success && successMsg(success)}
                    {error && errorMsg(error)}
                </div>
                <div className="form-group">
                    <input value={email} onChange={handleChange("email")} style={{height:"50px"}} type="email" className="form-control" placeholder="Enter Registered Email"/>
                </div>
                <div className="container" style={{marginTop:"10px"}}>
                    <button onClick={handleSubmit} className="btn btn-primary btn-lg offset-md-4" style={{opacity:0.8}}>{buttonText}</button>
                </div>  
            </div>
        </Layout>
    )
}

export default forgotPassword