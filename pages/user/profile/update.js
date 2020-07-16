import Layout from '../../../components/Layout'
import Link from 'next/link';
import Router from 'next/router';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {successMsg,errorMsg} from '../../../helpers/alerts'
import {updateUser} from '../../../helpers/auth';
import {API} from '../../../config';
import '../link/styles.css'
import withUser from '../../withUser'

const Update = ({user,token}) => {
    const [state,setState] = useState({         //state is the var name that stores state values and setState is funtion used to set the value
        name:user.name,
        email:user.email,
        password:'',
        error:'',
        success:'',
        buttonText:'Update',
        categories:user.categories,
        allCategories:[]
    })

    const {name,email,password,buttonText,success,error,allCategories,categories} = state

    useEffect(() => {
        LoadallCategories()
    },[])


    const LoadallCategories = async () => {
        const res = await axios.get(`${API}/categories`)

        setState({
            ...state,
            allCategories:res.data
        })
    }

  
    const handleChange = (name) => (event) => {
        setState({...state,[name]:event.target.value,error:'',success:'',buttonText:'Update'})
    }

    const handleToggle = (categoryId) => () => {
        const clicked = categories.indexOf(categoryId)          //if this categoryId exists indexOf will return index if not it returns -1
        const all = [...categories]
        if(clicked === -1){
            all.push(categoryId)
        }else{
            all.splice(clicked,1)
        }

        setState({...state,categories:all,success:'',error:''})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setState({...state,buttonText:'Updating'})
        
        try {
            const res =  await axios.put(`${API}/user/update`,{
                name,
                email,
                password,
                categories
            },{
                headers:{
                    authorization:`Bearer ${token}`
                }
            })

            updateUser(res.data.updated,() => {
                setState({
                    ...state,
                    name:'',
                    email:'',
                    password:'',
                    categories:[],
                    buttonText:'Updated!',
                    success:res.data.message
                })
            })
        }catch(e){
            console.log(e)
            setState({
                ...state,
                buttonText:'Update',
                error:e.response.data.error
            })
        }
    }

    const showCategories = () => {
        return allCategories && allCategories.map((c,i) => (
            <li className="list-unstyled" key={i}> 
                <input type="checkbox" checked={categories.includes(c._id)} onChange={handleToggle(c._id)} className="mr-2"/>
                <label className="form-check-label">{c.name}</label>
            </li>
        ))
    }
    
    const updateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={name} onChange={handleChange("name")} type="text" className="form-control" placeholder="Enter Name"/>
            </div>
            <div className="form-group">
                <input  value={email} onChange={handleChange("email") }type="email" className="form-control" placeholder="Enter Email" disabled/>
            </div>
            <div className="form-group">
                <label className="text-muted">Category</label>
                    <ul style={{maxHeight:'100px',overflowY:'scroll'}}>
                        {showCategories()}
                    </ul>
            </div>
            
            <div className="form-group">
                <input  value={password} onChange={handleChange("password")} type="password" className="form-control" placeholder="Password will remain the same if this field is left empty!"/>
            </div>
            <div className="form-group">
                <button className="btn btn-primary" style={{"width":"100%","opacity":0.8}}>{buttonText}</button>
            </div>
        </form>
    )

    return (
    <Layout>
        <div className="col-sm-6 offset-sm-3">
            <h1>Update Profile</h1>
            <br></br> 
            {success && successMsg(success)}
            {error && errorMsg(error)}
            <div>
                {updateForm()}
            </div>
        </div>
    </Layout>
    )
}


export default withUser(Update)