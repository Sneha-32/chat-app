import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react';

const ProfilePage = () => {
          const {authUser,isUpdatingProfile,updateProfile}=useAuthStore();
          const [seletceImg,setSelectedImg]=useState(null);
          const handleImageUpload = async(e)=>{
            const file = e.target.files[0];

            // checks if the file exists if not simply return
            if(!file) {
              return
            };

            //FileReader is a JavaScript object that can read files from the user's computer.
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload= async()=>{
              const base64Image = reader.result;
              setSelectedImg(base64Image);
              // sending it to function so that it remains even if we are refreshing the page
              await updateProfile({profilePic:base64Image})
            }
          }
  return (
    <div>
      <div className='h-screen pt-20'>
        <div className='max-w-2xl mx-auto p-4 py-8'>
          <div className='bg-base-300 rounded-xl p-6 space-y-8'>
            <div className='text-center'>
              <h1 className='text-2xl font-semibold'>Profile</h1>
              <p className='mt-2'>Your profile information</p>
            </div>

            {/* avatar upload section */}
            <div className='flex flex-col items-center gap-4'>
              <div className='relative'>
                <img src={seletceImg||authUser.profilePic||"/avatar.png"} alt="Profile"
                className='size-32 rounded-full object-cover border-4'
                />
                {/* This should be working because it is inside the same label */}
                <label htmlFor='avatar-upload' className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile?"animate-pulse pointer-events-none":""}`}>
                  <Camera className='w-5 h-5 text-base-200'/>
                  <input type='file' id='avatar-upload' className='hidden' accept='image/*'
                  onChange={handleImageUpload} disabled={isUpdatingProfile}/> 
                  {/* the disabled thing is used here because if the user is uploading some image user should not be able to give some other image at the same time while after the image is uploaded the user can change again or it is usable again */}
                </label>
              </div>
              <p className='text-sm text-zinc-400'>
                {isUpdatingProfile?"Uploading...":"Click the camera icon to update your photo"}
              </p>
            </div>
            
            {/* data this may look like inputs but these are readable only where the user is unable to make changes*/}
            <div className='space-y-6'>
              <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <User className='w-4 h-4'/>
                  Full Name
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.fullName}</p>
              </div>
              <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <Mail className='w-4 h-4'/>
                  Email Address
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser?.email}</p>
                {/* here ?. is called optional chaining where if the authUser exists, it gives emial. Otherwise it returns undefined instead of throwing error */}
              </div>
            </div>

            {/* account info */}
            <div className='mt-6 bg-base-300 rounded-xl p-6'>
              <h2 className='text-lg font-medium mb-4'>Account Information</h2>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Account Status</span>
                  <span className='text-green-500'>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
