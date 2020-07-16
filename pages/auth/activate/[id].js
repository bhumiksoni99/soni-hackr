import {withRouter} from 'next/router';
import {useState,useEffect } from 'react';      //useeffect is the hooks substitute to componentDidMount() and componentDidUnmount in react
                                                //useEffect is called both at mount and unmount
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {API} from '../../../config';
import {successMsg,errorMsg} from '../../../helpers/alerts';
import Layout from '../../../components/Layout';

const ActivateAccount = ({router}) => {         //router is prop available with withRouter
    const [state,setState] = useState({
        name:'',
        token:'',
        buttonText:'Activate Account',
        error:'',
        success:''
    })

    const {name,token,buttonText,error,success} = state

    useEffect(() => {
        let token = router.query.id
        if(token){
            const {name} = jwt.decode(token)
            setState({...state,name,token})
        }
    },[router])     //passing router means that anytime the router changes we need to run useEffect

    const clickSubmit = async (event) => {
        event.preventDefault()
        setState({
            ...state,
            buttonText:'Please Wait...'
        })
        
        try{
            const res = await axios.post(`${API}/register/activate`,{token})
            setState({
                ...state,
                name:'',
                token:'',
                buttonText:'Activated! Login to your Account',
                error:'',
                success:res.data.message
            })
        }catch(e){
            setState({
                ...state,
                buttonText:'Activate Account',
                error:e.response.data.error
            })
        }
    }
return (
    <Layout>
        <div className="container">
            <div className="jumbotron">
                <h1>Hey {name}</h1>
                <h3>Click on the button below to below to activate your Account.</h3>
            </div>
            <div style={{width:'125%'}}>
                {success && successMsg(success)}
                {error && errorMsg(error)}
            </div>
            <br></br>
        </div>
        <div className="container">
            <button onClick={clickSubmit} className="btn btn-primary btn-lg btn-block offset-md-2" style={{opacity:0.8,width:"66%",height:'60px'}}>{buttonText}</button>
        </div>
    </Layout>
)
}

export default withRouter(ActivateAccount)

//any file which is saved as [].js is used to render a dynamic page