import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import firebase from "firebase";
import ImageUpload from "./components/UploadPost/ImageUpload";
import { db, auth } from "./config/firebase";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import InstagramEmbed from "react-instagram-embed";
import { BrowserRouter as Router, Route } from "react-router-dom";

//Component Imports
import {
  SignIn,
  SignUp,
  UploadPost,
  Header,
  LoadPoint,
  UserProfile,
  FriendProfile,
} from "./components/imports";

function App() {
  /*State*/
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [uniqueUserPost, setUniqueUserPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const [pre_router, setPre_Router] = useState([]);
  var [rewarded, setRewarded] = useState([]);

  var routingfile = [];

  //Checking for Users auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      var signedUser = firebase.auth().currentUser;
      if (authUser) {
        //User has logged in...
        console.log(authUser);
        setUser(authUser);

        //Set Posts for "Signed in User Only"
        db.collection("posts")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setUniqueUserPosts(
              snapshot.docs
                .filter(
                  (doc) => doc.data().username == signedUser["displayName"]
                )
                .map((doc) => ({
                  id: doc.id,
                  post: doc.data(),
                }))
            );
          });
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

  //UseEffect to get Users id from database
  useEffect(() => {
    db.collection("users")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setAppUsers(
          snapshot.docs.map((doc) => ({
            appUser: doc.data(),
          }))
        );
      });
  }, []);

  console.log(uniqueUserPost);

  //testing current user
  useEffect(() => {
    var users = firebase.auth().currentUser;
    console.log(users);
  });

  return (
    <Router>
      <Route
        path="/profile"
        render={(props) => (
          <UserProfile user={user} uniqueUserPost={uniqueUserPost} />
        )}
      />

      {posts.map((post) => {
        if (!(routingfile.indexOf(post.post.route) > -1)) {
          routingfile.push(post.post.route);
          return (
            <Route
              path={post.post.route}
              render={(props) => <FriendProfile post={post} user={user} />}
            />
          );
        }
      })}

      <Route
        path="/auth"
        render={(props) => (
          <LoadPoint
            open={open}
            setOpen={setOpen}
            openSignIn={openSignIn}
            setOpenSignIn={setOpenSignIn}
            email={email}
            password={password}
            setPassword={setPassword}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            user={user}
          />
        )}
      />

      {user ? (
        <Route
          path="/"
          exact
          render={(props) => (
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
              <Header
                user={user}
                setOpenSignIn={setOpenSignIn}
                setOpen={setOpen}
              />

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
                      profilePic={post.profilePic}
                      route={post.route}
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
                <ImageUpload username={user.displayName} user={user} />
              ) : (
                <h3>Sorry Login to post</h3>
              )}
            </div>
          )}
        />
      ) : (
        <LoadPoint
          open={open}
          setOpen={setOpen}
          openSignIn={openSignIn}
          setOpenSignIn={setOpenSignIn}
          email={email}
          password={password}
          setPassword={setPassword}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          user={user}
        />
      )}
    </Router>
  );
}

export default App;
