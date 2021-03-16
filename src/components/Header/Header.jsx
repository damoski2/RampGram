import React,{useEffect,useState} from "react";
import style from "./Header.module.css";
import { auth } from "../../config/firebase";
import { Button, Input } from "@material-ui/core";
import HeaderLinks from './HeaderLinks'

const Header = ({ user, setOpenSignIn, setOpen }) => {

  //States
  const [image, setImage] = useState('');

  //Set Image
  useEffect(()=>{
    if(user){
      setImage(user.photoURL)
    }
  })

  //sign Out and redirect
  const handleSignOut = ()=>{
    auth.signOut();
  }

  return (
    <div className={style.app_headerCnt} >
      {/*Header with links*/}
      <div className={style.app_header}>
        <img
          className={style.app_headerImage}
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        <div className={style.app_headerLink} >
        <HeaderLinks image={image} />
        </div>

        
          <Button onClick={handleSignOut}>Logout</Button>
       
      </div>
    </div>
  );
};

export default Header;
