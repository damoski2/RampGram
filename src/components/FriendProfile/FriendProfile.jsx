import React, { useEffect, useState } from "react";
import style from "./FriendProfile.module.css";
import { db, auth } from "../../config/firebase";
import { Header } from "../imports";
import firebase from "firebase";
import { Chat } from '@material-ui/icons';
import { Link } from 'react-router-dom'
import defaultAvatar from '../../Images/default avatar icon.png'

const FriendProfile = ({ post: { post }, user }) => {
  const { caption, imageUrl, profilePic, route, username, userID } = post;

  //State
  const [friendPost, setFriendPosts] = useState([]);
  const [toggleFollowBtn, setToggleFollowBtn] = useState(false);
  const [fb_toggleFollowBtn, setFb_toggleFollowBtn] = useState(false);
  const [users, setUsers] = useState([]);
  const [actualUser, setActualUser] = useState("");
  const [signedUser, setSignedUser] = useState("");
  const [numberFollowers, setNumberFollowers] = useState(0);
  const [numberPosts, setNumberPosts] = useState(0);
  const [numberFollowing, setNumberFollowing] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [arr,setArr] = useState([]);


  //Check if current user is visiting his page


  useEffect(() => {
    db.collection("users")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //Code fire to get actual profile in the cloud firestore for following and friendship
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            user: doc.data(),
          }))
        );
      });
  }, [user]);

  useEffect(() => {
    if(user){
      users.map((user) => {
        if (user["user"].username == post.username) {
          setActualUser(user.id);
        }
      });
    }
  }, [users]);

  useEffect(()=>{
   if(user){
    users.map((person)=>{
      if(person["user"].username == user.displayName ){
        setSignedUser(person.id)
      }
    })
   }
  })


  //Load and set UniquePost
  useEffect(() => {
    //console.log(post);
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setFriendPosts(
          snapshot.docs
            .filter((doc) => doc.data().username === post.username)
            .map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }))
        );
       
      });
  },[]);
 
  //Handle Following Logic
  const handleFollow = () => {
    db.collection("users").doc(actualUser).collection("Followers").add({
      by: user.displayName,
      followerID: user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    db.collection("users").doc(signedUser).collection("Following").add({
      friend: post.username,
      friendID : post.userID,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })


    //Handle Update Accross all Posts

    setToggleFollowBtn(true);
  };

  //Handle Unfollowing Logic
  const handleUnFollow = () => {

    var signedAcct = db.collection("users").doc(actualUser).collection("Followers").where("followerID","==",user.uid);
    signedAcct.get().then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        doc.ref.delete();
      });
    })

    var curAcct = db.collection("users").doc(signedUser).collection("Following").where("friendID","==",post.userID);
    curAcct.get().then(querySnapshot=>{
      querySnapshot.forEach((doc)=>{
        doc.ref.delete();
      })
    })
  
    setToggleFollowBtn(false);
  };


  //Code to make sure to get appropriate following status
  useEffect(() => {
    if (actualUser) {
      db.collection("users")
        .doc(actualUser)
        .collection("Followers")
        .onSnapshot((snapshot) => {
          setFollowers(snapshot.docs.map((doc) => doc.data().by));
        });
    }
  },[actualUser, toggleFollowBtn])

  useEffect(() => {
    if (user) {
      followers.indexOf(user.displayName) > -1
        ? setFb_toggleFollowBtn(true)
        : setFb_toggleFollowBtn(false);
    }
  });

 
  useEffect(() => {
    if (actualUser){
      //Getting total number of followes
      db.collection("users").doc(actualUser).collection("Followers").get().then(snapshot =>{
        setNumberFollowers(snapshot.size)
      })

      db.collection("users").doc(actualUser).collection("Following").get().then(snapshot =>{
        setNumberFollowing(snapshot.size)
      })
    }
  },[user, actualUser]);





  return (
    <div className={style.container}>
      <div>
        <Header user={user} />
        <section className={style.mainCnt}>
          <div className={style.profStats}>
            <img className={style.profileImg} src={profilePic? `${profilePic}` : `${defaultAvatar}`} alt="" />
            <div className={style.innerStats}>
              <div className={style.followStats}>
                <h3>{post.username}</h3>
                {fb_toggleFollowBtn ? (
                  <button onClick={handleUnFollow} className={style.following}>
                    Following
                  </button>
                ) : (
                  <button onClick={handleFollow} className={style.follow}>
                    Follow
                  </button>
                )}
                <Link to={`/chat/${post.userRef}`} style={{ color: 'grey' }} >
                  <Chat style={{ marginLeft: '20' }} />
                </Link>
              </div>
              <div className={style.followProf}>
                <p>
                  <strong>{friendPost.length}</strong> &nbsp; posts
                </p>
                <p>
                  <strong>{numberFollowers}</strong>&nbsp; followers
                </p>
                <p>
                  <strong>{numberFollowing}</strong>&nbsp; following
                </p>
              </div>
              <b>{post.username}</b>
              <p>Software Engineer and Developer</p>
            </div>
          </div>

          {/*Social Stats on small screen*/}
          <section className={style.Sc_socialStats}>
            <div>
              <strong>2</strong>
              <p>Posts</p>
            </div>
            <div>
              <strong>95</strong>
              <p>Followers</p>
            </div>
            <div>
              <strong>107</strong>
              <p>Posts</p>
            </div>
          </section>
          <div className={style.posts}>
            {friendPost.map((item) => (
              <img className={style.postImg} src={item.post.imageUrl} alt="" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FriendProfile;
