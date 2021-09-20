import {
  faArrowLeft,
  faArrowRight,
  faCompass,
  faHome,
  faPaperPlane,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

const SHeader = styled.header`
  width: 100%;
  z-index: 5;
  border-bottom: 1px solid var(--main-border);
  background: var(--white);
  position: fixed;
  top: 0;
  padding: 15px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: #6c7a89;
  }
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  font-size: 18px;
  font-weight: 400;
  color: var(--main-black);
  select: none;
`;

const Icon = styled.span`
  text-decoration: none;
  margin-left: 15px;
`;

export const Header = ({ screenName }) => {
  const history = useHistory();
  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Icon>
            <span onClick={() => history.goBack()}>
              <FontAwesomeIcon icon={faArrowLeft} size='sm' />
            </span>
          </Icon>
          <Icon>
            <span>{screenName}</span>
          </Icon>
          <Icon></Icon>
        </Column>
      </Wrapper>
    </SHeader>
  );
};
