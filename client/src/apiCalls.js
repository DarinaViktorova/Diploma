import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const response = await axios.post("auth/login", userCredential);
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
    } catch (error) {
        dispatch({ type: "LOGIN_IS_FAILED", payload: error });
    }
}
export const logoutCall = async (dispatch) => {
    dispatch({ type: "LOGOUT" });
};