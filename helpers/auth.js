import cookie from 'js-cookie';
import  Router  from 'next/router';

//set cookie
export const setCookie = (key,value) => {
    if(process.browser){                //this code will run only in client side
        cookie.set(key,value,{
            expires:1
        })
    }
}

//remove cookie
export const removeCookie = (key) => {
    if(process.browser){                //this code will run only in client side
        cookie.remove(key)
    }
}

//get cookie - will be used when we make request to server with auth token
export const getCookie = (key,req) => {
    if(process.browser){
        return cookie.get(key)
    }
    else{
        return getCookiefromServer(key,req)
    }
}

//since getInitalProps from works on server side we need to get token from server
export const getCookiefromServer = (key,req) => {
    if(!req.headers.cookie){
        return undefined
    }

    let token = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${key}=`))
    if(!token){
        return undefined
    }

    let tokenValue = token.split('=')[1]
    return tokenValue
}

//set in localstorage
export const setLocalStorage = (key,value) => {
    if(process.browser){
        localStorage.setItem(key,JSON.stringify(value))
    }
}

//remove localstorage
export const removeLocalStorage = (key) => {
    if(process.browser){
        localStorage.removeItem(key)
    }
}

//authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (res,next) => {
    setCookie('token',res.data.token)
    setLocalStorage('user',res.data.user)
    next();
}

//access user info from localStorage
export const isAuth = () => {
    if(process.browser){
        const cookieExists = cookie.get('token')
        if(cookieExists){
            if(localStorage.getItem('user')){       
                return JSON.parse(localStorage.getItem('user'))
            }else{
                return false;
        }
        }
    }
}

//update user info after profile update
export const updateUser = (user,next) => {
    if(process.browser){
        if(localStorage.getItem('user')){
            let auth = JSON.parse(localStorage.getItem('user'))
            auth = user
            localStorage.setItem('user',JSON.stringify(auth))
            next()
        }
    }
}


export const logout = () => {
    removeCookie('token')
    removeLocalStorage('user')
    Router.push('/login')
}