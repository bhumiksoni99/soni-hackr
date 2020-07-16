import Layout from '../../components/Layout';
import axios from 'axios';
import {getCookie} from '../../helpers/auth';
import {API} from '../../config';
import withUser from '../withUser';
import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import { successMsg } from '../../helpers/alerts';

const User = ({user,token,links}) => {

    const[allLinks,setLinks] = useState(links)
    const[success,setSuccess] = useState('')
    const[error,setError] = useState('')

    const confirmDelete = (event,id) => {
        event.preventDefault()
        let answer = window.confirm('Are you sure you want to delete?')
        if(answer){
            handleDelete(id)
        }
    }

    const loadLinks = async () => {
        try{
            const res = await axios.get(`${API}/user`,{
                headers:{
                    authorization:`Bearer ${token}`
                }
            })
            setLinks(res.data.links)
            setSuccess('')
        }catch(e){
            setError(e.response.data.error)
        }
    }

    const handleDelete = async (id) => {
        try{
            const res = await axios.delete(`${API}/link/${id}`,{
                headers:{
                    authorization:`Bearer ${token}`
                }
            })
            setSuccess(res.data.message)
            loadLinks()
        }catch(e){
            setError(e.response.data.error)
        }
    }

    const showlinks = () =>
        allLinks.map((link,i) => (
            <div key={i} className="row alert p-2 m-2" style={{border:'1px solid #333',backgroundColor:'#B3D7FF'}}>
            <div className="col-md-8">
                <a href={link.url} target="_blank">
                    <h5 className="text-dark pt-2">{link.title}</h5>
                    <h6 className="text-primary pt-2">{link.url}</h6>
                </a>
            </div>
            <div className="col-md-4 pt-2">
                <span className="pull-right">{moment(link.createdAt).fromNow()} by <em>{link.postedBy.name}</em></span>
                <br/>
                <span className="badge text-secondary ml-auto">{link.clicks} Clicks</span>
            </div>
            <div className="col-md-12 pt-2" style={{fontSize:'18px'}}>
                <span className="text-dark badge pl-2">{link.medium}</span>
                <span className="text-dark badge pl-2">{link.type}</span>
                {link.category.map((c,i) => (
                    <span key={i} className="text-success badge pl-2">{c.name}</span>
                ))}
                <Link href={`/user/link/${link._id}`}>
                    <span className="text-warning badge pl-2" style={{cursor:'pointer'}}>
                        Update
                    </span>
                </Link>
                <span onClick={(e) => confirmDelete(e,link._id)} className="text-danger badge pl-2" style={{cursor:'pointer'}}>
                    Delete
                </span>
            </div>
        </div>

        ))

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1>{user.name}'s DashBoard</h1>
                </div>
                <hr/>
                <br/>
                <div className="row">
                   <div className="col-md-4">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a href='links/create' className="nav-item" style={{textDecoration:'none'}}>Create A Link</a>
                        </li>
                        <br/>
                        <li className="nav-item">
                            <Link href='/user/profile/update'>
                                <a className="nav-item" style={{textDecoration:'none'}}>Update Your Profile</a>
                            </Link>
                        </li>
                    </ul>
                    </div>
                    <div className="col-md-8">
                        <h5>Your Links</h5>
                        <hr/>
                        {success && successMsg(success)}
                        <br/>
                        {showlinks()}
                    </div>
                </div>
            </div>
        </Layout>
    )
} 


export default withUser(User)