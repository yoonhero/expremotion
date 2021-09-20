import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHome, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css";

const Navigation = ({ screenName, userObj }) => {
  return (
    <nav class='bottom-nav'>
      <ul class='nav-items'>
        <li>
          <Link to='/' class=''>
            <div className='column nav-items-li'>
              <span>
                <FontAwesomeIcon icon={faHome} size='lg' />
              </span>
              {/* <span>Home</span> */}
              {screenName === "home" && <div className='dot'></div>}
            </div>
          </Link>
        </li>
        <li>
          <Link to='/search' class=''>
            {/* <span>Search</span> */}
            <div className='column nav-items-li'>
              <span>
                <FontAwesomeIcon icon={faSearch} size='lg' />
              </span>
              {screenName === "search" && <div className='dot'></div>}
            </div>
          </Link>
        </li>
        <li>
          <Link to={`/profile/${userObj?.uid}`} class=''>
            {/* <span>
            {userObj.displayName ? `${userObj.displayName}` : "Profile"}
          </span> */}
            <div className='column nav-items-li'>
              <span>
                <FontAwesomeIcon icon={faUser} size='lg' />
              </span>
              {screenName === "profile" && <div className='dot'></div>}
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
