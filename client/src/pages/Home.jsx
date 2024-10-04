import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import JobCard from '../components/JobCard';
import CourseCard from '../components/CourseCard'

export default function Home() {

  const [recentPosts, setPosts] = useState([]);
  const [recentCourse, setRecentCourse] = useState([]);
  const [recentJobs, setRecentJobs] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts?limit=3');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.post);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch('/api/course/getcourse?limit=3');
      const data = await res.json();
      if (res.ok) {
        setRecentCourse(data.course);
      }
    };
    fetchCourse();
  }, []);

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


  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to JobLinker</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages and 
          also you can enhance your qualifications, find internships and ultimately 
          land that dream job. Our platform is here to make the
          student journey more enriching and pave the way for a successful future.
      
        </p>
        <div className="flex gap-4">
          <Link
            to='/search'
            className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
          >
            View all posts
          </Link>

          <Link
            to='/jobs'
            className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
          >
            View all jobs
          </Link>

          <Link
            to='/course'
            className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
          >
            View all courses
          </Link>
        </div>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='flex mt-10 flex-col justify-center items-center mb-5'>
      <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>

        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} className='flex-shrink-0' />
            ))}
        </div>
        
      </div>

      <div className='flex mt-10 flex-col justify-center items-center mb-5'>
      <Link
              to={'/searchjobs'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all jobs
            </Link>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentJobs &&
            recentJobs.map((job) => (
              <JobCard key={job._id} job={job} className='flex-shrink-0' />
            ))}
        </div>
       

      </div>

      <div className='flex mt-10 flex-col justify-center items-center mb-5'>
        <Link
              to={'/searchcourse'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all courses
          </Link>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentCourse &&
            recentCourse.map((course) => (
              <CourseCard key={course._id} course={course} className='flex-shrink-0' />
            ))}
        </div>

      </div>

      
    </div>
  );
}
