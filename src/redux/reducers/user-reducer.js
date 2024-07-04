// import { SET_ACCESS_TOKEN } from "../actions";

// const initialState = {
//   accessToken: false,
// };

// const predefinedUsername = "admin";
// const predefinedPassword = "password123";

// const userReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_ACCESS_TOKEN:
//       const { username, password } = action.payload;
//       if (username === predefinedUsername && password === predefinedPassword) {
//         return {
//           ...state,
//           accessToken: true,
//         };
//       } else {
//         return {
//           ...state,
//           accessToken: false,
//         };
//       }

//     default:
//       return state;
//   }
// };

// export default userReducer;

import { SET_USER, CLEAR_USER } from "../actions";

const initialState = {
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default userReducer;
