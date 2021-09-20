import React, { useState, useEffect } from "react";
import UserRow from "../components/UserRow";
import { realtimeDatabase } from "../fbase";
import "./Search.css";

const SearchUser = ({ userObj }) => {
  const [users, setUsers] = useState("");
  const [keyword, setKeyword] = useState("");

  const Search = async () => {
    if (keyword === undefined || keyword === null) {
      return;
    }
    await realtimeDatabase
      .ref("users")
      .orderByChild("username")
      .equalTo(keyword)
      .on("value", function (snapshot) {
        let searchResult = [];
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          var childKey = childSnapshot.key;
          childData.uid = childKey;
          if (searchResult.length < 10) {
            searchResult.push(childData);
          }
        });
        const jsonedResult = JSON.stringify(searchResult);
        setUsers(jsonedResult);
      });
  };

  useEffect(async () => {
    // search
    // childData.username.toLowerCase().includes("ggg")
    await realtimeDatabase.ref("users").once("value", function (snapshot) {
      let searchResult = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var childKey = childSnapshot.key;
        if (true) {
          childData.uid = childKey;
          searchResult.push(childData);
        } else {
          return;
        }
      });
      const jsonedResult = JSON.stringify(searchResult);
      setUsers(jsonedResult);
    });
  }, []);

  const UsersRow = () => {
    if (users) {
      // console.log(userObj);
      let searchResult = JSON.parse(users);
      return searchResult.map((user) => {
        return <UserRow {...user} userObj={userObj} />;
      });
    }
  };

  const onChange = (event) => {
    setKeyword(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await Search();
  };

  return (
    <div class='search_container column'>
      <form onSubmit={onSubmit} className='search_form column'>
        <input
          placeholder='Search...'
          className='search_input'
          type='text'
          required
          value={keyword}
          onChange={onChange}
        />
      </form>
      <div className='users_container column'>{UsersRow()}</div>
    </div>
  );
};

export default SearchUser;
