import React from "react";
import style from "./HeaderLinks.module.css";
import HomeIcon from "@material-ui/icons/Home";
import TelegramIcon from "@material-ui/icons/Telegram";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

const HeaderLinks = ({ image, screen, toggleOpen, setToggleOpen }) => {
  return (
    <div style={screen == 'smallScreen'? {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
      justifyItems: 'center',
      width: 'fit-content',
      color: '#492626'
    }: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '150px',
      color: '#492626'
    }} >
      {toggleOpen&& (
        <AiOutlineClose
        fontSize={28}
        className={style.closeBtn}
        onClick={() => setToggleOpen(false)}
      />
      )}
      <Link to="">
        <HomeIcon fontSize="normal" style={screen == 'smallScreen'? { width: '70px', height: '70px', justifyItems: 'center'}: {}} />
      </Link>
      <TelegramIcon fontSize="normal" style={screen == 'smallScreen'? { width: '70px', height: '70px', marginTop: '2em' }: {}}  />
      <FavoriteBorderIcon fontSize="normal" style={screen == 'smallScreen'? { width: '70px', height: '70px', marginTop: '2em' }: {}}  />
     <Link to="/profile" >
     <img
        className={style.post_avatar}
        style={screen == 'smallScreen'? {
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          objectFit: 'contain',
          alignItems: 'center',
          marginTop: '2em'
        }: {
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          objectFit: 'contain',
          alignItems: 'center'
        }}
        alt=""
        src={image}
      />
     </Link>
    </div>
  );
};

export default HeaderLinks;
