import Layout from '../components/Layout';
import axios from 'axios';
import {API} from '../config';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import moment from 'moment'

const Home = ({categories}) => { 

    const [allLinks,setAllLinks] = useState([])

    useEffect(() => {
        loadLinks()
    },[])

    const loadLinks = async() => {
        const res = await axios.get(`${API}/link/trending`)
        setAllLinks(res.data)
    }

    const clickCount = async (id) => {
        await axios.put(`${API}/click-count`,{id})
        loadLinks()
    }

    const ListofLinks = () => 
    allLinks.map((link,i) => (
        <div key={i} className="row alert p-2 m-2" style={{border:'1px solid #333',backgroundColor:'#B3D7FF'}}>
            <div className="col-md-8" onClick={() => clickCount(link._id)}>
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
            </div>
        </div>
    )
)

    const listCategories = () => 
        categories.map((c,i) => (
            <Link href={`/links/${c.slug}`}>
                <a style={{border:'1px solid #D3D3D3',textDecoration:'none',marginRight:30,marginBottom:20,borderRadius:'5px'}} className="bg-light p-4 col-md-3" >
                    <div>
                        <div className="row">
                            <div className="col-md-4">
                                <img src={c.image.url} alt={c.name} width="60px" height="40px" />
                            </div>
                            <div className="col-md-8">
                                <h5>
                                {c.name}
                                </h5>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        )
        )
    
    return (
    <Layout>
        <div className="row">
            <div className="col-md-12">
                <h1 className="font-weight-bold">
                    Categories
                </h1>
            </div>
        </div>
        <br/>
        <br/>
        <div className="row offset-md-2">
            {listCategories()}
        </div>
        <div className="row mt-4">
            <h1 className="font-weight-bold">
                Trending
            </h1>
            <br/>
            <div className="col-md-12 overflow-hidden mt-4">
                {allLinks && ListofLinks()}
            </div>
        </div>
    </Layout>
    )
}

Home.getInitialProps = async () => {
     const res = await axios.get(`${API}/categories`)
     return {
        categories:res.data                 //this will be available as props
     }
}

export default Home