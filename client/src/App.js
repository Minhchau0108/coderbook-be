import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Routes from "./routes";
import { authActions } from "./redux/actions/auth.actions";

import "./config/theme.css";
import "./index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngry,
  faLaugh,
  faSadCry,
  faThumbsUp,
  faHeart,
  faPlus,
  faTrashAlt,
  faEdit,
  faChevronLeft,
  faSort,
  faCheckSquare,
  faTimesCircle,
  faPauseCircle,
  faCircle,
  faUser,
  faRegistered,
  faChartLine,
  faSignOutAlt,
  faSignInAlt,
  faUsers,
  faCalendar,
  faUserFriends,
  faFlag,
  faAngleDown,
  faCaretDown,
  faCog,
  faBell,
  faVideo,
  faPhotoVideo,
  faComment,
  faShare,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";

import { fab, faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

library.add(
  fab,
  faAngry,
  faLaugh,
  faSadCry,
  faThumbsUp,
  faHeart,
  faPlus,
  faTrashAlt,
  faEdit,
  faChevronLeft,
  faSort,
  faCheckSquare,
  faTimesCircle,
  faPauseCircle,
  faCircle,
  faUser,
  faRegistered,
  faChartLine,
  faSignOutAlt,
  faSignInAlt,
  faUsers,
  faCalendar,
  faUserFriends,
  faFlag,
  faAngleDown,
  faCaretDown,
  faCog,
  faBell,
  faFacebookMessenger,
  faVideo,
  faPhotoVideo,
  faComment,
  faShare,
  faSmile
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && accessToken !== "undefined") {
      dispatch(authActions.getCurrentUser(accessToken));
    } else {
      dispatch(authActions.logout());
    }
  }, [dispatch]);

  return (
    <div className='App'>
      <Router>
        <Routes />
      </Router>
    </div>
  );
}

export default App;
