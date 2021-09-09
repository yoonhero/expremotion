import React, { useState, useEffect } from "react";
import UserRow from "../components/UserRow";
import { realtimeDatabase } from "../fbase";

const SearchUser = ({ userObj }) => {
  const [users, setUsers] = useState("");
  const [keyword, setKeyword] = useState("");

  const Search = async () => {
    if (keyword === undefined || keyword === null) {
      return;
    }
    await realtimeDatabase.ref("users").once("value", function (snapshot) {
      let searchResult = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var childKey = childSnapshot.key;

        if (childData.username.toLowerCase().includes(keyword.toLowerCase())) {
          // recognize is duplicate or not
          // const isDup = searchResult.some(function (x) {
          //   return searchResult.indexOf(x) !== searchResult.indexOf(childData);
          // });

          const isDup = false;

          childData.uid = childKey;
          if (!isDup) {
            searchResult.push(childData);
          }
        } else {
          return;
        }
      });
      const jsonedResult = JSON.stringify(searchResult);
      setUsers(jsonedResult);
    });
  };

  useEffect(async () => {
    // search
    // childData.username.toLowerCase().includes("ggg")
    await realtimeDatabase
      .ref("users")
      .limitToFirst(15)
      .once("value", function (snapshot) {
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
    <div>
      <h1>Search...</h1>
      <form onSubmit={onSubmit}>
        <input type='text' required value={keyword} onChange={onChange} />
      </form>
      {UsersRow()}
    </div>
  );
};

export default SearchUser;
