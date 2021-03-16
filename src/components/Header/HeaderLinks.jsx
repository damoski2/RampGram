import React from "react";
import style from "./HeaderLinks.module.css";
import HomeIcon from "@material-ui/icons/Home";
import TelegramIcon from "@material-ui/icons/Telegram";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";

const HeaderLinks = ({ image }) => {
  return (
    <div className={style.linkCnt}>
      <Link to="">
        <HomeIcon fontSize="normal" />
      </Link>
      <TelegramIcon fontSize="normal" />
      <FavoriteBorderIcon fontSize="normal" />
     <Link to="/profile" >
     <img
        className={style.post_avatar}
        alt=""
        src={image}
      />
     </Link>
    </div>
  );
};

export default HeaderLinks;
