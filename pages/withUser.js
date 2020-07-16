//this page is to prevent access to the pages which they should not be able to access 
//for eg. not logged in or access to admin page
import axios from 'axios';
import {API} from '../config';
import {getCookie} from '../helpers/auth';

const withUser = (Page) => {
    const withAuthUser = props => <Page {...props}/>            //return the page with props
    withAuthUser.getInitialProps = async (context) => {
        const token = getCookie('token',context.req)
        let user = null
        let links = null
        if(token){
        try{
            const res = await axios.get(`${API}/user`,{
                headers:{
                    authorization:`Bearer ${token}`,
                    contentType:`application/json`
                }
            })
            user = res.data.user
            links = res.data.links
        }catch(e){
            if(e.response.status === 401){
               user = null
            }
        }
    }

    if(user === null){
        //redirect on server side
        context.res.writeHead('302',{
            Location:'/'
        })
        context.res.end()
    }else{
        return {
            ...(Page.getInitialProps? await Page.getInitialProps(context):{}),
            user,
            links,
            token
        }
    }
    }
    return withAuthUser
}

export default withUser