// route reducer, so bring in all others
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import postReducer from "./postReducer";

export default combineReducers({
  // object with reducers, can call it whatever you want
  // now this.props.auth in anything else
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer
});
