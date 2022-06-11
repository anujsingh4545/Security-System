import React, { useEffect, useState } from 'react'
import { FcOpenedFolder } from 'react-icons/fc'
import Folderst from '../components/Folderst'
import Model from '../components/Model'
import { db } from '../firebase'
import { Triangle } from 'react-loader-spinner'
import { doc, getDoc } from 'firebase/firestore'
import Gallery from '../components/Gallery'
import { useRecoilState } from 'recoil'
import { folderName } from '../atom/folderName'
import { FiLogOut } from 'react-icons/fi'
import { BsCaretRightFill } from 'react-icons/bs'
import { HiMenu } from 'react-icons/hi'
import axios from 'axios'
import { useRouter } from 'next/router'

function home() {
  const [modal, setmodal] = useState(false)
  const [user, setUser] = useState('')
  const [loading, setLoading] = useState(true)
  const [folders, setFolders] = useState([])
  const [gallery, setGallery] = useState(false)
  const [folder, setFolder] = useRecoilState(folderName)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      let leadsFromLocalStorage = await JSON.parse(
        localStorage.getItem('securer')
      )
      if (leadsFromLocalStorage) {
        await setUser(leadsFromLocalStorage)
      }
    }
    fetchData()
  }, [db])

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const docRef = await doc(db, 'userlist', user)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setFolders(docSnap.data().folders)
        }
        setLoading(false)
      }
    }

    fetchData()
  }, [user, db, modal, gallery])

  if (loading) {
    return (
      <div className=" m-auto flex h-[100vh] w-[100%] items-center justify-center bg-black">
        <Triangle color="#00BFFF" height={80} width={80} />
      </div>
    )
  }

  // For logging out of session
  const logOut = async () => {
    const user = await axios.get('../api/auth/log')
    if (user.status === 200) {
      localStorage.setItem('USERNAME', JSON.stringify(''))
      router.replace('/login')
    }
  }

  return (
    <div className="m-auto flex  h-[100vh] w-[100%] ">
      {/*  */}

      <section className="z-20  hidden h-[100%] w-[70%]  border-r-[0.1rem] border-slate-600 bg-gradient-to-r from-[#243e56]  to-[#051e34] md:block md:w-[20%]  ">
        {/*  */}

        <div className=" h-[5rem] border-b-[0.1rem] border-slate-600 bg-[#051e34] ">
          <img
            src="/logo.png"
            alt=""
            className="h-[100%] cursor-pointer py-3 "
            onClick={() => {
              setGallery(false)
              setOpen(false)
            }}
          />
        </div>

        {/*  */}

        {/* Section for showing folders , & yeah general folder is common  */}

        <div className="h-[calc(100vh-5rem)] w-[100%] flex-1  overflow-y-scroll border-0 border-white scrollbar-hide   ">
          {/*  */}

          <section
            className="my-[1rem] flex w-[100%]  cursor-pointer items-center border-t-[0.1rem] border-b-[0.1rem] border-slate-800 bg-slate-900 py-5 shadow-lg  shadow-slate-700 "
            onClick={() => {
              setmodal(true)
            }}
          >
            <FcOpenedFolder className=" mx-3 text-[2.5rem] " />
            <p className="pl-1   font-sans text-[1.5rem] font-normal italic tracking-wide text-gray-400 ">
              Create new folder
            </p>
          </section>

          <div className="mt-14 w-[100%] ">
            {folders.map((datas, index) => {
              return (
                <Folderst
                  key={index}
                  name={datas}
                  call={setGallery}
                  close={setOpen}
                />
              )
            })}
          </div>

          {/*  */}
        </div>

        {/*  */}
      </section>

      {open && (
        <div className="absolute  flex h-[100vh] w-[100%]  delay-150 duration-150 ease-in-out md:hidden  ">
          <section className="  z-20 h-[100%] w-[70%] border-r-[0.1rem] border-slate-600  bg-gradient-to-r from-[#243e56] to-[#051e34]  ">
            {/*  */}

            <div className=" h-[5rem] border-b-[0.1rem] border-slate-600 bg-[#051e34] ">
              <img
                src="/logo.png"
                alt="error"
                className="h-[100%] cursor-pointer py-3 "
                onClick={() => {
                  setGallery(false)
                  setOpen(false)
                }}
              />
            </div>

            {/*  */}

            {/* Section for showing folders , & yeah general folder is common  */}

            <div className="h-[calc(100vh-5rem)] w-[100%] flex-1  overflow-y-scroll border-0 border-white scrollbar-hide   ">
              {/*  */}

              <section
                className="my-[1rem] flex w-[100%]  cursor-pointer items-center border-t-[0.1rem] border-b-[0.1rem] border-slate-800 bg-slate-900 py-5 shadow-lg  shadow-slate-700 "
                onClick={() => {
                  setmodal(true)
                }}
              >
                <FcOpenedFolder className=" mx-3 text-[2.5rem] " />
                <p className="pl-1   font-sans text-[1.5rem] font-normal italic tracking-wide text-gray-400 ">
                  Create new folder
                </p>
              </section>

              <div className="mt-14 w-[100%] ">
                {folders.map((datas, index) => {
                  return (
                    <Folderst
                      key={index}
                      name={datas}
                      call={setGallery}
                      close={setOpen}
                    />
                  )
                })}
              </div>

              {/*  */}
            </div>

            {/*  */}
          </section>

          <div
            className=" z-20 h-[100vh] w-[30%] bg-[#ffffff1c] "
            onClick={() => {
              setOpen(false)
            }}
          ></div>
        </div>
      )}

      {gallery ? (
        <Gallery name={folder} call={setGallery} user={user} menu={setOpen} />
      ) : (
        <section className=" right-0 h-[100%] w-[100%] border-0  border-black md:absolute md:w-[80%]  ">
          {/*  */}

          <div className=" flex h-[5rem] items-center justify-between bg-[#051e34] px-5 ">
            {/*  */}

            <div className="  mr-5  flex flex-1 items-center py-4">
              <HiMenu
                className=" mr-4 cursor-pointer text-[2rem]  text-slate-400 md:hidden "
                onClick={() => {
                  open ? setOpen(false) : setOpen(true)
                }}
              />
              <BsCaretRightFill className="mr-2 hidden text-[1rem] text-slate-400 sm:mr-5 sm:text-[1.8rem] md:inline " />
              <p className=" font-serif text-[1.3rem]  italic tracking-wider text-slate-100 sm:text-[1.6rem]  ">
                Welcome to securer 🤍{' '}
              </p>
            </div>

            <section className=" hidden  items-center  sm:flex  ">
              <div className="flex items-center rounded-full border-[0.1rem] border-slate-600 bg-slate-800 px-7 py-3  ">
                <p className=" text-[1rem] italic tracking-wide text-slate-100 sm:text-[1.2rem] ">
                  {user}
                </p>
                <FiLogOut
                  className="z-0 ml-4 animate-pulse cursor-pointer text-[1.3rem] text-red-600 sm:text-[1.5rem]  "
                  onClick={() =>
                    alert(
                      'Logout functionality not working currently , although user will be automatically logout after some time ! '
                    )
                  }
                />
              </div>
            </section>
            <FiLogOut
              className="z-0 ml-4 animate-pulse cursor-pointer text-[1.5rem]  text-red-600 md:hidden  "
              onClick={() =>
                alert(
                  'Logout functionality not working currently , although user will be automatically logout after some time ! '
                )
              }
            />

            {/*  */}
          </div>

          <section className=" flex h-[calc(100vh-5rem)]  w-[100%] flex-col items-center justify-center  ">
            <img src="front.svg" alt="error" className=" w-[80%] md:w-[40%] " />
            <p className=" mt-10 text-center font-serif text-[1.4rem] font-thin italic text-slate-800 sm:text-[1.5rem] ">
              For uploading your photos & documents, <br /> either create a new
              folder or can upload directly into general folder, cheers 🙂{' '}
            </p>
          </section>

          {/*  */}
        </section>
      )}

      {/*  */}

      {modal && <Model set={setmodal} user={user} />}
    </div>
  )
}

export default home
