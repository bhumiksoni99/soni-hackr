import {withRouter} from 'next/router';
import {useState,useEffect } from 'react';      //useeffect is the hooks substitute to componentDidMount() and componentDidUnmount in react
                                                //useEffect is called both at mount and unmount
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {API} from '../../../../config';
import {successMsg,errorMsg} from '../../../../helpers/alerts';
import Layout from '../../../../components/Layout';

const resetPassword = ({router}) => {
    const [state,setState] = useState({
        name:'',
        token:'',
        newPassword:'',
        buttonText:'Reset Password',
        error:'',
        success:''
    })

    const {name,token,buttonText,error,success,newPassword} = state

    useEffect(() => {
        let token = router.query.token
        const data = jwt.decode(token)
        if(token){
            setState({...state,name:data.name,token})
        }
    },[router])

    const handleChange = (name) => (event) => {
        setState({...state,[name]:event.target.value,error:'',success:'',buttonText:'Reset Password'})
    }

    const clickSubmit = async (event) => {
        event.preventDefault()
        setState({
            ...state,
            buttonText:'Please Wait...'
        })
        
        try{
            const res = await axios.put(`${API}/reset`,{token,newPassword})
            setState({
                ...state,
                name:'',
                token:'',
                buttonText:'Updated.',
                error:'',
                success:res.data.message
            })
        }catch(e){
            setState({
                ...state,
                buttonText:'Reset Password',
                error:e.response.data.error
            })
        }
    }
return (
    <Layout>
        <div className="container">
            <div className="jumbotron">
                <h1>Hey {name}!</h1>
                <h3>Enter the new Password.</h3>
            </div>
            <div style={{width:'125%'}}>
                {success && successMsg(success)}
                {error && errorMsg(error)}
            </div>
            <br></br>
            <div className="form-group">
                <input value={newPassword} onChange={handleChange("newPassword")} style={{height:"50px",width:"50%",margin:"0 auto"}} type="password" className="form-control" placeholder="Enter New Password"/>
            </div>
                <button onClick={clickSubmit} className="btn btn-primary btn-lg offset-md-5" style={{opacity:0.8,height:'50px',marginTop:'10px'}}>{buttonText}</button>
        </div>
    </Layout>
)
}

export default withRouter(resetPassword)
