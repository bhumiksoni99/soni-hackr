import Layout from '../components/Layout';
import Link from 'next/link';
import {useState,useEffect} from 'react';
import axios from 'axios';
import Router from 'next/router'
import {successMsg,errorMsg} from '../helpers/alerts'
import {API} from '../config';
import {authenticate,isAuth} from '../helpers/auth';
import './styles.css'

const Login = () => {
    
    const [state,setState] = useState({         //state is the var name that stores state values and setState is funtion used to set the value
        email:'bhumiksoni009@gmail.com',
        password:'bhumiksoni',
        error:'',
        buttonText:'Login',
        token:''
    })

    //if logged in redirect to home
    useEffect(() =>{
        const ifLoggedIn = isAuth()
        if(ifLoggedIn){
            Router.push('/')
        }
    },[])

    const {email,password,buttonText,success,error} = state

    const handleChange = (name) => (event) => {
        setState({...state,[name]:event.target.value,error:'',success:'',buttonText:'Login'})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try{
            const res = await axios.post(`${API}/login`,{
                email,
                password
            })
            authenticate(res,() => {        //redirect to homepage after successful login
                const loggedIn = isAuth()
                if(loggedIn){
                    if(loggedIn.role === 'admin'){
                        Router.push('/admin')
                    }
                    else{
                        Router.push('/user')
                    }
                }
            })  
        }catch(e){
            setState({
                ...state,
                buttonText:'Login',
                error:e.response.data.error
            })
        }
    }
    
    const LoginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={email} onChange={handleChange("email")} type="email" className="form-control" placeholder="Enter Email"/>
            </div>
            <div className="form-group">
                <input value={password} onChange={handleChange("password")} type="password" className="form-control" placeholder="Enter Password"/>
            </div>
            <div className="form-group">
                <button className="btn btn-primary" style={{"width":"100%","opacity":0.8}}>{buttonText}</button>
            </div>
        </form>
    )

    return (
        <Layout>
            <div className="col-sm-6 offset-sm-3">
                <h1>Login</h1>
                <br></br> 
                {success && successMsg(success)}
                {error && errorMsg(error)}
                <div>
                    {LoginForm()}
                    <Link href="/forgot">
                        <a className="offset-sm-4" style={{color:'red'}}>Forgot Password?</a>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export default Login