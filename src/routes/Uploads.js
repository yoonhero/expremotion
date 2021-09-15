import React from "react";
import NweetFactory from "../components/NweetFactory";

const Uploads = ({ userObj }) => {
  return (
    <div>
      <NweetFactory userObj={userObj} />
    </div>
  );
};

export default Uploads;
