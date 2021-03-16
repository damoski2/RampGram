import React, { useState, useEffect } from "react";
import style from "./LoadPoint.module.css";
import Header from "../Header/Header";
import { db, auth } from "../../config/firebase";
import firebase from 'firebase';

const LoadPoint = ({
  email,
  open,
  user,
  setOpenSignIn,
  setOpen,
  password,
  setPassword,
  setEmail,
  username,
  setUsername,
}) => {
  const [toggleAuth, setToggleAuth] = useState(true);

  //function to encode username to a special unique version
  const makeUniqueUsername = ()=>{
    // Code to be written in the near future

  }

  //SignUp Auth
  const SignUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
                                                                                         //Might Give errors in future cos "return" keyword was removed
         authUser.user.updateProfile({                                   
          displayName: username,
        });
      
        db.collection("users").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          id: authUser.user.uid,
          username:username,
          uniqueRoute: `/${username}`,
          Following: 0
        })
      })
      .catch((err) => alert(err.message));

      setPassword("")
      setEmail("")
      setUsername("")
  };

  //LogIn Auth
  const LogIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

      setPassword("")
      setEmail("")
  };

  return (
    <section style={{ background: "#FAFAFA", height:'100vh' }}>
      <div className={style.app_Auth}>
        <img
          src="https://res.cloudinary.com/oyindacodes/image/upload/v1605021809/E-Commerce_2_cnrakt.svg"
          alt=""
          className={style.app_PhoneImg}
        />
        <div className={style.app_Form}>
          {toggleAuth? (
            <React.Fragment>
              <form>
                <img
                  className={style.app_igLogo}
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="enter email"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter password"
                />
                <button onClick={LogIn} className={style.app_login}>
                  Log In
                </button>
              </form>
              <div className={style.toggleSignOpt}>
                Don't have an account?{" "}
                <span
                  onClick={() => setToggleAuth(!toggleAuth)}
                  className={style.app_Span}
                >
                  Sign Up
                </span>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <form>
                <img
                  className={style.app_igLogo}
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
                <p className={style.app_SignUpInfo}>
                  Sign Up to see Photos and videos from your friends
                </p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
                <button onClick={SignUp} className={style.app_login}>
                  Sign Up
                </button>
              </form>
              <div className={style.toggleSignOpt}>
                Have an account?{" "}
                <span
                  onClick={() => setToggleAuth(!toggleAuth)}
                  className={style.app_Span}
                >
                  Sign In
                </span>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoadPoint;
