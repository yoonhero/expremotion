import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { authService, firebaseInstance } from "../fbase";
import AuthForm from "../components/AuthForm";
import "./Auth.css";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <div className='authContainer column'>
      {/* <img src='./happy.png' /> */}
      <h1 class='authTitle'>Expremotion</h1>
      <AuthForm />
      <div>
        <div className='authBtns'>
          <button onClick={onSocialClick} name='google' className='authBtn'>
            <FontAwesomeIcon icon={faGoogle} />
          </button>
          <button onClick={onSocialClick} name='github' className='authBtn'>
            <FontAwesomeIcon icon={faGithub} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
