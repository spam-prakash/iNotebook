import React, { useEffect } from "react";
import notes from '../assets/notes.png';
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
  const { name, username, email } = props.user || {};
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
        navigate("/login");
      }
  }, [navigate])
  

  const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    }

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="container mx-auto bg-[#0A1122] bg-opacity-75 rounded-lg shadow-lg py-12 w-auto max-w-full">
         <div class="px-4 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-white">
            Profile Details
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Details and informations about you.
        </p>
    </div>

        <div className="mx-6 mt-3 border-t border-red-200">
            <div className="px-4 py-2 grid sm:grid sm:grid-cols-3 gap-16 sm:px-6">
                <dt className=" attribute text-lg font-medium ">
                    Name
                </dt>
                <dd className="value text-lg  sm:mt-0 sm:col-span-2">
                   {name}
                </dd>
            </div>
            <div className="px-4 py-2 grid sm:grid sm:grid-cols-3 gap-16 sm:px-6">
                <dt className=" attribute text-lg font-medium ">
                    Username
                </dt>
                <dd className="value text-lg  sm:mt-0 sm:col-span-2">
                    {username}
                </dd>
            </div>
            <div className="px-4 pt-2 pb-0 grid sm:grid sm:grid-cols-3 gap-16 sm:px-6">
                <dt className=" attribute text-lg font-medium ">
                    Email
                </dt>
                <dd className="value text-lg  sm:mt-0 sm:col-span-2">
                    {email}
                </dd>
            </div>

        </div>    
          
      </div>
    </div>
  );
};

export default Profile;
