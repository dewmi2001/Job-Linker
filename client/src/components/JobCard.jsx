import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
    return (
      <div className='group relative w-full border border-teal-500 hover:border-2 h-[300px] overflow-hidden rounded-lg sm:w-[300px] transition-all'>
        
        <div className='p-3 flex flex-col gap-2'>
          <p className='text-lg font-semibold line-clamp-2'>{job.jobTitle || job.title}</p>
          <span className='italic text-sm'>{job.category}</span>
          <span className='italic text-sm'>{job.type}</span>
          <span className='italic text-sm'>USD: {job.salary}</span>
          <Link
            to={`/job/${job.slug}`}
            className='z-10 group-hover:bottom-0 absolute bottom-[-150px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
          >
            Apply for this job
          </Link>
        </div>
      </div>
    );
  }