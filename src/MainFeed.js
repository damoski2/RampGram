import React,{useState, useEffect} from 'react';
import './App.css';
import Post from "./Post";
import ImageUpload from "./components/UploadPost/ImageUpload";
import { db, auth } from "./config/firebase";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import InstagramEmbed from "react-instagram-embed";
import { BrowserRouter as Router, Route } from "react-router-dom";

//Component Imports
import {
  Header,
} from "./components/imports";

export const MainFeed = ({ posts, setPosts, user, setUser, open, setOpen, openSignIn , setOpenSignIn, username, setUsername, password, setPassword, email, setEmail }) => {

    /*State*/
  const [modalStyle] = React.useState(getModalStyle);
 

  //Checking for Users auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //User has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //User has logged out
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  /*Material UI modal Styling*/
  function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();

  //UseEffect to get posts from database
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //Everytime a new psot is added, this code fires
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

    return (
        <div className="App">
          {/*SignUp modal*/}
          {/*<SignUp
            open={open}
            setOpen={setOpen}
            email={email}
            password={password}
            setPassword={setPassword}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            user={user}
          />*/}

          {/*SignIn Modal*/}
          {/*<SignIn
            email={email}
            password={password}
            setPassword={setPassword}
            setEmail={setEmail}
            openSignIn={openSignIn}
            setOpenSignIn={setOpenSignIn}
            user={user}
          />*/}

          {/*Header*/}
          <Header user={user} setOpenSignIn={setOpenSignIn} setOpen={setOpen} />

          {/*All app Posts*/}
          <div className="app_posts">
            <div className="app_postLeft">
              {posts.map(({ id, post }) => (
                <Post
                  key={id}
                  PostId={id}
                  user={user}
                  username={post.username}
                  caption={post.caption}
                  imageUrl={post.imageUrl}
                />
              ))}
              {/*Posts*/}
            </div>

            <div className="app_postRight">
              <InstagramEmbed
                url="https://instagr.am/p/Zw9o4/"
                clientAccessToken="263402458557573|80c65b20e9b3f0672dc9b4fa0fc898b5"
                maxWidth={320}
                hideCaption={false}
                containerTagName="div"
                protocol=""
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
              />
            </div>
          </div>

          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3>Sorry Login to post</h3>
          )}
        </div>
    )
}
