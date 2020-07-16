import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import {successMsg,errorMsg} from '../../../helpers/alerts'
import './styles.css';

const Categories = ({admin,token}) => {

    const [state,setState] = useState({
        categories:[],
        error:'',
        success:''
    })

    const {categories,error,success} = state

useEffect(() => {
    loadCategories()
},[])

const loadCategories = async () => {
    const res = await axios.get(`${API}/categories`)
    setState({
        ...state,
        categories:res.data
    })
}

const confirmDelete = (event,slug) => {
    event.preventDefault()
    let answer = window.confirm('Are you sure you want to delete?')
    if(answer){
        handleDelete(slug)
    }
}

const handleDelete = async (slug) => {
    try{
        const res = await axios.delete(`${API}/category/${slug}`,{
            headers:{
                authorization:`Bearer ${token}`
            }
        })
        setState({
            ...state,
            error:'',
            success:res.data.message
        })
        loadCategories()
    }catch(e){
        setState({
            ...state,
            error:e.response.data.error
        })
    }
}


 const showCategories = () => 
    categories.map((c,i) => (
    <Link href ={`/links/${c.slug}`}>
        <a className="row alert alert-light m-2 p2" style={{border:'1px solid #333',textDecoration:'none'}}>
            <div className="col-md-4 text-center">
                   <img src={c.image.url} height="100px" width="auto"/>
               </div>
               <div className="col-md-2 text-center" style={{fontSize:'20px'}}>
                    {c.name}
               </div>
               <div className="col-md-2 offset-md-4 text-center">
                   <Link href ={`/admin/category/${c.slug}`}>
                        <button className="btn btn-warning mt-2">Update</button>
                    </Link>
                    <br/>
                <button className="btn btn-danger mt-2" onClick={(e) => confirmDelete(e,c.slug)}>Delete</button>
            </div>
        </a>
        </Link>
    ))

return (
    <Layout>
        <div className="container">
            <h1>Categories By You</h1>
            <br/>
            {success && successMsg(success)}
            {error && errorMsg(error)}
            <div className="row mt-2">
                <div className="col-md-8">
                    {showCategories()}
                </div>
            </div>
        </div>
    </Layout>
)
}

export default withAdmin(Categories)
