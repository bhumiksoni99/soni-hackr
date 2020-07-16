import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { useState } from 'react';
import axios from 'axios';
import Route from 'next/router'
import {API} from '../../../config';
import {successMsg,errorMsg} from '../../../helpers/alerts';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'),{ssr:false})                 //as getInitialprops runs in ssr therefore dynamic import
import 'react-quill/dist/quill.bubble.css';

const UpDate = ({token,categoryContent,categoryName,categoryImage,query}) => {

    const [state,setState] = useState({
        name:categoryName,
        error:'',
        buttonText:'Update',
        imagePreview:categoryImage,
        image:''
    })

    const[success,setSuccess] = useState('')
    const [content,setContent] = useState(categoryContent)

    const [imageUploadText,setImageText] = useState('Change Image')

    const {name,error,buttonText,image,imagePreview} = state

    const handleChange = (name) => (event) => {
        setState({...state,[name]:event.target.value,error:'',buttonText:'Update'})
        setSuccess('')
    }

    const handleContent = (event) => {
        setContent(event)
        setState({...state,success:'',error:''})
    }
    
    const handleImage = (event) => {
        let fileInput = false
        if(event.target.files[0]) {
            fileInput = true
        }
        setImageText(event.target.files[0].name)
        if(fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0],
                300,
                300,
                'PNG',
                100,
                0,
                uri => {
                    setState({
                        ...state,
                        image:uri,
                        imagePreview:uri,
                        error:'',
                    })
                    setSuccess('')
                },
                'base64'
            );
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setState({
            ...state,
            buttonText:'Updating...'
        })

        try{
            const res = await axios.put(`${API}/category/${query.slug}`,{
                name,
                content,
                image
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }) 
        
            setState({
                ...state,
                name:'',
                image:'',
                content:'',
                imagePreview:'',
                buttonText:'Updated!'
                
            })

            setSuccess(res.data.message)
            setImageText('Uploaded!')
            setContent('')

            //Route.push('/')

        }catch(e){  
            setState({
                ...state,
                buttonText:'Update',
                error:e.response.data.error
            })
        }
    }

    const CategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input value={name} onChange={handleChange("name")} type="text" className="form-control" placeholder="Enter Name "/>
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                <ReactQuill value={content} onChange={handleContent} placeholder="Enter Description" className="pb-5 mb-3" theme="bubble" style={{border:'1px solid #DCDCDC'}}/>
            </div>
            { imagePreview && (
                <div className="form-group">
                    <label className="text-muted">Current Image</label>
                    <br/>
                    <div className="text-center">
                        <img src={imagePreview} height="200px" width="auto"/>
                    </div>
                </div>
            )}
            <div className="form-group">
                <label className="text-muted">Image</label>
                <label className="btn btn-outline-dark btn-block">
                    {imageUploadText}
                    <input onChange={handleImage} type="file" accept="image/* "className="form-control" hidden/>
                </label>
            </div>
            <div className="form-group">
                <button className="btn btn-primary btn-lg offset-md-3" style={{opacity:0.8,marginTop:"20px",width:"48%"}}>{buttonText}</button>
            </div>
        </form>
    )


    return (
        <Layout>
            <div className="row">
                <div className="col-md-5 offset-md-3">
                    <h1 style={{paddingBottom:"20px"}}>
                        Update Category
                        <br/>
                    </h1>
                    <div style={{width:"125%"}}>
                        { success && successMsg(success)}
                        { error && errorMsg(error)}
                    </div>
                    {CategoryForm()}
                </div>
            </div>
        </Layout>
    )
}

UpDate.getInitialProps = async (context) => {
    const slug = context.query.slug
    
    const response = await axios.get(`${API}/one/category/${slug}`)
    return {
        categoryName:response.data.name,
        categoryContent:response.data.content,
        query:context.query,
        categoryImage:response.data.image.url
    }
}

export default withAdmin(UpDate)
