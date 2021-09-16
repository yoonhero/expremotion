import React from "react";
import NweetFactory from "../components/NweetFactory";

const Uploads = ({ userObj }) => {
  return (
    <>
      <NweetFactory userObj={userObj} />
    </>
  );
};

export default Uploads;
