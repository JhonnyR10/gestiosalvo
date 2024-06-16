export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";

export const setAccessToken = (username, password) => ({
  type: SET_ACCESS_TOKEN,
  payload: { username, password },
});
