import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { useState} from 'react';
import axios from 'axios';
import {API} from '../../../config';
import {successMsg,errorMsg} from '../../../helpers/alerts';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'),{ssr:false})                 //as getInitialprops runs in ssr therefore dynamic import
import 'react-quill/dist/quill.bubble.css';

const Create = ({token}) => {

    const [state,setState] = useState({
        name:'',
        error:'',
        buttonText:'Create',
        image:''
    })

    const[success,setSuccess] = useState('')
    const [content,setContent] = useState('')

    const [imageUploadText,setImageText] = useState('Upload Image')

    const {name,error,buttonText,image} = state

    const handleChange = (name) => (event) => {
        setState({...state,[name]:event.target.value,error:'',buttonText:'Create'})
        setSuccess('')
    }

    const handleContent = (event) => {
        setContent(event)
        setState({...state,sucess:'',error:''})
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
                        error:''
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
            buttonText:'Creating'
        })

        try{
            const res = await axios.post(`${API}/category`,{
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
                content:'',
                buttonText:'Created!',
            })

            setSuccess(res.data.message)
            setImageText('Uploaded!')
            setContent('')

        }catch(e){
            setState({
                ...state,
                buttonText:'Create',
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
                        Create Category
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

export default withAdmin(Create)
