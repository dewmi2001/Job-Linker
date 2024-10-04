import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashJobs() {
  const { currentUser } = useSelector((state) => state.user);
  const [userJobs, setUserJobs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`/api/job/getjobs`);
        const data = await res.json();
        if (res.ok) {
          setUserJobs(data.job);
          if (data.job.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    fetchJobs();
  }, []);
  
  const handleShowMore = async () => {
    const startIndex = userJobs.length;
    try {
      const res = await fetch(
        `/api/job/getjobs?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserJobs((prev) => [...prev, ...data.job]);
        if (data.job.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteJob = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/job/deletejobs/${jobIdToDelete}/${currentUser._id || currentUser.isAdmin}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserJobs((prev) =>
          prev.filter((job) => job._id !== jobIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='min-h-screen md:mx-auto table-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      <div className='container mx-auto py-6'>
        {currentUser.isEmp || currentUser.isAdmin ? (
          <>
            <Table hoverable className='shadow-md mx-auto bg-gray-100 rounded-lg'>
              <Table.Head className='bg-gray-200'>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Job Title</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              {userJobs.map((job) => (
                <Table.Body key={job._id}>
                  <Table.Row>
                    <Table.Cell>{new Date(job.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link className='text-blue-600 hover:underline' to={`/job/${job.slug}`}>{job.jobTitle || job.title}</Link>
                    </Table.Cell>
                    <Table.Cell>{job.type}</Table.Cell>
                    <Table.Cell>{job.category}</Table.Cell>
                    <Table.Cell>
                      <div className='flex'>
                        <Button color='red' className='mr-2' onClick={() => { setShowModal(true); setJobIdToDelete(job._id); }}>Delete</Button>
                        <Link className='btn btn-teal' to={`/updatejob/${job._id}`}>Edit</Link>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>

            {showMore && (
              <button onClick={handleShowMore} className='block mx-auto mt-6 px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:bg-blue-600'>Show more</button>
            )}

          </>
        ) : (
          <p className='text-center text-gray-600'>You have no jobs yet!</p>
        )}

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-red-500 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-700'>Are you sure you want to delete this job?</h3>
              <div className='flex justify-center gap-4'>
                <Button color='red' onClick={handleDeleteJob}>Yes, I'm sure</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
