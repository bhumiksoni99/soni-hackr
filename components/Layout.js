import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import {isAuth,logout} from '../helpers/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'        //by default directory searched is node_modules ,so no need to specify

NProgress.configure({ easing: 'ease', speed: 500 ,withSpinner:false});

Router.onRouteChangeStart = (url) => NProgress.start()
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (err, url) => NProgress.done();

const Layout = ({children}) => {
    const Head = () => (
        <React.Fragment>
            <link 
                rel="stylesheet" 
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" 
                integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" 
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/static/styles.css"/>
        </React.Fragment>
    )
    const header = () => (
        <div>
            <ul className="nav nav-tabs bg-primary" style={{padding:10,opacity:0.8}}>
                <li className="nav-item">
                    <Link href="/">
                        <a className="nav-link text-light">
                            Home
                        </a>
                    </Link>
                </li>
                {
                    !isAuth() && (
                    <>
                    <li className="nav-item ml-auto">
                        <Link href="/login">
                            <a className="nav-link text-light">
                                Login
                            </a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/register">
                            <a className="nav-link text-light">
                                Register
                            </a>
                        </Link>
                    </li>
                    </>
                    )
                }
                {
                    isAuth() && (
                    <li className="nav-item">
                        <Link href="/links/create">
                            <a className="nav-link text-light" style={{'fontWeight':'bold'}}>
                                Create A Link
                            </a>
                        </Link>
                    </li>
                    )
                }
                {
                    isAuth() && isAuth().role === 'admin' && (
                        <li className="nav-item ml-auto">
                            <Link href="/admin">
                                <a className="nav-link text-light">
                                    {isAuth().name}
                                </a>
                            </Link>
                        </li>
                    )
                }
                {
                    isAuth() && isAuth().role === 'subscriber' && (
                        <li className="nav-item ml-auto">
                            <Link href="/user">
                                <a className="nav-link text-light">
                                    {isAuth().name}
                                </a>
                            </Link>
                        </li>
                    )
                }
                {
                    isAuth() && (
                <li className="nav-item">
                    <a onClick={logout} className="nav-link text-light">
                        Logout
                    </a>
                </li>  
                    ) 
                }
            </ul>
        </div>
    )
    return <React.Fragment>{Head()}{header()}<div style={{padding:40}}>{children}</div></React.Fragment>
}

export default Layout

