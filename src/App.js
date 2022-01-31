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
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

//Component Imports
import {
  UploadPost,
  Header,
  LoadPoint,
  UserProfile,
  FriendProfile,
  ChatPage,
  CreateProfile
} from "./components/imports";

function App() {
  /*State*/
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [uniqueUserPost, setUniqueUserPosts] = useState([]);
  const [otherUserPost, setOtherUserPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

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
  }, []);

  var routingfile = [];
  //Checking for Users auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      var signedUser = firebase.auth().currentUser;
      if (authUser) {
        //User has logged in...
        setUser(authUser);

        //Set Posts for "Signed in User Only"
        db.collection("posts")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setUniqueUserPosts(
              snapshot.docs
                .filter(
                  (doc) => doc.data().username === signedUser["displayName"]
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

  useEffect(() => {
    setOtherUserPost([]);
    var signedUser = firebase.auth().currentUser;
    if (signedUser) {
      db.collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            const query1 = db
              .collection("users")
              .doc(doc.data().userRef)
              .collection("Followers")
              .where("followerID", "==", signedUser["uid"])
              .get();
            query1.then((querySnapshot) => {
              querySnapshot.forEach((doc2) => {
                setOtherUserPost((otherUserPost) => [
                  ...otherUserPost,
                  { id: doc.id, post: doc.data() },
                ]);
              });
            });
          });
        });
    }
  }, [user]);

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


  return (
    <Router>
      <Route
        path="/profile"
        render={(props) => (
          <UserProfile user={user} uniqueUserPost={uniqueUserPost} />
        )}
      />

      {posts.map((post) => {
        if (routingfile.indexOf(post.post.route) < 0) {
          routingfile.push(post.post.route);
          return (
            <Route
              path={post.post.route}
              render={(props) =>
                user ? (
                  <FriendProfile post={post} user={user} />
                ) : (
                  <Redirect to="/auth" />
                )
              }
            />
          );
          //
          var snapshot = db
            .collection("users")
            .doc(post.post.userID)
            .collection("Followers")
            .where("followerID", "==", user.uid)
            .get();
          if (snapshot.empty) {
            console.log(snapshot);
          } else {
          }
        }
      })}
      {/* 
      <Route
        path="/auth"
        render={(props) => !user && (
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
      /> */}

      <Route
        path="/chat/:recieverId"
        render={(props) => users&&<ChatPage user={user} users={users} /> }
      />

      <Route path="/edit/profile/:userId" render={(props)=> user&& <CreateProfile user={user} /> } />

      {user? (
        <Route
          path="/"
          exact
          render={(props) => (
            <div className="App">
              {/*Header*/}
              <Header
                user={user}
                setOpenSignIn={setOpenSignIn}
                setOpen={setOpen}
              />

              {/*All app Posts*/}
              <div className="app_posts">
                <div className="app_postLeft">
                  {posts.map((main) => {
                    if (main !== undefined) {
                      return (
                        <Post
                          key={main.id}
                          PostId={main.id}
                          user={user}
                          username={main.post.username}
                          caption={main.post.caption}
                          imageUrl={main.post.imageUrl}
                          profilePic={main.post.profilePic}
                          route={main.post.route}
                        />
                      );
                    }
                  })}
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
