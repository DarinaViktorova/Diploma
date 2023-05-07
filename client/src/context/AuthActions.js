export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
});

export const LoginFailed = (error) => ({
    type: "LOGIN_IS_FAILED",
    payload: error
});

export const Logout = () => ({
    type: "LOGOUT",
    payload: null,
})

export const Follow = (userId) => ({
    type: "FOLLOW",
    payload: userId,
})

export const Unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId,
})