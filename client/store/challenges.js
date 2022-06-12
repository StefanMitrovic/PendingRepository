import axios from "axios";

const GET_CHALLENGES = "GET_CHALLENGES";

export const getChallenges = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const challenges = (
        await axios.get("/api/challenges/", {
          headers: {
            authorization: token,
          },
        })
      ).data;
      dispatch({ type: GET_CHALLENGES, challenges });
    }
  };
};

export default function (state = [], action) {
  switch (action.type) {
    case GET_CHALLENGES:
      return action.challenges;
    default:
      return state;
  }
}
