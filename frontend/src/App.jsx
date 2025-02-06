import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Waitlist } from './pages/Waitlist';
import { Customers } from './pages/Customers';
import { AddCustomer } from './pages/AddCustomer';
import { Analytics } from './pages/Analytics';
import { Messages } from './pages/Messages';
import { Resources } from './pages/Resources';
import { Settings } from './pages/Settings';
import { Upgrade } from './pages/Upgrade';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import SelfAddWait from './components/SelfAddWait';
import WaitlistConfirmation from './pages/WaitlistConfirmation';
import ViewWaitlist from './pages/ViewWaitlist';
import SelfAddBook from './components/SelfAddBook';
import ThankYouBook from './components/ThankYouBook';
import AddBooking from './components/AddBooking';
import { Bookings } from './pages/Bookings';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/selfadd/:businessName" element={<SelfAddWait />} />
          <Route path="/thankyou" element={<WaitlistConfirmation />} />
          <Route path="/view-waitlist/:userId" element={<ViewWaitlist/>} />
          <Route path="/book/:businessName" element={<SelfAddBook />} />
          <Route path="/thankyou-book" element={<ThankYouBook />} />

          {/* Protected routes */}
          <Route 
            path="/waitlist" 
            element={
              <PrivateRoute>
                <Waitlist />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/addcustomer" 
            element={
              <PrivateRoute>
                <AddCustomer />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <PrivateRoute>
                <Resources />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <PrivateRoute>
                <Bookings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/upgrade" 
            element={
              <PrivateRoute>
                <Upgrade />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/add-booking" 
            element={
              <PrivateRoute>
                <AddBooking />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
