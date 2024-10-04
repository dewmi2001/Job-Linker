import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
                Want to learn more about Web Developing?
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout about what is the Web Developing and how to become a Web Developer!
            </p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                <a href="https://en.wikipedia.org/wiki/Web_development" target='_blank' rel='noopener noreferrer'>
                    Learn more about Web Developing
                </a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://atlaslearn.lk/wp-content/uploads/2023/11/1_V-Jp13LvtVc2IiY2fp4qYw.jpg" />
        </div>
    </div>
  )
}