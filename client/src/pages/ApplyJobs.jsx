import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button,Label, Select, Spinner, TextInput, Alert, FileInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export default function ApplyJobs() {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const { jobSlug } = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();
    const [publishError, setPublishError] = useState(null);
    const [job, setJob] = useState(null);

    const handleUploadFile = async () => {
        try {
            if (!file) {
                setFileUploadError('Please select a file');
                return;
            }
            setFileUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setFileUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setFileUploadError('File upload failed');
                    setFileUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFileUploadProgress(null);
                        setFileUploadError(null);
                        setFormData({ ...formData, resume: downloadURL });
                    });
                }
            );
        } catch (error) {
            setFileUploadError('File upload failed');
            setFileUploadProgress(null);
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/job/getjobs?slug=${jobSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                } else if (data.job && data.job.length > 0) {
                    setJob(data.job[0]); // Set the job state with the fetched job details
                } else {
                    setError(true);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobSlug]);

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const countryData = response.data.map(country => ({
                    code: country.cca2,
                    name: country.name.common
                }));
                setCountries(countryData);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/apply/createApply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formData},jobSlug ),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
            } else {
                setPublishError(null);
                navigate(`/apply/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };

    if (loading)
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );

return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
    <div className="container mt-10 p-2">
    <div className='border border-gray-500 rounded-lg p-3 gap-20'>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    
        <h1 className="text-3xl font-bold mb-5">Apply for job: {job && job.jobTitle}</h1>
           

          <h2 className="text-lg font-bold mb-3">General information</h2>

          <TextInput 
            type="text" 
            name="fullName" 
            onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            placeholder="Full Name" 
            className="form-input w-full mb-4" 
            required />

          <TextInput 
            type="email" 
            name="email" 
            onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              } 
            placeholder="Email" 
            className="form-input w-full mb-4" 
            required />

          
          <TextInput 
            type="title" 
            name="address" 
            onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            placeholder="Address" 
            className="form-input w-full mb-4" 
            required />

          <div className='flex flex-row gap-5'>
            <TextInput 
                type="text" 
                name="city" 
                onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }  
                placeholder="City" 
                className="form-input w-full  mb-4" 
                required />
          </div>

          {/* Dropdown for selecting country */}
          <Select
            name="country"
            onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            className="form-select w-full mb-4"
            required
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>{country.name}</option>
            ))}
          </Select>

          <TextInput 
            type="number" 
            name="telNo" 
            onChange={(e) =>
                setFormData({ ...formData, telNo: e.target.value })
              }
            placeholder="Contact Number" 
            className="form-input w-full mb-4" 
            required />

          
        
        <h2 className="text-lg font-bold mb-3">Other Information</h2>


        <h2 className="flex-wrap text-lg font-bold mb-3 gap-7">Bio</h2>
        <ReactQuill
          theme='snow'
          placeholder='Bio'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, bio: value });
          }}
        />


        <Label className='mt-5' value='Primary role' />
            <TextInput 
                type="text"
                onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }  
                name="role" 
                placeholder='role'
                className="form-input w-full  mb-4"
                required/>
       
    
         
            <Label value='Skills' />
            <TextInput 
                type="text"
                onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                }  
                name="skills" 
                placeholder='skills'
                className="form-input w-full  mb-4"
                required/>
           
           <div className='flex mt-5 gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='pdf/* , msword/*' onChange={(e) => setFile(e.target.files[0])} />
                            <Button
                                type='button'
                                gradientDuoTone='purpleToBlue'
                                size='sm'
                                outline
                                onClick={handleUploadFile}
                                disabled={fileUploadProgress}
                            >
                                {fileUploadProgress ? (
                                    <div className='w-16 h-16'>
                                        <CircularProgressbar
                                            value={fileUploadProgress}
                                            text={`${fileUploadProgress || 0}%`}
                                        />
                                    </div>
                                ) : (
                                    'Upload CV'
                                )}

                            </Button>
                        </div>

                        {fileUploadError && <Alert color='failure'>{fileUploadError}</Alert>}
                        {formData.resume && (
                            <a
                                href={formData.resume}
                                rel="noopener noreferrer"
                                className=' flex w-full h-40 bg-gray-200 text-center items-center justify-center'
                            >
                                View Uploaded File
                            </a>
                        )
                        }

          

        <button type="submit" className="mt-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Apply now</button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
        
      </form>  
                

      </div>
      
     

      <div className="mt-5 text-center">
        <Link to="/searchjobs" className="text-blue-500 hover:underline">Recent jobs</Link>
      </div>

     

    </div>
    </div>);
}