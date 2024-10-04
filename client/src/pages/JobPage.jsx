import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate  } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import JobCard from '../components/JobCard';

export default function JobPage() {
    const { jobSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [job, setJob] = useState(null);
    const [recentJobs, setRecentJobs] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/job/getjobs?slug=${jobSlug}`);
          const data = await res.json();
          if (!res.ok) {
            setError(true);
            setLoading(false);
            return;
          }
          if (res.ok) {
            setJob(data.job[0]);
            setLoading(false);
            setError(false);
          }
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchJob();
    }, [jobSlug]);

    useEffect(() => {
        try {
          const fetchRecentJobs = async () => {
            const res = await fetch(`/api/job/getjobs?limit=3`);
            const data = await res.json();
            if (res.ok) {
              setRecentJobs(data.job);
            }
          };
          fetchRecentJobs();
        } catch (error) {
          console.log(error.message);
        }
      }, []);

      const handleApply = () => {
        
        navigate('/apply');
      };
  
      if (loading)
      return (
        <div className='flex justify-center items-center min-h-screen'>
          <Spinner size='xl' />
        </div>
      );  

  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{job && job.jobTitle || job.title}</h1>

      <Link to={`/searchjobs?category=${job && job.category}`} className='self-center mt-5'>
        <Button color='gray' pill="true" size='xs'>{job && job.category}</Button>
      </Link>

      <Link to={`/searchjobs?companyName=${job && job.companyName}`} className='self-center mt-5'>
        <span className='text-blue-500 text-xl' pill="true" size='lg'>By : {job && job.companyName}</span>
      </Link>

      <div className='flex justify-between mt-10 p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span  className='text-black-500 '>{job && job.type}</span>
        <span>Published Date: {job && new Date(job.createdAt).toLocaleDateString()}</span> 
      </div>

      <div className='flex justify-between mt-5 p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-lg'>
        <span  className='text-black-500 '>{job && job.location}</span>
        <span className='text-black-500 '>USD : {job && job.salary}</span> 
      </div>

      <div className='p-3 max-w-2xl mx-auto w-full job-description' dangerouslySetInnerHTML={{ __html: job && job.description }}></div>

      <div className='flex justify-center items-center my-5'>
        
        <Button color='blue' pill size='lg' onClick={handleApply}> 
          Apply Now
        </Button>
      </div>

        <div className='max-w-4xl mx-auto w-full'>
            <CallToAction />
        </div>
      

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent jobs</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentJobs &&
            recentJobs.map((job) => (
              <JobCard key={job._id} job={job} className='flex-shrink-0' />
            ))}
        </div>

      </div>
    </main>
  
}
