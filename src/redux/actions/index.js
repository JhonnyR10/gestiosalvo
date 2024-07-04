// export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";

// export const setAccessToken = (username, password) => ({
//   type: SET_ACCESS_TOKEN,
//   payload: { username, password },
// });

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export const setUser = (user) => ({
  type: SET_USER,
  payload: {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  },
});

export const clearUser = () => ({
  type: CLEAR_USER,
});
