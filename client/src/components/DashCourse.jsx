import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashCourse() {
    const { currentUser } = useSelector((state) => state.user);
    const [userCourse, setUserCourse] = useState([]); // Initialize as null
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [courseIdToDelete, setCourseIdToDelete] = useState('');
   

    useEffect(() => {
      const fetchCourse = async () => {
          try {
              let url = `/api/course/getcourse`;
              // Check if the current user is an admin
              if (!currentUser.isAdmin) {
                  // If not admin, fetch only courses created by the current user
                  url += `?userId=${currentUser._id}`;
              }
              const res = await fetch(url);
              const data = await res.json();
              if (res.ok) {
                  setUserCourse(data.course);
                  if (data.course.length < 9) {
                      setShowMore(false);
                  }
              }
          } catch (error) {
              console.log(error.message);
          }
      };
  
      fetchCourse();
  }, [currentUser]);
  
    
    

      const handleShowMore = async () => {
        const startIndex = userCourse.length;
        try {
          const res = await fetch(
            `/api/course/getcourse?userId=${currentUser._id}&startIndex=${startIndex}`
          );
          const data = await res.json();
          if (res.ok) {
            setUserCourse((prev) => [...prev, ...data.course]);
            if (data.course.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
    

      const handleDeleteCourse = async () => {
        setShowModal(false);
        try {
          const res = await fetch(
            `/api/course/deletecourse/${courseIdToDelete}/${currentUser._id}`,
            {
              method: 'DELETE',
            }
          );
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            setUserCourse((prev) =>
              prev.filter((course) => course._id !== courseIdToDelete)
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isInst || currentUser.isAdmin && userCourse.length > 0 ? (
            <>
                <Table hoverable className='shadow-md'>

                    <Table.Head>
                        <Table.HeadCell>Date updated</Table.HeadCell>
                        <Table.HeadCell>Course image</Table.HeadCell>
                        <Table.HeadCell>Course title</Table.HeadCell>
                        <Table.HeadCell>Level</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell>
                            <span>Edit</span>
                        </Table.HeadCell>
                    </Table.Head>

                    {userCourse.map((course) => (
                        <Table.Body className='divide-y' key={course._id}>

                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                <Table.Cell>
                                    {new Date(course.updatedAt).toLocaleDateString()}
                                </Table.Cell>

                                <Table.Cell>
                                    <Link to={`/course/${course.slug}`}>
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className='w-20 h-10 object-cover bg-gray-500'
                                        />
                                    </Link>
                                </Table.Cell>

                                <Table.Cell>
                                    <Link
                                        className='font-medium text-gray-900 dark:text-white'
                                        to={`/course/${course.slug}`}
                                    >
                                        {course.title || course.courseTitle}
                                    </Link>
                                </Table.Cell>

                                <Table.Cell>{course.level}</Table.Cell>

                                <Table.Cell>
                                    <span onClick={() => { setShowModal(true); setCourseIdToDelete(course._id); }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                                        Delete
                                    </span>
                                </Table.Cell>

                                <Table.Cell>
                                    <Link
                                        className='text-teal-500 hover:underline'
                                        to={`/updatecourse/${course._id}`}
                                    >
                                        <span>Edit</span>
                                    </Link>
                                </Table.Cell>

                            </Table.Row>

                        </Table.Body>
                    ))}
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
                <p>You have no posts yet!</p>
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
                            Are you sure you want to delete this course?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteCourse}>
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
