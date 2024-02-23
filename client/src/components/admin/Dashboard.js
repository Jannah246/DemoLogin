import React from "react";
import UserData from "./UserData";

const Dashboard = () => {
  return (
    <div className="container mx-auto">
      <div className="w-full h-[96vh] bg-[#0000004c] backdrop-blur rounded-lg my-3 p-5">

        <div className="flex justify-between items-center">
          <h5 className="text-xl font-bold">Admin Panel</h5>
          <div className="bg-white lg:w-1/2 w-3/4 rounded-md">
            <input
              type="search"
              placeholder="search here.."
              className="w-full px-2 py-1 outline-none border-none rounded-md bg-slate-200"
            />
          </div>
        </div>

        <UserData />

      </div>
    </div>
  );
};

export default Dashboard;
