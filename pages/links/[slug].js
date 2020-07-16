import Layout from '../../components/Layout';
import axios from 'axios';
import Head from 'next/head';       //seo
import {API, APP_NAME} from '../../config';
import renderHTML from 'react-render-html'              //to show content stored using reactquill(rich text editor)
import { useState ,useEffect,Fragment} from 'react';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';

const Links = ({query,category,links,linkSkip,linksLimit,totalLinks}) => {

    const[allLinks,setAllLinks] = useState(links)
    const[popularLinks,setPopularLinks] = useState([])
    const [state,setState] = useState({
        limit:linksLimit,
        skip:linkSkip,
        size:totalLinks
    })

    const {limit,skip,size} = state

    const head = () => (
        <Head>
            <title>
                {category.name} | {APP_NAME}
            </title>
            <meta name="description" content={category.content.substring(0,160)}/>
            <meta property="og:image:secure_url" content={category.image.url}/>
            <meta property="og:image" content={category.image.url}/>
            <meta property="og:title" content={category.name}/>
            <meta property="og:description" content={category.content}/>
        </Head>
    )

    const clickCount = async (id) => {
        await axios.put(`${API}/click-count`,{id})
        loadUpdatedLinks()
        loadLinks()
    }

    useEffect(() => {
        loadLinks()
    },[])

    const loadLinks = async() => {
        const res = await axios.get(`${API}/link/trending/${category.slug}`)
        setPopularLinks(res.data)
    }


    //load again to show updated click count
    const loadUpdatedLinks = async () => {
        const res = await axios.post(`${API}/category/${query.slug}`)
        setAllLinks(res.data.links)
    }

    const listOfLinks = () => 
        allLinks.map((link,i) => (
            <div key={i} className="row alert p-2 m-2" style={{border:'1px solid #333',backgroundColor:'#B3D7FF'}}>
                <div className="col-md-8" onClick={e => clickCount(link._id)}>
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

    const PopularLinks = () => 
        popularLinks.map((link,i) => (
        <div key={i} className="row alert alert-secondary p-2 m-2" style={{border:'1px solid #333'}}>
            <div className="col-md-8 overflow-hidden" onClick={e => clickCount(link._id)}>
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
        </div>
    )
)
    const loadMore = async() => {
        const toSkip = skip + limit
        const slug = query.slug
        const res = await axios.post(`${API}/category/${slug}`,{
            skip:toSkip,
            limit
        })

        setAllLinks([...allLinks,...res.data.links])
        setState({
            ...state,
            size:res.data.links.length,
            skip:toSkip
        })
    }

    return (
        <Fragment>
            {head()}
            <Layout>
                    <div className="row">
                        <h1 style={{marginLeft:'40px'}}>{category.name}</h1>            
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="jumbotron">
                                <div>{renderHTML(category.content)}</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <img src={category.image.url} alt={category.name} style={{marginLeft:'50px',width:'auto',maxHeight:'200px'}}/>
                        </div>
                    </div>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={loadMore}
                            hasMore={size>0 && size>=limit}
                            loader=
                            {
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        }
                        key={0}
                        >
                        <div className="row pt-4">
                            <div className="col-md-8">
                                {listOfLinks()}
                            </div>
                            <div className="col-md-3 ml-2">
                                <h2>Most Popular Links</h2>
                                <br/>
                                {PopularLinks()}
                            </div>
                        </div>
                        </InfiniteScroll>
                    
    {/* 
                    { size > 0 && size >= limit && (
                            <div className="btn btn-outline-primary mt-4" onClick={loadMore}>
                                Load More
                            </div>
                        )} */}
            </Layout>
        </Fragment>
    )
}

Links.getInitialProps = async (context) => {
    let skip = 0;
    let limit = 3;
    const slug = context.query.slug                     //just like withRouter gives query property similarly context also contains this property                     

    const res = await axios.post(`${API}/category/${slug}`,{
        skip,
        limit
    })

    return {
        query:context.query,
        category:res.data.category,
        links:res.data.links,
        totalLinks:res.data.links.length,
        linksLimit:limit,
        linkSkip:skip
    }
}   


export default Links
