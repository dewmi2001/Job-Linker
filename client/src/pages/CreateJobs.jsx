import { useState } from 'react';
import { Button, FileInput, Select, TextInput, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

export default function CreateJobs() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    description: '',
    type: '',
    category: '',
    salary: '',
    location: '',
  });
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/job/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Job</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Job Title'
          required
          id='jobTitle'
          onChange={(e) =>
            setFormData({ ...formData, jobTitle: e.target.value })
          }
        />
        <TextInput
          type='text'
          placeholder='Company Name'
          required
          id='companyName'
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
        />
        <ReactQuill
          theme='snow'
          placeholder='Description'
          className='h-72 mb-12'
          required
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <TextInput
          type='text'
          placeholder='Enter category'
          required
          id='type'
          onChange={handleChange}
        />
        <Select required id='category'  onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }>
          <option value='uncategorized'>Select a Type</option>
          <option value='full-time'>Full-Time</option>
          <option value='part-time'>Part-Time</option>
          <option value='intern'>Internship</option>
        </Select>
        <TextInput
          type='number'
          placeholder='Salary'
          required
          id='salary'
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
        <TextInput
          type='text'
          placeholder='Location'
          required
          id='location'
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
        >
          Publish Job
        </Button>

        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}

      </form>
    </div>
  );
}
