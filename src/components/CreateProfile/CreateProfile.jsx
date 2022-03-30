import { styled } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Header } from "../imports";
import style from "./CreateProfile.module.css";
import firebase from "firebase";
import { db, auth, storage } from "../../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateProfile = ({ user, users, userDoc }) => {
  const [data, setData] = useState({
    profImage: "",
    name: "",
    websiteUrl: "",
    about: "",
  });
  const [progress, setProgress] = useState(0);
  const [currentImgPreview, setCurrentImgPreview] = useState({
    preview: "",
    file: "",
  });
  const [loggedUser, setLoggedUser] = useState("");

  const { profImage, name, websiteUrl, about } = data;

  useEffect(() => {
    if (user) {
      console.log(user);
      setData({
        ...data,
        profImage: user.photoURL,
        name: user.name,
        about: user.about,
        websiteUrl: user.websiteUrl,
      });
      setCurrentImgPreview({
        preview: user.photoURL,
      });
    }
    if (user) {
      let signedUser = firebase.auth().currentUser;
      user["photoURL"] == null &&
        signedUser.updateProfile({
          photoURL:
            "https://res.cloudinary.com/oyindacodes/image/upload/v1615390229/default_avatar_icon_rfujxi.png",
        });
    }
  }, [user]);

  useEffect(() => {
    if (users.length > 0) {
      users.map((person) => {
        if (
          person["user"].username.toString() === user.displayName.toString()
        ) {
          setLoggedUser(person.id);
          return;
        }
      });
    }
  }, [users]);

  const handleChange = (e) => {
    if (e.target.type == "file") {
      setData({ ...data, profImage: e.target.files[0] });
      setCurrentImgPreview({
        preview: URL.createObjectURL(e.target.files[0]),
        file: e.target.files[0],
      });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    let postData = {};
    for (let field in data) {
      if (field !== "profImage" && data[field]) {
        postData[field] = data[field];
      }
    }

    try {
      db.collection("users").doc(loggedUser).update(postData);

      var personPost = db.collection("posts");
      personPost
        .where("username", "==", user.displayName)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            personPost.doc(doc.id).update(postData);
          });
        });
      toast.success("Profile Updated Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const changeDP = (e) => {
    e.preventDefault();
    try {
      if (currentImgPreview.file) {
        let profImage = currentImgPreview.file;
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
            toast.error(err.message, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
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
                setProgress(0);
              });
          }
        );
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={style.mainDiv}>
      <Header user={user} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section className={style.editCnt}>
        <form onSubmit={updateProfile} className={style.form}>
          <div className={style.formInner}>
            <div className={style.inputDiv}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </div>
            <div className={style.inputDiv}>
              <label>Website</label>
              <input
                type="text"
                name="websiteUrl"
                value={websiteUrl}
                onChange={handleChange}
              />
            </div>
            <div className={style.inputDiv}>
              <label>About</label>
              <input
                type="text"
                name="about"
                value={about}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className={style.submitBtn}>
              Submit
            </button>
          </div>
        </form>

        <form className={style.form} onSubmit={changeDP}>
          <div className={style.formInner}>
            <div className={style.img__div}>
              <img
                className={style.profImage}
                src={currentImgPreview.preview}
              />
              <div className={style.imgOption}>
                <p>{user.displayName}</p>
                <label htmlFor="upload-cover" className={style.labelClick}>
                  Change Profile Image
                </label>
              </div>
              <input
                id="upload-cover"
                type="file"
                accept="image/*"
                name="profImage"
                multiple
                onChange={handleChange}
              />
            </div>
            <button type="submit" className={style.submitBtn}>
              Submit
            </button>
          </div>
          <progress
            className={style.imageUpload_progress}
            value={progress}
            max="100"
          />
        </form>
      </section>
    </div>
  );
};

export default CreateProfile;
