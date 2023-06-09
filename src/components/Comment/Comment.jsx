import './comment.css'
import { useCommentReactions } from './hooks/useCommentReactions.js';
import { useFeedsDetials } from './hooks/useFeedsDetials.js'
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFeedsLeftPadding } from './utils/getFeedsLeftPadding';
import { useState } from 'react';
import Replays from '../Replays/Replays';
import { Link } from 'react-router-dom';


const Comment = (props) => {

    const { likeAction, refetch, commentReactionType, displayReactions, setDisplayReactions } = useCommentReactions(props.id, props.myFeed);

    const { feedsTypes, numberOfFeeds, commentFeeds, changeFeeds } = useFeedsDetials(props.feeds);

    const [isReplay, setIsReplay] = useState(false);

     const imageStyles = {
        backgroundImage: `url(http://localhost:8080/${props?.author?.image_url})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
    }


    return (
        <section className="comment-container" >
            <div className="img" style={ props?.author?.image_url? imageStyles : null}>
                {!props?.author?.image_url?
                    <FontAwesomeIcon icon={faUserAlt} style={{ height: "18px", color: "#414141" }} /> 
                    // : <img src={`http://localhost:8080/${user?.image_url}`} alt=""/>
                    : null
                }
             </div>
            <div className="full-comment">
                <div className="text-container">
                    <div className="name"><Link to={`/profile/${props?.author?.id}`}>{ props?.author?.username }</Link></div>
                    <div className="text">{props?.text} </div>
                    {
                        numberOfFeeds ? (
                            <div class="feeds">
                                <div style={{paddingLeft: `${getFeedsLeftPadding(feedsTypes.length)}`}}>
                                    <div className="emojis">
                                        {
                                            feedsTypes.map((type) => {
                                                return (
                                                    <div className={`${commentFeeds[type]?.class}`} key={type}>
                                                        { commentFeeds[type]?.emoji }
                                                    </div> 
                                                );
                                            })
                                        }
                                    </div>
                                    <div className="feeds-number" > { numberOfFeeds } </div>
                                </div>
                            </div>
                        ): null
                    }
                </div>
                <div className="comment-actions">
                    <div role={"button"} className={`comment-feed ${displayReactions? "hoverable" : ''}`} onMouseLeave={()=> setDisplayReactions(true)}>
                        <div className="feed" onClick={({currentTarget}) => likeAction(currentTarget, refetch, commentReactionType, changeFeeds)}>
                            <span className={`comment-${commentFeeds[commentReactionType]?.class}`}>{ commentFeeds[commentReactionType]?.desc }</span>
                        </div>
                        <div className="reactions">
                            {
                                Object.entries(commentFeeds).slice(2).map(([key, value]) => {
                                    return (
                                        <div className={`${value?.class}`} onClick={({currentTarget}) => likeAction(currentTarget, refetch, key, changeFeeds)} key={key}>
                                            { value?.emoji }
                                        </div>  
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div role={"button"} className="reply" onClick={() => setIsReplay((prev) => !prev)}> reply </div>
                </div>
                {
                    isReplay ? <Replays id={props.id} /> : null
                }
            </div>
        </section>
    )
}

export default Comment
