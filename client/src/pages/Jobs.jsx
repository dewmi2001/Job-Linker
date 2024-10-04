import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';

export default function Jobs() {

  const [job, setJob] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/job/getjobs');
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await res.json();
        setJob(data.job); // Update state using setJob
      } catch (error) {
        console.error('Error fetching jobs:', error.message);
      }
    };
    fetchJobs();
  }, []);
  

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        
            <h1 className='text-3xl font-bold lg:text-6xl gap-6'>
                Find the most exciting startup 
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Jobs
            </span>
            </h1>
        
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll can find internships and ultimately 
          land that dream job. Our platform is here to make the
          student journey more enriching and pave the way for a successful future.
      
        </p>
        <div className="flex gap-4">
        
          <Link
            to='/searchjobs'
            className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
          >
            View all jobs
          </Link>

        </div>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {job && job.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Jobs</h2>
            <div className='flex flex-wrap gap-4'>
              {job.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
            <Link
              to={'/searchjobs'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
