import React, { useState, useEffect } from "react";
import UserRow from "../components/UserRow";
import { realtimeDatabase } from "../fbase";

const SearchUser = ({ userObj }) => {
  const [users, setUsers] = useState("");

  useEffect(async () => {
    // search
    // childData.username.toLowerCase().includes("ggg")
    await realtimeDatabase.ref("users").once("value", function (snapshot) {
      let searchResult = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var childKey = childSnapshot.key;
        if (true) {
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
  }, []);

  const UsersRow = () => {
    if (users) {
      let searchResult = JSON.parse(users);
      return searchResult.map((user) => {
        return <UserRow {...user} />;
      });
    }
  };

  return (
    <div>
      <h1>Search...</h1>
      {UsersRow()}
    </div>
  );
};

export default SearchUser;
