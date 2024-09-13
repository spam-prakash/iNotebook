import React from 'react'
import { Link ,useLocation} from 'react-router-dom'
import notebook from '../assets/notes.png'
import {useNavigate  } from "react-router-dom";

const Navbar = (props) => {
  const navigate=useNavigate()
  const handleLogout=()=>{
    localStorage.removeItem('token')
    navigate('/login')
    props.showAlert("Logged Out","#D4EDDA")
  }
  
  let location=useLocation()
  // useEffect(() => {
    
  // }, [location])

  
  return (
    <>
    <nav className='z-30 flex bg-black py-3 justify-between fixed w-full '>
        <div className=" flex gap-3 left mx-4 relative">
            <Link to="/"><img className='size-11 cursor-pointer' src={notebook} alt="" /></Link>
            <Link to="/"><span className='text-3xl font-bold font-serif cursor-pointer text-white'>iNote<span className='text-[#FDC116]'>Book</span></span></Link>
        
            <ul className='flex gap-3 py-2 mx-3'>
                <li className={` font-serif cursor-pointer font-bold text-xl hover:underline  text-slate-400 ${location.pathname==="/"?"text-white font-extrabold":""} `}><Link to="/">Home</Link></li>
                <li className={` font-serif cursor-pointer font-bold text-xl hover:underline  text-slate-400 ${location.pathname==="/about"?"text-white font-extrabold":""} `}><Link to="/about">About</Link></li>
            </ul>
        </div>
       <div className="right mr-8 gap-4 flex -my-4">
       {!localStorage.getItem('token')? (<><Link className='bg-sky-600 hover:bg-sky-400 transition-all duration-300 py-1 my-auto px-3 font-bold text-white text-sm rounded-md ' to="/login">Login</Link>
          <Link className='bg-sky-600 hover:bg-sky-400 transition-all duration-300 py-1 my-auto px-3 font-bold text-white text-sm rounded-md '  to="/signup"> Signup</Link></>
        ):(<><Link className='bg-sky-600 hover:bg-sky-400 transition-all duration-300 py-1 my-auto px-3 font-bold text-white text-sm rounded-md ' to="/profile"> Profile</Link>
        <Link className='bg-sky-600 hover:bg-sky-400 transition-all duration-300 py-1 my-auto px-3 font-bold text-white text-sm rounded-md ' onClick={handleLogout}> Logout</Link>
        </>)}</div>
      
    </nav>






    </>
  )
}

export default Navbar