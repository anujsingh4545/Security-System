import React from "react";
import { BsCaretRightFill } from "react-icons/bs";
import { useRecoilState } from "recoil";
import { folderName } from "../atom/folderName";

function Folderst({ name, call, close }) {
  const [folder, setFolder] = useRecoilState(folderName);

  async function execute() {
    await setFolder(name);
    close(false);
    call(true);
  }

  return (
    <div className="flex-1 px-3 mr-5 flex items-center py-4   cursor-pointer border-0  border-white rounded-r-full hover:bg-slate-700 " onClick={execute}>
      <BsCaretRightFill className="text-slate-400 text-[1.5rem] mr-5 " />
      <p className="text-[1.4rem]  text-slate-100 italic font-serif tracking-wider truncate ">{name}</p>
    </div>
  );
}

export default Folderst;
