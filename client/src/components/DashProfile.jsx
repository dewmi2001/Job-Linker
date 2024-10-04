import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'; 
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice';
import { Alert, Button, Modal, ModalBody, TextInput, Label } from 'flowbite-react'; 
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '../index.css';

export default function DashProfile() {
  const { currentUser, error, loading  } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [about, setAbout] = useState(''); // State variable for storing About information
  const [editMode, setEditMode] = useState(false); // State variable for tracking edit mode
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'about') {
      setAbout(value); // Update the local state for the "About" field
    } else {
      setFormData({ ...formData, [id]: value }); // Update other fields in formData
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for the image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, about }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
        // Clear the image file and URL state variables
        setImageFile(null);
        setImageFileUrl(null);
        setEditMode(false); // Disable edit mode after successful update
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const redirectToCreatePost = () => {
    if (currentUser.isEmp) {
      return '/createjobs';
    }
    if (currentUser.isInst) {
      return '/createcourse';
    } else {
      return '/createpost';
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>{currentUser.fullname}</h1>


      {/* Profile form */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

        

        {/* Edit Profile button */}
      {!editMode && (
        <Button onClick={() => setEditMode(true)} gradientDuoTone='purpleToPink' className='mb-4'>
          Edit Profile
        </Button>
      )}
        
        {/* Display fields in read-only mode if not in edit mode */}
        {!editMode && (
          <>
          <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: { stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})` },
              }}
            />
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
            }`}
          />
        </div>

       
          

            <div className="field-wrapper">
              <Label value="About" />
              <p className='mt-10 p-3 max-w-6xl text-justify mx-auto w-full font-black font-serif post-content' dangerouslySetInnerHTML={{ __html: currentUser && currentUser.about }} />
            </div>

            <div className="field-wrapper">
              <Label value={currentUser.userType === 'employer' ? 'Company Name' : (currentUser.userType === 'institute' ? 'Institute Name' : 'Your Fullname')} />
              <p className='mt-10 p-3 font-black font-serif'>{currentUser.fullname}</p>
            </div>
            
            <div className="field-wrapper">
              <Label value="Username" />
              <p className='mt-10 p-3 font-black font-serif'>{currentUser.username}</p>
            </div>

            <div className="field-wrapper">
              <Label value="Location" />
              <p className='mt-10 p-3 font-black font-serif'>{currentUser.address}</p>
            </div>

            {currentUser.isAdmin || currentUser.isEmp || currentUser.isInst ? null : (
              <div className="field-wrapper">
                <Label value="Your gender" />
                <p className='mt-10 p-3 font-black font-serif'>{currentUser.gender}</p>
              </div>
            )}
            {currentUser.userType === 'general' && (
              <div className="field-wrapper">
                <Label value="Date of Birth" />
                <p className='mt-10 p-3 font-black font-serif'>{currentUser.dateofbirth}</p>
              </div>
            )}

            <div className="field-wrapper">
              <Label value="Email" />
              <p className='mt-10 p-3 font-black font-serif'>{currentUser.email}</p>
            </div>

            <div className="field-wrapper">
              <Label value="Password" />
              <p className='mt-10 p-3 font-black font-serif'>********</p>
            </div>
          </>
        )}


        {/* Editable fields */}
        {editMode && (
          <>

        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: { stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})` },
              }}
            />
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
            }`}
          />
        </div>

        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}

            <Label value="About" />
            <ReactQuill
              theme='snow'
              placeholder='Write about ...'
              className='h-72 mb-12'
              required
              defaultValue={currentUser.about} 
              onChange={handleChange}
            />

            <Label value={currentUser.userType === 'employer' ? 'Company Name' : (currentUser.userType === 'institute' ? 'Institute Name' : 'Your Fullname')} />
            <TextInput type='text' id='fullname' placeholder={currentUser.userType === 'employer' ? 'Company Name' : (currentUser.userType === 'institute' ? 'Institute Name' : 'Your Fullname')} defaultValue={currentUser.fullname} onChange={handleChange} />
            
            <Label value="Username" />
            <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />

            <Label value="Location" />
            <TextInput type='text' id='address' placeholder='location' defaultValue={currentUser.address} onChange={handleChange} />


            {currentUser.isAdmin || currentUser.isEmp || currentUser.isInst ? null : (
              <div>
                <Label value="Your gender" />
                <select id="gender" onChange={handleChange} defaultValue={currentUser.gender} className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-purple-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
            {currentUser.userType === 'general' && (
              <TextInput type='text' id='dateofbirth' placeholder='Date of Birth' defaultValue={currentUser.dateofbirth} onChange={handleChange} />
            )}

            <Label value="Email" />
            <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />

            <Label value="Password" />
            <TextInput type='password' id='password' placeholder='Password' onChange={handleChange} />
          </>
        )}
        

        {/* Submit button */}
        {editMode && (
          <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading} >
            {loading ? 'Loading...' : 'Update'}
          </Button>
        )}

        {/* Create post buttons */}
        {currentUser && !editMode && (
          <>
            {currentUser.isAdmin && (
              <Link to={redirectToCreatePost()}>
                <Button
                  type='button'
                  gradientDuoTone='purpleToPink'
                  className='w-full'
                >
                  Create a Post
                </Button>
              </Link>
            )}
            {currentUser.isEmp && (
              <Link to='/createjobs'>
                <Button
                  type='button'
                  gradientDuoTone='purpleToPink'
                  className='w-full'
                >
                  Create a Job
                </Button>
              </Link>
            )}
            {currentUser.isInst && (
              <Link to='/createcourse'>
                <Button
                  type='button'
                  gradientDuoTone='purpleToPink'
                  className='w-full'
                >
                  Create a Course
                </Button>
              </Link>
            )}
          </>
        )}

      </form>

      {/* Delete account and sign out buttons */}
      <div className='text-red-500 flex justify-between mt-5'>

        <span onClick={() => setShowModal(true)} className='cursor-pointer'>
          Delete Account
        </span>

        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>

      </div>

      {/* Success and error alerts */}
      {updateUserSuccess && <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
      
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}

      {/* Delete account confirmation modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}
