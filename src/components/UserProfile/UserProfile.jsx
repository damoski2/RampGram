import React, { useState, useEffect } from "react";
import style from "./UserProfile.module.css";
import { Header, LoadPoint } from "../imports";
import { db, auth, storage } from "../../config/firebase";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import { Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const UserProfile = (props) => {
  const { user, uniqueUserPost, userDoc } = props;

  console.log(userDoc)

  //States
  const [postsImages, setPostsImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [profImage, setProfImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [signedUser, setSignedUser] = useState("");
  const [numberFollowers, setNumberFollowers] = useState(0);
  const [numberFollowing, setNumberFollowing] = useState(0);
  const [users, setUsers] = useState([]);

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
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    para: {
      cursor: "pointer",
      marginBottom: 20,
    },
  }));
  const classes = useStyles();

  //Get all posts
  useEffect(() => {
    setPostsImages(
      uniqueUserPost.map((item) => {
        return item.post.imageUrl;
      })
    );
  }, [uniqueUserPost]);
  //console.log(uniqueUserPost);
  //console.log(postsImages);

  //Check for updates in ProfileImage
  useEffect(() => {
    if (user) {
      setImageUrl(user.photoURL);
    }
    if (user) {
      let signedUser = firebase.auth().currentUser;
      user["photoURL"] == null &&
        signedUser.updateProfile({
          photoURL:
            "https://res.cloudinary.com/oyindacodes/image/upload/v1615390229/default_avatar_icon_rfujxi.png",
        });
    }
  },[user]);

  //Uploading Of profile Img
  const uploadProfileImage = (e) => {
    if (e.target.files[0]) {
      setProfImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const UploadProfImage = storage
      .ref(`ProfImages/${profImage.name}`)
      .put(profImage);

    let signedUser = firebase.auth().currentUser;

    UploadProfImage.on(
      "state_changed",
      (snapshot) => {
        //progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        //Error function...
        console.log(err);
        alert(err.message);
      },
      () => {
        //complete function
        storage
          .ref("ProfImages")
          .child(profImage.name)
          .getDownloadURL()
          .then((url) => {
            signedUser.updateProfile({
              photoURL: url,
            });
            //Update Profile picture across database
            var personPost = db.collection("posts");
            personPost
              .where("username", "==", user.displayName)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  personPost.doc(doc.id).update({ profilePic: url });
                });
              });
            setOpen(false);
            setProgress(0);
          });
      }
    );
  };

  useEffect(() => {
    if (user) {
      var personPost = db
        .collection("posts")
        .where("username", "==", user.displayName);
      personPost.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data().profilePic);
        });
      });
    }
  });

  const removePload = () => {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      photoURL:
        "https://res.cloudinary.com/oyindacodes/image/upload/v1615390229/default_avatar_icon_rfujxi.png",
    });
  };

  //Get Following and Followers status
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

  //Get Following and Followers status
  useEffect(()=>{
    if(user){
      users.map((person)=>{
        if(person["user"].username == user.displayName ){
          setSignedUser(person.id)
        }
      })
    }
  })

  //Get Following and Followers status
  useEffect(() => {
    if (signedUser){
      //Getting total number of followes
      db.collection("users").doc(signedUser).collection("Followers").get().then(snapshot =>{
        setNumberFollowers(snapshot.size)
      })

      db.collection("users").doc(signedUser).collection("Following").get().then(snapshot =>{
        setNumberFollowing(snapshot.size)
      })
    }
  });


  return (
    <div className={style.container}>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} id="modal_div" className={classes.paper}>
          <label htmlFor="files">Upload Image</label>
          <input
            id="files"
            style={{ visibility: "hidden" }}
            type="file"
            onChange={uploadProfileImage}
          />
          <button onClick={handleUpload}>upload</button>
          <p onClick={removePload} className={classes.para}>
            Remove Current Photo
          </p>
          <p onClick={() => setOpen(false)} className={classes.para}>
            Cancel
          </p>
          <progress
            className={style.imageUpload_progress}
            value={progress}
            max="100"
          />
        </div>
      </Modal>

      {user && (
        <div>
          <Header user={user} />
          <section className={style.mainCnt}>
            <div className={style.profStats}>
              <img
                onClick={() => setOpen(true)}
                className={style.profileImg}
                src={imageUrl}
                alt=""
              />
              <div className={style.innerStats}>
                <div className={style.followStats}>
                  <h3>{user.displayName}</h3>
                  <Link to={`/edit/profile/${user.uid}`} className={style.editBtn} >
                    Edit Profile
                  </Link>
                </div>
                <div className={style.followProf}>
                  <p>
                    <strong>{postsImages.length}</strong> &nbsp; posts
                  </p>
                  <p>
                    <strong>{numberFollowers}</strong>&nbsp; followers
                  </p>
                  <p>
                    <strong>{numberFollowing}</strong>&nbsp; following
                  </p>
                </div>
                <b>{user.displayName}</b>
                <p>{userDoc?.user?.about? userDoc.user.about : 'Edit Profile to display about'}</p>
              </div>
            </div>

            {/*Social Stats on small screen*/}
            <section className={style.Sc_socialStats} >
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
              {postsImages.map((postImg, index) => (
                <img className={style.postImg} src={postImg} alt="" />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
