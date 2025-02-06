import logo from '../assets/logo.png';
import ButtonSide from './ButtonSide';
import { useNavigate } from 'react-router-dom';

export function Sidebar(){
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
    };
  return <div className="h-screen flex flex-col justify-between py-4">
    <div className="flex flex-col justify-between">
      <div className="flex justify-center items-center space-x-2">
          <img className=" w-14" src={logo} alt="" />
          <div className="font-semibold text-xl">Nivo</div>
      </div>
      <div className="flex flex-col justify-center items-center mt-6">
        <ButtonSide label="Dashboard" route="/waitlist" />
        <ButtonSide label="Messages"  route="/messages" badge="0"/>
        {/* <ButtonSide label="Resources"  route="/resources" /> */}
        <ButtonSide label="Bookings"  route="/bookings" />
        <ButtonSide label="Waitlist"  route="/customers" />
        <ButtonSide label="Analytics" route="/analytics" />
        <ButtonSide label="Upgrade"  route="/upgrade" />
        <ButtonSide label="Settings"  route="/settings" />
      </div>
    </div>
    <div className="flex justify-between items-center">
      <div className='flex justify-center items-center space-x-1 laptop:space-x-2 mx-2 laptop:mx-4'>
        <div style={{ backgroundColor: "#605BFF"}} className="relative inline-flex items-center justify-center w-8 laptop:w-10 h-8 laptop:h-10 overflow-hidden rounded-full">
            <span className="font-medium text-white text-sm laptop:text-base">A</span>
        </div>
        <div className="text-sm laptop:text-base">Admin</div>
      </div>
      <button 
        type="button" 
        onClick={handleLogout}  
        className="text-gray-900 hover:text-white border border-gray-800 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm laptop:text-base px-3 laptop:px-5 py-2 laptop:py-2.5 text-center mr-4 laptop:mr-8"
      >
        Logout
      </button>
    </div>
    
  </div>
}
