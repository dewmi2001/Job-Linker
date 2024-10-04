import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn'; 
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import OnlyEmpPrivateRoute from './components/OnlyEmpPrivateRoute';
import CreateJobs from './pages/CreateJobs';
import Updatejob from './pages/UpdateJobs';
import JobPage from './pages/JobPage';
import Jobs from './pages/Jobs';
import SearchJobs from './pages/SearchJobs';
import OnlyCoursePrivateRoute from './components/OnlyCoursePrivateRoute';
import CreateCourse from './pages/CreateCourse';
import UpdateCourse from './pages/UpdateCourse';
import CoursePage from './pages/CoursePage';
import Course from './pages/Course';
import SearchCourse from './pages/SearchCourse';
import CheckoutPage from './pages/CheckoutPage'; // Import CheckoutPage
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ApplyJobs from './pages/ApplyJobs';

// Load your Stripe public key
const stripePromise = loadStripe('your_stripe_public_key_here');

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/course' element={<Course />} />
        <Route path='/searchjobs' element={<SearchJobs />} />
        <Route path='/searchcourse' element={<SearchCourse />} />
        <Route path='/apply' element={<ApplyJobs />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>

        <Route element={<OnlyEmpPrivateRoute />}>
          <Route path='/createjobs' element={<CreateJobs />} />
          <Route path='/updatejob/:jobId' element={<Updatejob />} />
        </Route>

        <Route element={<OnlyCoursePrivateRoute />}>
          <Route path='/createcourse' element={<CreateCourse />} />
          <Route path='/updatecourse/:courseId' element={<UpdateCourse />} />
          
        </Route>

       
        <Route path="/checkout" element={
          <Elements stripe={stripePromise}>
            <CheckoutPage />
          </Elements>
        } />

        <Route path="/projects" element={<Projects />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
        <Route path='/job/:jobSlug' element={<JobPage />} />
        <Route path='/course/:courseSlug' element={<CoursePage />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
