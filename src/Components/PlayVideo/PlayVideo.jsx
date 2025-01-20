import React, { useEffect } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { APIkey, value_converter } from '../../data'
import moment from 'moment'

const PlayVideo = ({videoId}) => {

    const [apiData, setApiData] = React.useState(null)
    const [channelData, setChannelData] = React.useState(null)
    const [commentData, setCommentData] = React.useState([])

    const fetchVideoData = async () => {
        // Fetching video data from API
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${APIkey}`
        await fetch(videoDetails_url).then(response=>response.json()).then(data => setApiData(data.items[0]))
    }

    const fetchOtherData = async () => {
        // Fetching channel data from API
        const channelData_url =  `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${APIkey}`
        await fetch(channelData_url).then(response=>response.json()).then(data => setChannelData(data.items[0]))
        
        // Fetching comments data from API
        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${APIkey}`
        await fetch(comment_url).then(response=>response.json()).then(data => setCommentData(data.items))
    }

    useEffect(()=>{
        fetchVideoData();
    },[])

    useEffect(()=>{
        fetchOtherData();   
    },[apiData])

  return (
    <div className='play-video'>
        {/* <video src={video1} controls autoPlay muted></video> */}
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
        <div className="play-video-info">
            <p>{apiData?value_converter(apiData.statistics.viewCount):"16K"} Views &bull; {apiData?moment(apiData.snippet.publishedAt).fromNow():""}</p>
            <div>
                <span><img src={like} alt="" /> {value_converter(apiData?apiData.statistics.likeCount:155)}</span>
                <span><img src={dislike} alt="" /></span>
                <span><img src={share} alt="" /> Share</span>
                <span><img src={save} alt="" /> Save</span>
            </div>
        </div>
        <hr />
        <div className="publisher">
            <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
            <div>
                <p>{apiData?apiData.snippet.channelTitle:"Noah Wons"}</p>
                <span>{value_converter(channelData?channelData.statistics.subscriberCount:"100M")} Subscribers</span>
            </div>
            <button>Subscribe</button>
        </div>
        <div className="vid-description">
            <p>{apiData?apiData.snippet.description.slice(0, 250):"Description"}</p>
            <hr />
            <h4>{value_converter(apiData?apiData.statistics.commentCount:102)} Comments</h4>
            {commentData.map((item, index)=>{
                return (
                    <div key={index} className="comment">
                    <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                    <div>
                        <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
                        <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                            <img src={dislike} alt="" />
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    </div>
  )
}

export default PlayVideo