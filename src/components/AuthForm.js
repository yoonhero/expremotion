import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";
import "./AuthForm.css";

const inputStyles = {};
const AuthForm = () => {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(!localStorage.getItem("email"));
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
        localStorage.setItem("email", email);
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
    setEmail("");
    setPassword("");
    setError("");
  };
  return (
    <>
      <form onSubmit={onSubmit} className='container column'>
        <input
          name='email'
          type='email'
          placeholder='Email'
          required
          value={email}
          onChange={onChange}
          className='authInput'
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          required
          value={password}
          onChange={onChange}
          className='authInput'
        />
        <input
          type='submit'
          className='authInput authSubmit'
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <span className='authError'>{error}</span>}
      </form>
      <span onClick={toggleAccount} className='authSwitch'>
        Or {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};
export default AuthForm;
