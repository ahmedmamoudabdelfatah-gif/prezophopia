import axios from "axios";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../features/UserContext";

export const usePostReactions = (post_id, reactionType) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [postReactionType, setPostReactionType] = useState(reactionType);
    const [displayReactions, setDisplayReactions] = useState(true);

    const postReaction = ({ queryKey }) => {
        const reactionType = queryKey[1];
        // console.log(reactionType);
        return axios.post(
            `http://localhost:8080/api/post/like/${post_id}/${reactionType}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.accessToken,
                },
            }
        );
    };

    
    const likeAction = async (currentTarget, postAction, newReaction, changeFeeds) => {
        if (!user?.accessToken) navigate("/signin");
        await setPostReactionType((oldReaction) => {
            setDisplayReactions(false);
            if (currentTarget?.classList[0] === "feed" && (+postReactionType === 0 || +postReactionType === 1)) {
                changeFeeds(2, 1);
                return 2;
            }
            else {
                if (+oldReaction === +newReaction) {
                    changeFeeds(newReaction, -1);
                    return 1;
                }
                else {
                    changeFeeds(oldReaction, -1);
                    changeFeeds(newReaction, 1);
                    return newReaction;
                }
            }
            // else return +oldReaction === +newReaction ? 1 : newReaction;
        });
        
        const { isError, error, data } = await postAction();
        if (isError) console.log("inside like action", error);
        else console.log(data);
        
    };

    const result = useQuery(["post-reaction", postReactionType], postReaction, {
        enabled: false,
    });
    return { ...result, likeAction, postReactionType, displayReactions, setDisplayReactions };
};
