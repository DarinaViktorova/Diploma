import axios from "axios";

export const postRegisterUser = async (user) => {
    return await axios.post("/auth/register", user);
}