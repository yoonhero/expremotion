import React from "react";
import { Helmet } from "react-helmet";
import "./Loading.css";

const Loading = () => {
  return (
    <main className='main'>
      <Helmet>
        <script src='https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'></script>
      </Helmet>
      <div>
        <lottie-player
          src='https://assets2.lottiefiles.com/datafiles/tvGrhGYaLS0VjreZ1oqQpeFYPn4xPO625FsUAsp8/simple loading/simple.json'
          background='transparent'
          speed='1'
          style={{ width: 500, height: 500 }}
          loop
          autoplay></lottie-player>
      </div>
    </main>
  );
};

export default Loading;
