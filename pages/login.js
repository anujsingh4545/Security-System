import React, { useRef, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRouter } from 'next/router'
import axios from 'axios'
import VideoSection from '../components/VideoSection'

function login() {
  let username = useRef(null)
  let Password = useRef(null)
  const [loading, setLoading] = useState(false)
  const [verified,setVerified]= useState(false)

  const router = useRouter()

  const submitRequest = async () => {
    if (loading) return

    setLoading(true)

    if (username.current.value === '' || Password.current.value === '') {
      alert('Empty fields are not allowed ⚠️')
      setLoading(false)
    }
      else if(!verified){
        alert('Verify face id to continue further ⚠️')
        setLoading(false)
      
    } else if (username.current.value.includes(' ')) {
      alert("Username can't contain spaces ⚠️")
      setLoading(false)
    } else if (Password.current.value.length < 8) {
      alert("Password length can't be less than 8 ⚠️")
      setLoading(false)
    } else {
      const docRef = doc(db, 'userlist', username.current.value) // getting user data from firebase
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        if (Password.current.value === docSnap.data().password) {
          setLoading(false)

          // Pussing username to local storage to fetch at right time
          localStorage.setItem(
            'securer',
            JSON.stringify(username.current.value)
          )

          let user = username.current.value
          let pass = Password.current.value
          const credentials = { user, pass }
        

          const users = await axios.post('/api/auth/login', credentials)

          alert(`Welcome ${username.current.value} 🙂`)
          username.current.value = ''
          Password.current.value = ''

          if (users.status === 200) {
            router.replace('/home')
          }
        } else {
          alert("Password didn't match, try again ☹️ ")
          setLoading(false)
        }
      } else {
        alert('No user exists, please create an account to continue 🙂')
        username.current.value = ''
        Password.current.value = ''
        setLoading(false)
        router.replace('/')
      }
    }
  }

  return (

    <div className=' w-[100%] md:h-[100vh] max-w-[120rem] flex flex-col md:flex-row items-center border-0 border-black m-auto relative ' >
<VideoSection verifys = {setVerified} />
    <div className= ' w-[100%] md:w-[50%] flex justify-center items-center border-0 border-black mb-10 md:mb-0 ' >
      <section className="">
        {/*  */}

        <h1 className="  text-center font-serif text-[3rem] font-medium tracking-wide text-black md:text-[4.2rem]">
          Login to your account
        </h1>

        <div className="mt-16 flex w-[100%] flex-col items-center justify-start px-3 ">
          {/*  */}

          <section className="flex w-[100%]  flex-col justify-start">
            <p className="font-serif text-[1.6rem] tracking-wide text-black">
              Username*
            </p>

            <input
              ref={username}
              type="text"
              className="my-4 w-[100%] rounded-lg bg-white px-5 py-3 text-[1.5rem] text-slate-700 shadow-md outline-none "
            />
          </section>

          <section className="flex w-[100%]  flex-col justify-start">
            <p className="font-serif text-[1.6rem] tracking-wide text-black">
              Password*
            </p>

            <input
              ref={Password}
              type="password"
              className="my-4 w-[100%] rounded-lg bg-white px-5 py-3 text-[1.5rem] text-slate-700 shadow-md outline-none "
            />
          </section>

          <button
            className="mt-10  w-[100%] rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-center font-serif text-[1.7rem] italic tracking-wider  text-white "
            onClick={submitRequest}
          >
            {loading ? 'loading...' : 'Log in'}
          </button>

          <p className="my-3 w-[100%] text-center font-serif text-[1.6rem] tracking-wide text-black ">
            or
          </p>

          <a
            href="/"
            className="   w-[100%] rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-center font-serif text-[1.7rem] italic tracking-wider  text-white "
          >
            Create Account
          </a>

          {/*  */}
        </div>

        {/*  */}
      </section>
    </div>
    </div>
  )
}

export default login
