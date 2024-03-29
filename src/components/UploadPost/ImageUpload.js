import React,{useState, useEffect} from "react";
import { Button } from "@material-ui/core";
import style from "./ImageUpload.module.css";
import { storage, db } from '../../config/firebase';
import firebase from 'firebase';

const ImageUpload = ({ username, user }) => {

  //Setting up states  
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [profilePic , setProfilePic] = useState('');
  const [actualUser, setActualUser] = useState('')
  const [users, setUsers] = useState([]);
  const [userRef, setUserRef] = useState([]);

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

  useEffect(()=>{
    if(user){
     users.map((person)=>{
       if(person["user"].username == user.displayName ){
        setActualUser(person.id)
       }
     })
    }
   })


  //Profile img logic
  var signedUser = firebase.auth().currentUser;
  useEffect(()=>{
    if(user){
      setProfilePic(signedUser['photoURL']);
    }
  });
  //console.log(profilePic)

  useEffect(() => {
    if(actualUser){
      setUserRef(
        db.collection('users').doc(actualUser).id
      )
    }
  },[actualUser])



  //Handle Selecting of files
  const handleChange = (e)=>{
    if(e.target.files[0]){
        setImage(e.target.files[0]);
    }
  }

  //Handle Upload
  const handleUpload = ()=>{
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
        "state_changed",
        (snapshot) =>{
            //progress function...
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes ) *100
            );
            setProgress(progress);
        },
        (err) =>{
            //Error function...
            console.log(err);
            alert(err.message);
        },
        ()=>{
            //complete function
            storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then(url =>{
                  //post image inside db
                  db.collection("posts").add({
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption: caption,
                      imageUrl: url,
                      username: username,
                      profilePic: profilePic,
                      route: `/${username}`,
                      userID: user.uid,
                      userRef: userRef,
                  });
                  setProgress(0);
                  setCaption("")
                  setImage(null);
              }).catch(err=> console.log(err))
        }
    )
  }

  return (
    <div className={style.imageUpload}>
      {/*Caption Input*/}
      {/*File Picker*/}
      {/*Post Button*/}
      <progress className={style.imageUpload_progress} value={progress} max="100" />
      <input type="text" placeholder="Enter a caption..." onChange={(e)=> setCaption(e.target.value)} value={caption} />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload} >Upload</Button>
    </div>
  );
};

export default ImageUpload;
