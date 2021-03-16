import React, {useState, useEffect} from 'react'
import style from './SignIn.module.css';
import { db, auth } from "../../config/firebase";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";

const SignIn = ({ email, password, setPassword, setEmail, openSignIn, setOpenSignIn}) => {

    //State variables
    const [modalStyle] = React.useState(getModalStyle);
    

    //Login
    const logIn = (e) => {
        e.preventDefault();
    
        auth
          .signInWithEmailAndPassword(email, password)
          .catch((err) => alert(err.message));
    
        setOpenSignIn(false);
      };

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

    return (
        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className={style.app_signUp}>
            <center>
              <img
                className={style.app_headerImage}
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={logIn}>LogIn</Button>
          </form>
        </div>
      </Modal>
    )
}

export default SignIn
