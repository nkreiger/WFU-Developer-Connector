import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode"; // to extract user from token

// types
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User with Redux
export const registerUser = (userData, history) => dispatch => {
  axios
    // send userData to backend
    .post("/api/users/register", userData) // will go to the backend post request
    .then(res => history.push("/login")) // on successful register go to login form
    .catch(err =>
      dispatch({
        // errors is all set now, has its own reducer in redux
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login --> Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save token to local storage
      const { token } = res.data;
      // Set token to local storage
      localStorage.setItem("jwtToken", token); // local storage only stores strings
      // Set token to Auth Header for every request if logged in
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        // same as register
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user function
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false); // deletes it
  // Set current user to empty object and will set isAuthenticated to false at same time because of our function in authReducer
  dispatch(setCurrentUser({}));
};
