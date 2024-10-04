import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';

export default function SearchJobs() {
  const [sidebarData, setSidebarData] = useState({
    searchTerms: '',
    sort: 'desc',
    location: '', // Remove the default value
    category: '', // Remove the default value
  });

  const [job, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermsFromUrl = urlParams.get('searchTerms');
    const sortFromUrl = urlParams.get('sort');
    const locationFromUrl = urlParams.get('location');
    const categoryFromUrl = urlParams.get('category');

    setSidebarData({
      ...sidebarData,
      searchTerms: searchTermsFromUrl || '', // Set default value to empty string
      sort: sortFromUrl || 'desc', // Set default value to 'desc'
      location: locationFromUrl || '', // Set default value to empty string
      category: categoryFromUrl || '', // Set default value to empty string
    });

    fetchJobs(urlParams); // Call fetchJobs initially and whenever location.search changes
  }, [location.search]);

  const fetchJobs = async (params) => {
    setLoading(true);
    const res = await fetch(`/api/job/getjobs?${params.toString()}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setJobs(data.job);
    setLoading(false);
    setShowMore(data.job.length === 9);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebarData).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    navigate(`/searchjobs?${urlParams.toString()}`);
  };

 const handleShowMore = async () => {
    const numberOfJobs = course.length;
    const startIndex = numberOfJobs;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/job/getjobs?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setJobs([...job, ...data.job]);
      if (data.job.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search...'
              id='searchTerms'
              type='text'
              value={sidebarData.searchTerms}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Location:</label>
            <TextInput
              placeholder='Enter a location...'
              id='location'
              type='text'
              value={sidebarData.location}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value=''>Select a type</option>
              <option value='full-time'>Full-Time</option>
              <option value='part-time'>Part-Time</option>
              <option value='intern'>Internship</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Jobs results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && job.length === 0 && (
            <p className='text-xl text-gray-500'>No jobs found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            job.map((job) => <JobCard key={job._id} job={job} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
