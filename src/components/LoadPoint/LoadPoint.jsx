import React, { useState, useEffect } from "react";
import style from "./LoadPoint.module.css";
import Header from "../Header/Header";
import { db, auth } from "../../config/firebase";
import firebase from "firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const makeUniqueUsername = (_username) => {
    // Code to be written in the near future
    let len = _username.length;
    let charNum = _username.charCodeAt(Math.floor(Math.random() * len));
    let symbols = ["-", ".", "_", "*"];
    let sign = symbols[Math.floor(Math.random() * symbols.length)];
    let radNum = Math.floor(Math.random() * len) + 1;
    let arr = _username.split("");
    arr.splice(radNum, 0, sign);
    arr.splice(radNum, 0, charNum.toString());
    let name = arr.join("");
    name = `@${name}`;
    return name;

    //let result = `@${.splice(Math.floor(Math.random()*len)+1,0,charNum.toString()).join('')}`
    //console.log(result);
  };

  //SignUp Auth
  const SignUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        //Might Give errors in future cos "return" keyword was removed
        let Uinquename = makeUniqueUsername(username);
        authUser.user.updateProfile({
          displayName: Uinquename,
        });

        db.collection("users").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          id: authUser.user.uid,
          username: Uinquename,
          uniqueRoute: `/${Uinquename}`,
          Following: 0,
        });
      })
      .catch((err) => {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    setPassword("");
    setEmail("");
    setUsername("");
    toast.success("Account Created Successfully", {
      position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
  });
}

  //LogIn Auth
  const LogIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    setPassword("");
    setEmail("");
  };

  return (
    <section style={{ background: "#FAFAFA", height: "100vh" }}>
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
      <div className={style.app_Auth}>
        <img
          src="https://res.cloudinary.com/oyindacodes/image/upload/v1605021809/E-Commerce_2_cnrakt.svg"
          alt=""
          className={style.app_PhoneImg}
        />
        <div className={style.app_Form}>
          {toggleAuth ? (
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

      <footer>
        <p>Created by Oyindacodes @{new Date().getFullYear()}</p>
      </footer>
    </section>
  );
};

export default LoadPoint;
