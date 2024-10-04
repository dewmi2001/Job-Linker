import { Modal, Table, Button, TableCell } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashApply() {

    const { currentUser } = useSelector((state) => state.user);
    const [userApply, setUserApply] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [applyIdToDelete, setApplyIdToDelete] = useState('');

    console.log(userApply);
    useEffect(() => {
      const fetchApply = async () => {
        try {
          const res = await fetch(`/api/apply/getapply`);
          const data = await res.json();
          if (res.ok) {
            setUserApply(data.apply);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (currentUser.isEmp || currentUser.isUser) {
        fetchApply();
      }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userApply.length;
        try {
          const res = await fetch(
            `/api/apply/getapply?userId=${currentUser._id}&startIndex=${startIndex}`
          );
          const data = await res.json();
          if (res.ok) {
            setUserApply((prev) => [...prev, ...data.apply]);
            if (data.apply.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };

      const handleDeleteApply = async () => {
        setShowModal(false);
        try {
          const res = await fetch(
            `/api/apply/deleteapply/${applyIdToDelete}/${currentUser._id || currentUser.isEmp || currentUser.isUser}`,
            {
              method: 'DELETE',
            }
          );
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            setUserApply((prev) =>
              prev.filter((apply) => apply._id !== applyIdToDelete)
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      };
    

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
    {currentUser.isEmp || (currentUser.isUser && userApply.length > 0) ? (
      <>
        <Table hoverable className='shadow-md mx-auto bg-gray-100 rounded-lg'>
          <Table.Head className='bg-gray-200'>
            <Table.HeadCell>Date applied</Table.HeadCell>
            <Table.HeadCell>Applied Position</Table.HeadCell>
            <Table.HeadCell>Applicant Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Resume</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            
          </Table.Head>
          {userApply.map((apply) => {
             const currentUserApplied = apply.userId === currentUser._id;

             if (currentUser.isEmp || currentUserApplied) {
                return (

            <Table.Body className='divide-y'>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                  {new Date(apply.updatedAt).toLocaleDateString()}
                </Table.Cell>

                <TableCell>
                  <Link className='text-blue-600 hover:underline' to={`/job/${apply.slug}`}>{apply.jobTitle || apply.title}</Link>
                </TableCell>

                
                <Table.Cell>
                    {apply.fullName}
               
                </Table.Cell>
                <Table.Cell>{apply.email}</Table.Cell>
                <Table.Cell>
                  <Link to={`/apply/${apply.slug}`}>
                    <a
                      src={apply.resume}
                      alt={apply.fullName}
                      className='w-20 h-10 object-cover bg-gray-500'
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <span className='font-medium text-red-500 hover:underline cursor-pointer'
                  onClick={() => {
                    setShowModal(true);
                    setApplyIdToDelete(apply._id);
                  }}>
                    Reject
                  </span>
                </Table.Cell>
                
              </Table.Row>
            </Table.Body>
            );
        } else {
            return null; // Skip rendering if the user has not applied for this job
        }
        })}
        </Table>

        {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}

      </>
    ) : (
      <p>You have no Applicants yet!</p>
    )}

    <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this application?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteApply}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  </div>
);
}
