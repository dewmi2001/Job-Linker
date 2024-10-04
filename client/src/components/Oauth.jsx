import { useState } from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../Firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userType, setUserType] = useState('general');

    const handleGoogleClick = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                    userType: userType // Include selected userType
                }),
                })
            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    } 
  return (
    <div className=' flex flex-col gap-4'>
      <div className='flex flex-col gap-4'>
        <label htmlFor="userType" className="block font-semibold flex-col gap-4">Or signup with google :</label>
      </div>

      <div>
      <label htmlFor="userType" className="block font-semibold flex-col gap-4">User Type</label>
      <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-purple-500"> 
        <option value="general">General</option>
        <option value="employer">Employer</option>
        <option value="institute">Institute</option>
        <option value="admin">Admin</option>
      </select>
      <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
          <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
          Continue with Google
      </Button>

      </div>
      
    </div>
  )
}
