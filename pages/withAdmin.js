//this page is to prevent access to the pages which they should not be able to access 
//for eg. not logged in or access to admin page
import axios from 'axios';
import {API} from '../config';
import {getCookie} from '../helpers/auth';

const withAdmin = (Page) => {
    const withAuthAdmin = props => <Page {...props}/>            //return the page with props
    withAuthAdmin.getInitialProps = async (context) => {
        const token = getCookie('token',context.req)
        let admin = null
        let links = null
        if(token){
        try{
            const res = await axios.get(`${API}/admin`,{
                headers:{
                    authorization:`Bearer ${token}`,
                    contentType:`application/json`
                }
            })
            admin = res.data.user
            links = res.data.links
        }catch(e){
            if(e.response.status === 401){
               admin = null
            }
        }
    }

    if(admin === null){
        //redirect on server side
        context.res.writeHead('302',{
            Location:'/'
        })
        context.res.end()
    }else{
        return {
            ...(Page.getInitialProps? await Page.getInitialProps(context):{}),
            admin,
            token,
            links
        }
    }
    }
    return withAuthAdmin
}

export default withAdmin