import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../styles/Username.module.css";
// import { useAuthStore } from "./../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux'; // redux

export default function Recovery() {
  const navigate = useNavigate();
  // const { username } = useAuthStore((state) => state.auth);
  const username = useSelector((state) => state.auth.username);
  const [OTP, setOTP] = useState();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      console.log(OTP);
      if (OTP) return toast.success("OTP has been send to your email..");
      return toast.error("Problem while generating OTP..");
    });
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success("Verfied successfully..");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong OTP.. check your mail again..");
    }
  }

  // resend otp handler
  function resendOTP() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "sending..",
      success: <b>Otp has been send to your email..</b>,
      error: <b>Error on generating otp..</b>,
    });
    sendPromise.then((OTP) => {
      console.log(OTP);
    });
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-right" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h5 className="text-3xl font-bold">Recovery</h5>
            <span className="py-3 text-md w-2/3 text-center text-gray-500">
              Enter Otp send to your mail here.
            </span>
          </div>

          <form className="pt-20" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  value={OTP}
                  className={`${styles.textbox} text-center !text-lg !font-black tracking-[4px]`}
                  type="text"
                  placeholder="OTP"
                />
              </div>

              <button className={styles.btn} type="submit">
                Recover
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?{" "}
              <button className="text-red-500" onClick={resendOTP}>
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
