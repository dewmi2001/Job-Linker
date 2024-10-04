import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPost from '../components/DashPost';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';
import DashJobs from '../components/DashJobs';
import DashCourse from '../components/DashCourse';
import DashApply from '../components/DashApply';
import DashCourses from '../components/DashCourses';

export default function Dashboard() {

  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>

      {/* profile... */}
      {tab === 'profile' && <DashProfile />}

      {/* posts... */}
      {tab === 'posts' && <DashPost />}

      {/* users */}
      {tab === 'users' && <DashUsers />}

      {/* comments  */}
      {tab === 'comments' && <DashComments />}

       {/* dashboard comp */}
       {tab === 'dash' && <DashboardComp />}

       {/* jobs... */}
      {tab === 'job' && <DashJobs />}
       
       {/* course... */}
      {tab === 'course' && <DashCourse />}

      {/* applications... */}
      {tab === 'apply' && <DashApply />}

      {/* enroll courses... */}
      {tab === 'enroll' && <DashCourses />}


    </div>
  );
}
