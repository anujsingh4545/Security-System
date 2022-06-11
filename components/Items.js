import React from "react";
import { MdDownload } from "react-icons/md";
import { MdDelete } from "react-icons/md";

function Items({image,date}) {

  console.log(image,date);
  return (
    <div className=" flex-wrap w-[100%] sm:w-[49%]  lg:w-[32%] rounded-lg  border-2 border-slate-200 shadow-md shadow-[#00000046] py-2 px-2 my-5 ">
      <section className="w-[100%] h-[15rem] relative  border-0 border-black  ">
        <img src= {image} alt="" className="rounded-sm bg-cover w-[100%] h-[15rem]  " />
      </section>

      <section className="w-[100%] border-0 border-black mt-2 flex justify-center items-center py-2 ">
        {/* <MdDownload className=" text-[2rem] text-slate-500 cursor-pointer " /> */}
        <p className="font-serif italic font-thin tracking-wide text-[1.5rem] ">{date}</p>
        {/* <MdDelete className=" text-[2rem] text-slate-500 cursor-pointer " /> */}
      </section>
    </div>
  );
}

export default Items;
