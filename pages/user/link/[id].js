import Layout from '../../../components/Layout';
import axios from 'axios';
import {API} from '../../../config';
import {useEffect,useState} from 'react';
import {successMsg,errorMsg} from '../../../helpers/alerts';
import withUser from '../../withUser';
import './styles.css';
import {isAuth} from '../../../helpers/auth';

const updateLink = ({token,linkCategories,linkTitle,linkUrl,linkmedium,linktype,query}) => {

    const [state,setState] = useState({
        title:linkTitle,
        url:linkUrl,
        categories:linkCategories,
        allCategories:[],
        success:'',
        error:'',
        type:linktype,
        medium:linkmedium,
        buttonText:'Update'
    })

    const {title,url,categories,allCategories,success,error,type,medium,buttonText} = state
    
    useEffect(() => {
        LoadallCategories()
    },[success])


    const LoadallCategories = async () => {
        const res = await axios.get(`${API}/categories`)

        setState({
            ...state,
            allCategories:res.data
        })
    }


    const handeSubmit = async (event) => {
        event.preventDefault()
        setState({...state,buttonText:'Uploading...'})
        const id = query.id

        let serverLink
        if(isAuth().role === 'admin'){
            serverLink = `${API}/admin/link/${id}`
        }
        else{
            serverLink = `${API}/link/${id}`
        }

        try{
        const res = await axios.put(serverLink,{
            title,
            url,
            categories,
            type,
            medium           
        },{
            headers:{
                authorization:`Bearer ${token}`
            }
        })

        setState({
            ...state,
            title:'',
            url:'',
            buttonText:'Updated!',
            type:'',
            categories:[],
            allCategories:[],
            medium:'',
            error:'',
            success:res.data.message
        })
    }catch(e){
        setState({
            ...state,
            error:e.response.data.error
        })
    }
    }

    const handleChange= (name) => (event) => {
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

    const handleTypeClick = (event) => {
        setState({...state,success:'',error:'',type:event.target.value})
    }

    const handleMediumClick = (event) => {
        setState({...state,success:'',error:'',medium:event.target.value})
    }

    const showTypes = () => (
        <>
            <div className="form-check pl-5">
                <label className="form-check-label">
                    <input type="radio" onClick={handleTypeClick} className="form-check-input" checked={type==="Free"} value="Free" name="type"/>
                Free</label>
                <br/>
                <label className="form-check-label">
                    <input type="radio" onClick={handleTypeClick} className="form-check-input" checked={type==="Paid"} value="Paid" name="type"/>
                Paid</label>
            </div>
        </>
    )

    const showMedium = () => (
        <>
            <div className="form-check pl-5">
                <label className="form-check-label">
                    <input type="radio" onClick={handleMediumClick} className="form-check-input" checked={medium==="Book"} value="Book" name="medium"/>
                Book</label>
                <br/>
                <label className="form-check-label">
                    <input type="radio" onClick={handleMediumClick} className="form-check-input" checked={ medium==="Video"} value="Video" name="medium"/>
                Video</label>
            </div>
        </>
    )

    const showCategories = () => {
        return allCategories && allCategories.map((c,i) => (
            <li className="list-unstyled" key={i}> 
                <input type="checkbox" checked={categories.includes(c._id)} onChange={handleToggle(c._id)}  className="mr-2"/>
                <label className="form-check-label">{c.name}</label>
            </li>
        ))
    }
    


    const linkForm = () => (
        <form onSubmit={handeSubmit}>
        <div className="form-group">
            <label className="text-muted">Title</label>
            <input value={title} onChange={handleChange("title")} type="text" className="form-control" placeholder="Enter Title"/>
        </div>
        <div className="form-group">
            <label className="text-muted">URL</label>
            <input value={url} onChange={handleChange("url")} type="text" className="form-control" placeholder="Enter Url"/>
        </div>
        <br/>
        <div className="form-group">
            <button className="btn btn-primary btn-block" style={{width:'20%',"opacity":0.8}}>{buttonText}</button>
        </div>
    </form>
    )


    return (
        <Layout>
            <div className="container">
                <h1>Update Link</h1>
                <br/><br/>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="text-muted">Category</label>
                            <ul style={{maxHeight:'100px',overflowY:'scroll'}}>
                                {showCategories()}
                            </ul>
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Type</label>
                            {showTypes()}
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Medium</label>
                            {showMedium()}
                        </div>
                    </div>
                    <div className="col-md-6 offset-md-1">
                        <div style={{width:"125%"}}>
                            {success && successMsg(success)}
                            {error && errorMsg(error)}  
                        </div>
                            {linkForm()}
                        </div>
                </div>
            </div>
        </Layout>
    )
}

updateLink.getInitialProps = async (context) => {
    const id = context.query.id
    const res = await axios.get(`${API}/link/one/${id}`)

    return {
        linkTitle:res.data.title,
        linkUrl:res.data.url,
        linktype:res.data.type,
        linkmedium:res.data.medium,
        linkCategories:res.data.category,
        query:context.query
    }
}

export default withUser(updateLink)