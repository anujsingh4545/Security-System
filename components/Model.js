import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { FcOpenedFolder } from "react-icons/fc";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function Model({ set, user }) {
  let textEntered = useRef(null);
  const [lodaing, setLoading] = useState(false);

  const submitFolder = async () => {
    if (lodaing) return;

    let tesetText = textEntered.current.value;

    if (tesetText.length < 5) {
      alert("Folder name length should be greater than 5 ⚠️");
    } else if (tesetText.length > 30) {
      alert("Folder name length should be smaller than 30 ⚠️");
    } else {
      setLoading(true);
      const docRef = doc(db, "userlist", user);
      let Folder;
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        Folder = docSnap.data().folders;
      }

      Folder.push(`${textEntered.current.value}`);
      await updateDoc(docRef, {
        folders: Folder,
      });
      textEntered.current.value = "";
      setLoading(false);
      set(false);
    }
  };

  return (
    <>
      <div
        className=" w-[100%] h-[100vh] fixed bg-[#ffffff26] blur-md z-30 "
        onClick={() => {
          set(false);
        }}
      ></div>

      <div className=" w-[95%] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform   max-w-4xl border-0 border-black z-50">
        {/*  */}

        <section className="w-[100%] bg-gradient-to-r from-[#243e56] to-[#051e34] h-[4rem] flex justify-between px-5 items-center rounded-t-xl ">
          <p className=" text-[1.5rem] font-serif  italic text-slate-100 flex items-center tracking-wider  ">
            <FcOpenedFolder className="text-[2rem] mr-3 " /> Create Folder
          </p>

          <MdOutlineClose
            className="text-slate-300 text-[1.8rem] animate-pulse cursor-pointer  "
            onClick={() => {
              set(false);
            }}
          />
        </section>

        <section className="w-[100%] px-5 py-10 bg-black rounded-b-xl ">
          <p className=" text-[1.4rem] sm:text-[1.5rem] text-slate-100 italic font-serif tracking-wider font-medium  ">Enter name of folder to create !</p>

          <input ref={textEntered} autoFocus type="text" className=" outline-none text-[1.2rem]  tracking-wider rounded-md px-2 py-2 bg-slate-500 font-semibold italic  w-[100%] mt-3 " />
          <p className=" text-[0.9rem] sm:text-[1rem] text-slate-400 italic font-serif tracking-wide my-2 ">*Min 5 characters max 30 chanracters</p>

          <div className=" w-[100%] flex items-center justify-end my-4  sm:my-3 ">
            <button
              className=" bg-gradient-to-r from-[#243e56] to-[#051e34] px-14 py-3 text-slate-200 text-[1rem] sm:text-[1.1rem] font-serif italic tracking-wider rounded-xl"
              onClick={() => {
                textEntered.current.value = "";
                textEntered.current.focus();
              }}
            >
              Clear
            </button>
            <button className=" bg-gradient-to-r from-[#243e56] to-[#051e34] px-14 py-3 ml-5 text-slate-200 text-[1rem] sm:text-[1.1rem] font-serif italic tracking-wider rounded-xl" onClick={submitFolder}>
              {lodaing ? "Loading..." : "Submit"}
            </button>
          </div>
        </section>

        {/*  */}
      </div>
    </>
  );
}

export default Model;
