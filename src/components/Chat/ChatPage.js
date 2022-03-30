import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../config/firebase";
import style from "./ChatPage.module.css";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import Header from "../Header/Header";
import moment from 'moment';

const ChatPage = (props) => {
  const { user, users } = props;

  const { recieverId } = useParams();

  const [message, setMessage] = useState("");
  const [reciever, setReciever] = useState(null);
  const [loggedUser, setLoggedUser] = useState("");
  const [loggedUsername, setLoggedUsername] = useState("");
  const [recieverName, setRecieverName] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const endOfMessagesRef = useRef(null)

  const loadReciever = async () => {
    const recieverRef = db.collection("users").doc(recieverId);
    const doc = await recieverRef.get();
    if (!doc.exists) {
      console.log("No such document! ");
    } else {
      setReciever(doc.data());
      setRecieverName(doc.data().username);
    }
  };

    //Load Reciever data
    useEffect(() => {
      if(recieverId){
        loadReciever();
      }
    }, [recieverId]);

  useEffect(() => {
    if (users.length > 0) {
      users.map((person) => {
        if (
          person["user"].username.toString() === user.displayName.toString()
        ) {
          setLoggedUser(person.id);
          setLoggedUsername(person["user"].username);
          return;
        }
      });
    }
  }, [users]);

 

  //Load All messages
  useEffect(() => {
    if(loggedUser && recieverName){
      db.collection("users")
      .doc(loggedUser)
      .collection(recieverName)
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setAllMessages(
          snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        }))
        );
      });
    }
  }, [user, loggedUser]);



  const sendMessage = (e) => {
    e.preventDefault();

    if (message == "") return;

    try {
      console.log(loggedUsername);
      db.collection("users").doc(recieverId).collection(loggedUsername).add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        type: "recieve",
      });

      db.collection("users").doc(loggedUser).collection(recieverName).add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        type: "sent",
      });
    } catch (e) {
      console.log(e);
    }
    scrollToBottom();
    setMessage('');
  };


  const scrollToBottom = ()=>{
    endOfMessagesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    })
  }

  return Array.isArray(allMessages)?(
    <div className={style.overallCnt}>
      <Header user={user} />
      <form className={style.cnt} onSubmit={sendMessage}>
        <div className={style.messages}>
          {allMessages&&allMessages.map((m, index)=> {
           return m.data.type == 'sent'?
              <p key={index} className={style.send}>{m.data.message} <span>{m.data.timestamp? moment(message.timestamp).format('LT')  : '...'}</span></p>
              :
              <p key={index} className={style.recieve}>{m.data.message}<span>{m.data.timestamp? moment(message.timestamp).format('LT')  : '...'}</span></p>
          })}
          <div stye={{ marginBottom: '50px' }} ref={endOfMessagesRef} ></div>
        </div>
        <div className={style.formInner}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button hidden disabled={!message} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
  :
  (
    <p>Loading....</p>
  )
};

export default ChatPage;
