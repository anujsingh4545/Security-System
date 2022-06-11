import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import React, { useState, useRef, useEffect } from 'react'
import { BsCaretRightFill } from 'react-icons/bs'
import { FiLogOut } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { Triangle } from 'react-loader-spinner'
import { db } from '../firebase'
import { HiMenu } from 'react-icons/hi'
import { MdOutlineCloudUpload } from 'react-icons/md'
import Items from './Items'
import { ref } from 'firebase/storage'
import { storage } from '../firebase'
import { getDownloadURL, uploadString } from 'firebase/storage'
import { stringify } from 'querystring'
import axios from 'axios'
import { useRouter } from 'next/router'

function Gallery({ name, call, user, menu }) {
  const [loading, setLoading] = useState(true)
  const filePicker = useRef(null)
  const [loader, setLoader] = useState(false)
  const [selectedFile, SetSelectedFile] = useState('')
  const [filename, setFilename] = useState('')
  const [submit, setSubmit] = useState(false)
  const [posts, setPosts] = useState([])
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'userlist', user, name),
        orderBy('timeStamp', 'desc')
      ),
      (snapshot) => {
        setPosts(snapshot.docs)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [db, submit, name])

  console.log(posts)

  async function deleteFolder() {
    if (confirm('Are you sure you want to delete this folder ? ')) {
      setLoading(true)

      const docRef = doc(db, 'userlist', user)
      let Folder
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        Folder = docSnap.data().folders
      }

      //   Remove folder from Folders option
      for (let i = 0; i < Folder.length; i++) {
        if (Folder[i] === name) {
          Folder.splice(i, 1)
        }
      }

      //   Update details from accounts
      await updateDoc(docRef, {
        folders: Folder,
      })

      call(false)
      setLoading(false)
    }
  }

  const uploadImage = async () => {
    if (submit) return
    setSubmit(true)

    var today = new Date()

    let date =
      today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
    let dates =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate() +
      '-' +
      today.getHours() +
      '-' +
      today.getMinutes() +
      '-' +
      today.getSeconds()
    let time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()

    const data = JSON.stringify(dates)

    const docRef = await addDoc(collection(db, 'userlist', user, name), {
      timeStamp: serverTimestamp(),
      day: date,
    })

    const imageRef = await ref(storage, `posts/${user}/${name + date + time}`)

    await uploadString(imageRef, selectedFile, 'data_url').then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'userlist', user, name, docRef.id), {
          image: downloadUrl,
        })
        SetSelectedFile(null)
        setSubmit(false)
      }
    )
  }

  // Adding image first them asking for submitting it or not
  function addImageToPost(e) {
    const reader = new FileReader()
    if (e.target.files[0]) {
      setFilename(e.target.files[0].name)
      reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent) => {
      SetSelectedFile(readerEvent.target.result)
    }
  }

  // For logging out of session
  const logOut = async () => {
    const user = await axios.get('../api/auth/log')
    if (user.status === 200) {
      localStorage.setItem('USERNAME', JSON.stringify(''))
      router.replace('/login')
    }
  }

  if (loading) {
    return (
      <div className=" m-auto flex h-[100vh] w-[100%] items-center justify-center bg-black">
        <Triangle color="#00BFFF" height={80} width={80} />
      </div>
    )
  }

  return (
    <div className="   h-[100vh] w-[100%] md:absolute md:right-0  md:w-[80%] ">
      <div className=" flex h-[5rem] items-center justify-between bg-[#051e34] px-5 ">
        {/*  */}

        <div className="mr-5  flex flex-1 items-center py-4     ">
          <HiMenu
            className=" mr-4 cursor-pointer text-[2rem]  text-slate-400 md:hidden "
            onClick={() => {
              menu(true)
            }}
          />
          <BsCaretRightFill className="mr-5 hidden text-[2rem]  text-slate-400 md:inline  " />
          <p className="font-serif  text-[1.8rem] italic tracking-widest text-slate-100  ">
            {name}
          </p>
        </div>

        <section className=" flex  items-center  ">
          {name != 'General' && (
            <MdDelete
              className="mr-3 cursor-pointer text-[2.3rem] text-slate-500 hover:scale-110 hover:text-slate-200 "
              onClick={deleteFolder}
            />
          )}

          <div className="hidden items-center rounded-full border-[0.1rem] border-slate-600 bg-slate-800 px-7 py-3  md:flex  ">
            <p className=" text-[1.2rem] italic tracking-wide text-slate-100 ">
              {user}
            </p>
            <FiLogOut
              className="ml-4 animate-pulse cursor-pointer text-[1.5rem] text-red-600  "
              onClick={() =>
                alert(
                  'Logout functionality not working currently , although user will be automatically logout after some time ! '
                )
              }
            />
          </div>
          <FiLogOut
            className="z-0 ml-4 animate-pulse cursor-pointer text-[1.5rem]  text-red-600 md:hidden  "
            onClick={() =>
              alert(
                'Logout functionality not working currently , although user will be automatically logout after some time ! '
              )
            }
          />
        </section>

        {/*  */}
      </div>

      {/* Creating interior upload and view section */}

      <section className=" h-[calc(100vh-5rem)] w-[100%]  overflow-y-scroll px-5 scrollbar-hide   ">
        {/*  */}

        <section className="flex  flex-col sm:flex-row  ">
          <div
            className="my-5 flex w-fit  cursor-pointer items-center rounded-xl  bg-green-800 hover:scale-105 "
            onClick={() => filePicker.current.click()}
          >
            <div className=" flex items-center rounded-l-xl bg-green-700 px-4 py-4 sm:px-6 sm:py-5 ">
              <MdOutlineCloudUpload className=" text-[1.8rem]  text-slate-100 sm:text-[2rem]  " />
            </div>
            <p className=" mx-10 font-serif text-[1.5rem] font-medium tracking-wider  text-slate-100 sm:mx-14 sm:text-[1.6rem] ">
              {' '}
              {loader ? 'Loading..' : 'Upload Files'}{' '}
            </p>
            <input
              type="file"
              className="hidden"
              ref={filePicker}
              onChange={addImageToPost}
            />
          </div>
          {selectedFile?.length > 0 && (
            <div className="flex items-center">
              <p className="mr-10 flex-1 truncate font-serif  text-[1.4rem] italic text-slate-500 sm:mx-10 ">
                {filename}
              </p>
              <section
                className=" ml-1 cursor-pointer rounded-xl bg-slate-300 py-2  px-10 font-serif text-[1.5rem] font-normal tracking-wider text-slate-800 md:mx-3 "
                onClick={() => {
                  SetSelectedFile('')
                }}
              >
                Cancel
              </section>
              <section
                className=" ml-4 cursor-pointer rounded-xl bg-slate-300 py-2  px-10 font-serif text-[1.5rem] font-normal tracking-wider text-slate-800 md:mx-3 "
                onClick={uploadImage}
              >
                {submit ? 'Loading...' : 'Submit'}
              </section>
            </div>
          )}
        </section>

        <section className="flex w-[100%] flex-wrap items-start justify-between  ">
          {posts.map((datas, index) => (
            <Items
              key={index}
              image={datas.data().image}
              date={datas.data().day}
            />
          ))}
        </section>

        {/*  */}
      </section>
    </div>
  )
}

export default Gallery
