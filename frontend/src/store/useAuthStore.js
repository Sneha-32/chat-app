import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set,get)=>({    //create receives a function
    authUser:null,                              //set later update the store's state

    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers : [],
    socket:null,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set ({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async (data)=>{
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account Created Successfully");
            // now authUser contains the loggid in user's info so that it redirect them away from the login/signup pages

            get().connectSocket();
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

           get().connectSocket() 
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false})
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            get().disconnectSocket();
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
    },

    connectSocket: () =>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected){
            return;
        }
        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,   //using the userid
            }
        });
        socket.connect();

        set({socket:socket});  
        
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers: userIds});
        })
    },

    disconnectSocket: () =>{
        if(get().socket?.connected){
            get().socket.disconnect();
        }
    }
}));