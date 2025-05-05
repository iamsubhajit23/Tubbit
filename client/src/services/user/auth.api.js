import api from "../api.js";
import successToast from "../../utils/notification/success.js"
import {apiErrorHandler} from "../../utils/apiErrorHandler.js"

const signUp = async (credentials) => {
    try {
        if (!credentials.avatar) {
           apiErrorHandler(null, "Avatar is required")
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
            apiErrorHandler(null, "Signup failed. Please try again.")
        }
        
        successToast("Signup successfull")
        return res.data

    } catch (error) {
        return apiErrorHandler(error, "Signup failed.")
    }
}

const signIn = async(credentials) => {
    try {
       const {username, email, password} = credentials

       if (!username || !email || !password) {
        return apiErrorHandler(null, "Missing required fields")
       }

       const res = await api.post("/user/login",
        {
            username,
            email,
            password
        }
    )

    if (res.status !== 200) {
        return apiErrorHandler(null, "Signin failed. Please try again")
    }

    successToast("Signin successfull")
    return res.data

    } catch (error) {
        return apiErrorHandler(error, "Signin failed")
    }
}


export {
    signUp,
    signIn
}