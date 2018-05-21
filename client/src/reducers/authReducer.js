import { SET_CURRENT_USER } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  // default initial
  isAuthenticated: false,
  user: {}
};

// always export function with initial state then action
export default function(state = initialState, action) {
  switch (
    action.type // can send a payload
  ) {
    // now test cases
    case SET_CURRENT_USER:
      return {
        ...state, //current state
        isAuthenticated: !isEmpty(action.payload), // depends on payload
        // when logged out pass in an empty obect and they will no longer be authenticated
        user: action.payload // user is actual payload
      };
    default:
      return state;
  }
}
