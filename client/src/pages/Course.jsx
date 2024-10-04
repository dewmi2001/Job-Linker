import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';

export default function Course() {

  const [course, setCourse] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch('/api/course/getcourse');
        if (!res.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await res.json();
        setCourse(data.course); // Update state using setJob
      } catch (error) {
        console.error('Error fetching course:', error.message);
      }
    };
    fetchCourse();
  }, []);
  

  return (
    <div>
      <div className='flex flex-col gap-10 p-28 px-3 max-w-6xl mx-auto '>
            <h1 className='text-3xl font-bold lg:text-6xl gap-6'>
                To build your academic and professional qualifications find the best
            </h1>
            <span className='inline-block max-w-max px-10 lg:text-6xl py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Courses
            </span>

            <p className='text-gray-500 text-xs sm:text-sm'>
                Here you'll can find best and most rated courses in the world. Our platform is here to make the
                student journey more enriching and pave the way for a successful future.
            </p>
            <div className="flex gap-4">
                <Link
                to='/searchcourse'
                className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
                >
                View all courses
                </Link>
            </div>
        </div>


      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {course && course.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Explore Courses</h2>
            <div className='flex flex-wrap gap-4'>
              {course.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
            <Link
              to={'/searchcourse'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
