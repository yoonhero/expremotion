import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHome, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Navigation.css";

const Navigation = () => (
  <nav class='bottom-nav'>
    <ul class='nav-items'>
      <li>
        <Link to='/' class=''>
          <FontAwesomeIcon icon={faHome} size='lg' />
          {/* <span>Home</span> */}
        </Link>
      </li>
      <li>
        <Link to='/search' class=''>
          <FontAwesomeIcon icon={faSearch} size='lg' />
          {/* <span>Search</span> */}
        </Link>
      </li>
      <li>
        <Link to='/profile' class=''>
          <FontAwesomeIcon icon={faUser} size='lg' />
          {/* <span>
            {userObj.displayName ? `${userObj.displayName}` : "Profile"}
          </span> */}
        </Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;
