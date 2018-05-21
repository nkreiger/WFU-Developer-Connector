import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {};

// always export function with initial state then action
export default function(state = initialState, action) {
  switch (
    action.type // can send a payload
  ) {
    case GET_ERRORS:
      return action.payload; // payload includes errors object from server
    // from the axios call
    // now test cases
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
