/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db, auth } from "./config/firebase";
import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";
import { Link } from 'react-router-dom';

const Post = ({ username, caption, imageUrl, PostId, user, profilePic, route }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [uniqueUser, setUniqueUser] = useState([]);
  const [totalLike, setTotalLike] = useState(0);
  const [firstLiker, setFirstLiker] = useState('');

  //Getting all comments from cloud firestore
  useEffect(() => {
    let unsubscribe;
    if (PostId) {
      unsubscribe = db
        .collection("posts")
        .doc(PostId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [PostId]);

 
  //Post comment handler
  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(PostId).collection("comments").add({
      username: user.displayName,
      comment: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  //Liking a post
  const toggleLike = () => {
    db.collection("posts").doc(PostId).collection("likes").add({
      by: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setLiked(true);
    // db.collection("posts").doc(PostId).collection("likes")
  };

  //Unliking a post
  const toggleUnlike = () => {
    setUserLiked(false);
    var signedAcct = db
      .collection("posts")
      .doc(PostId)
      .collection("likes")
      .where("by", "==", user.displayName);
    signedAcct.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
    setLiked(false);
  };

  //User Id liked
  useEffect(() => {
  db.collection("posts").doc(PostId).collection("likes").onSnapshot((snapshot)=>{
    setUniqueUser(snapshot.docs.map(doc=>( doc.data().by )))
  })
  },[liked]);
  
  useEffect(()=>{
    if(user){
      uniqueUser.indexOf(user.displayName) > -1 ? setUserLiked(true): setUserLiked(false);
      setFirstLiker(uniqueUser[0]);
    }
  })
  //console.log(userLiked)
  //console.log(uniqueUser)
  
  //Fetching Total likes
  db.collection("posts").doc(PostId).collection("likes").get().then(snapshot =>{
    setTotalLike(snapshot.size)
  })




  return (
    <div className="post">
      {/*Header -> avatar + username*/}
      <div className="post_header">
        <img
          className="post_avatar"
          src={profilePic}
        />
        {user.displayName == username?(
          <h3 className="post_linktoFriend" >{username}</h3>
        ):(
          <Link className="post_linktoFriend" to={route} >{username}</Link>
        )}
      </div>

      {/*Image*/}
      <img className="post_image" src={imageUrl} alt="test" />

      {/*Likes*/}
      <div className="post_likes">
        { userLiked ? (
          <FavoriteIcon onClick={toggleUnlike} fontSize="large" />
        ) : (
          <FavoriteBorderIcon onClick={toggleLike} fontSize="large" />
        )}
        <CommentIcon fontSize = "large"  />
      </div>

      {/*Liked By*/}
      <div className="post_likedBy" >
          <p>Liked by <strong>{firstLiker}</strong> and <strong>{totalLike==0? totalLike:totalLike-1 } others </strong> </p> 
      </div>

      {/*usename + caption*/}
      <h4 className="post_text">
        <strong>{username}</strong> : {caption}
      </h4>

      {/*Display comments*/}
      <div className="post_comments">
        {comments.map((comment) => (
          <p className="actualComment">
            <strong>{comment.username}</strong> {comment.comment}
          </p>
        ))}
      </div>

      {/*Comment form*/}
      {user && (
        <form className="post_form">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            type="submit"
            onClick={postComment}
            disabled={!comment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
