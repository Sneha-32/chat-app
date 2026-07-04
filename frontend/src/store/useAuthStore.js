import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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

    login: async(data)=>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false})
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
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res= await axiosInstance.put("/auth/update-profile",data);
            set({ authUser: res.data });
            toast.success("profile uploaded successfylly")
        } catch (error) {
            toast.error("error.response.data.message")
        }finally{
            set({isUpdatingProfile:false})
        }
    }
}));