import { Select, Spinner, Label, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaCreditCard } from 'react-icons/fa';
import { PayPalButton } from "react-paypal-button-v2";

export default function CheckoutPage() {
    const { courseSlug } = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState([]);
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      address: '',
      city: '',
      country: '', // Set initially to empty string
      zip: '',
      cardNumber: '',
      expirationDate: '',
      cvv: ''
    });
  
    useEffect(() => {
        const fetchCourse = async () => {
          try {
            setLoading(true);
            const res = await fetch(`/api/course/getcourse?slug=${courseSlug}`);
            const data = await res.json();
            if (!res.ok) {
              setError(true);
              setLoading(false);
              return;
            }
            if (data.course && data.course.length > 0) {
              setCourse(data.course[0]);
              setLoading(false);
              setError(false);
            } else {
              setError(true);
              setLoading(false);
            }
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        };
        fetchCourse();
      }, [courseSlug]);
  
    useEffect(() => {
      // Fetch list of countries
      axios.get('https://restcountries.com/v3.1/all')
        .then(response => {
          // Extract country names and codes from the response
          const countryData = response.data.map(country => ({
            code: country.cca2,
            name: country.name.common
          }));
          // Set the list of countries in state
          setCountries(countryData);
        })
        .catch(error => {
          console.error('Error fetching countries:', error);
        });
    }, []);
  
    const handleChange = (name, value) => {
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Process payment and submit form data
      console.log(formData);
    };

    if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

    const handlePaymentSuccess = (details, data) => {
      // Handle payment success
      console.log("Payment successful", details);
    };
  
    const handlePaymentError = (error) => {
      // Handle payment error
      console.error("Payment error", error);
    };
  
    const handlePaymentCancel = (data) => {
      // Handle payment cancellation
      console.log("Payment cancelled", data);
    };

  
  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <div className="container mx-auto mt-10 p-2">

    <div className='flex border border-gray-500 rounded-lg p-3 max-w-3xl mx-auto  md:flex-row md:items-center gap-20'>
    
    {/* left */}

    <div className='flex-1'> 
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      
    
        <h1 className="text-3xl font-bold mb-5">Checkout</h1>
          <h2 className="text-lg font-bold mb-3">Billing Information</h2>

          <div className='flex flex-row gap-5'>
          <TextInput type="text" name="fullName" value={formData.fullName} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Full Name" className="form-input w-full mb-4" required />
          <TextInput type="email" name="email" value={formData.email} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Email" className="form-input w-full mb-4" required />
          </div>
          
          <TextInput type="text" name="address" value={formData.address} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Address" className="form-input w-full mb-4" required />

          <div className='flex flex-row gap-5'>
          <TextInput type="text" name="city" value={formData.city} onChange={(e) => handleChange(e.target.name, e.target.value)}  placeholder="City" className="form-input w-full  mb-4" required />

          <TextInput type="text" name="zip" value={formData.zip} onChange={(e) => handleChange(e.target.name, e.target.value)} placeholder="Zip/Postal Code" className="form-input w-full mb-4" required />
          </div>

          {/* Dropdown for selecting country */}
          <Select
            name="country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="form-select w-full mb-4"
            required
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>{country.name}</option>
            ))}
          </Select>

          
        
        <h2 className="text-lg font-bold mb-3">Payment Method</h2>

        <div className='flex-wrap mx-auto border border-gray-500 rounded-lg  p-7 mb-8 gap-5'>

        <h2 className="flex-wrap text-lg font-bold mb-3 gap-7"><FaCreditCard className="inline-block mr-2" />Card</h2>

          {/* Custom input components for card details, expiration date, and CVV */}

        <div>
            <Label value='Card Number' />
            <TextInput value={formData.cardNumber} onChange={(e) => handleChange('cardNumber', e.target.value)} name="cardNumber" placeholder='1234 1234 1234 1234'/>
        </div>
          

          <div className="flex gap-4">
          <div>
            <Label value='Expire Date' />
            <TextInput value={formData.expirationDate} onChange={(e) => handleChange('expirationDate', e.target.value)} name="expirationDate" placeholder='mm/yy' />
          </div>

          <div>
            <Label value='CVV' />
            <TextInput value={formData.cvv} onChange={(e) => handleChange('cvv', e.target.value)} name="cvv" placeholder='299'/>
          </div>

          </div>
          
         
          </div>
          <div>
              {/* PayPal payment button */}
            <PayPalButton
              amount={10.00} // Replace with the actual amount
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          
          </div>
          


          <span >I agree to the Terms of Use Refund Policy, and Privacy Policy.</span>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Complete Purchase</button>
        
      </form>
     
      

      </div>
        
        {/* right */}

      <div className='flex-1'>
      <div className='border p-4 mb-8 mt-1 gap-4 border-gray-500 rounded-lg'>
        <h1 className="text-3xl font-bold mb-3">Cart</h1>
        <hr aria-hidden="true"></hr>
        <div className="mb-4 gap-4 mx-auto">
             <h3 className='text-xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{course && course.title}</h3>
             
             
                <Link to={`/searchcourse?instituteName=${course && course.instituteName}`} className='self-center mt-5'>
                  <span color='gray' pill size='md'>Offered by: {course && course.instituteName}</span>
                </Link>
                <hr aria-hidden="true"></hr>
                <h2 class="no-commitment body-2-text">No commitment. Cancel anytime.</h2>
              
        </div>

        <span className="text-xl font-bold text-blue-600 mr-4">Total price: ${course && course.price}</span>

        </div>
            
      </div>
      
                

      </div>
      
     

      <div className="mt-5 text-center">
        <Link to="/searchcourse" className="text-blue-500 hover:underline">Explore Courses</Link>
      </div>

     

    </div>
    </main>;
}