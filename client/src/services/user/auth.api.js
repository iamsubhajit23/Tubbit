import api from "../api.js";
import errorToast from "../../utils/notification/error.js"
import successToast from "../../utils/notification/success.js"

const signUp = async (credentials) => {
    try {
        if (!credentials.avatar) {
           errorToast("Avatar is missing")
           return {error: true, message: "Avatar is missing"}
        }

        const formData = new FormData()
        formData.append("username",credentials.username)
        formData.append("fullname", credentials.fullname)
        formData.append("email", credentials.email)
        formData.append("password", credentials.password)
        formData.append("avatar", credentials.avatar)

        if (credentials.coverimage) {
            formData.append("coverimage", credentials.coverimage)
        }

        const res = await api.post("/user/register",formData)

        if (![200,201].includes(res.status)) {
            errorToast("Signup failed. Please try again.")
            return {error: true, message: res.statusText}
        }
        
        successToast("Signup successfull")
        return res.data

    } catch (error) {
        console.error("Auth Service Error :: signup ::", error);
        errorToast(error.response?.data?.message || "Signup failed.")
        return {error: true, message: error.message || "Signup failed."}
    }
}


export {
    signUp,
}