import React, { useEffect, useState } from "react";
import style from "./Header.module.css";
import { auth } from "../../config/firebase";
import { Button, Input } from "@material-ui/core";
import HeaderLinks from "./HeaderLinks";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const Header = ({ user }) => {
  //States
  const [image, setImage] = useState("");
  const [toggleOpen, setToggleOpen] = useState(false);

  //Set Image
  useEffect(() => {
    if (user) {
      setImage(user.photoURL);
    }
  });

  //sign Out and redirect
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className={style.app_headerCnt}>
      {/*Header with links*/}
      <div className={style.app_header}>
        <img
          className={style.app_headerImage}
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {toggleOpen ? (
          <div className={style.smallScreen}>
            <div className={style.app_headerLink}>
              <HeaderLinks image={image} screen='smallScreen' toggleOpen={toggleOpen} setToggleOpen={setToggleOpen} />
            </div>
            <Button style={{ alignSelf: 'center', backgroundColor: '#fff', padding: '10px', marginTop: '2em' }} onClick={handleSignOut}>Logout</Button>
          </div>
        ) : (
          <div className={style.largeScreen}>
            <div className={style.app_headerLink}>
              <HeaderLinks image={image} screen='largeScreen' />
            </div>
            <Button onClick={handleSignOut}>Logout</Button>
          </div>
        )}

        {toggleOpen?(
          <></>
        ):(
          <HiMenuAlt4
          fontSize={28}
          className={style.hambuger}
          onClick={() => setToggleOpen(true)}
        />
        )}
      </div>
    </div>
  );
};

export default Header;
