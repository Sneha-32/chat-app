import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set)=>({    //create receives a function
    authUser:null,                              //set later update the store's state

    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set ({authUser:res.data});
        } catch (error) {
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async ({data})=>{
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account Created Successfully");
            // now authUser contains the loggid in user's info so that it redirect them away from the login/signup pages
        } catch (error) {
            toast.error(error.response.data.message);

        }finally{
            set({isSigningUp:false});
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
            // this help to show the error that may occured in backend
        }
    }
}));