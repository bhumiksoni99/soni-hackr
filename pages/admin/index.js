import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';
import Link from 'next/link'
import axios from 'axios';
import { API } from '../../config';
import moment from 'moment'
import {useEffect,useState} from 'react';
import InfiniteScroll from 'react-infinite-scroller';

const Admin = ({admin,token,AllLinks,totalLinks}) => {

    const[allLinks,setLinks] = useState(AllLinks)
    const[success,setSuccess] = useState('')
    const[error,setError] = useState('')
    const [state,setState] = useState({
        limit:5,
        skip:0,
        size:totalLinks
    })

    const {limit,skip,size} = state

    const confirmDelete = (event,id) => {
        event.preventDefault()
        let answer = window.confirm('Are you sure you want to delete?')
        if(answer){
            handleDelete(id)
        }
    }

    const loadLinks = async () => {
        try{
            const res = await axios.post(`${API}/links`)
            setLinks(res.data)
            setSuccess('')
        }catch(e){
            setError(e.response.data.error)
        }
    }

    const handleDelete = async (id) => {
        try{
            const res = await axios.delete(`${API}/admin/link/${id}`,{
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

    const loadMore = async() => {
        const toSkip = skip + limit
        const res = await axios.post(`${API}/links`,{
            skip:toSkip,
            limit
        })

        setLinks([...allLinks,...res.data])
        setState({
            ...state,
            size:res.data.length,
            skip:toSkip
        })
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
        <h1>Admin Page</h1>
        <hr/>
        <br/>
        <div className="row">
            <div className="col-md-4">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href='admin/category/create' className="nav-item" style={{textDecoration:'none'}}>Create Category</a>
                    </li>
                    <br/>
                    <li className="nav-item">
                        <Link href='admin/category/read'>
                            <a className="nav-item" style={{textDecoration:'none'}}>All Categories</a>
                        </Link>
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
                    <h3>All Links</h3>
                        <hr/>
                <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={size>0 && size>=limit}
                        loader=
                        {
                        <div className="text-center spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                      }
                      key={0}
                     >
                        {showlinks()}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    </Layout> 
    )
}

Admin.getInitialProps = async () => {
    const res = await axios.post(`${API}/links`,{
        limit:5,
        skip:0
    })

    return {
        AllLinks:res.data,
        totalLinks:res.data.length
    }
}

export default withAdmin(Admin)