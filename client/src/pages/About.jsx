import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About JobLinker
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to JobLinker! This web application was created by us
              as a group project to share our thoughts and ideas with the
              world. We are Undergraduates who love to write about
              technology, coding, and everything in between.
            </p>

            <p>
            Here you'll find a variety of articles and tutorials on topics such as
            web development, software engineering, and programming languages and 
            also you can enhance your qualifications, find internships and ultimately 
            land that dream job. Our platform is here to make the
            student journey more enriching and pave the way for a successful future.
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
