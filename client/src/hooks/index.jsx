import { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from "../config";

const getWaitlist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/v1/queue/waitlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Fetch every 15 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); 

  return { data, loading, error };
};


const getServelist = () => {
    const token = localStorage.getItem('token');
    const [datas, setData] = useState([]);
    const [loadings, setLoading] = useState(true);
    const [errors, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${BACKEND_URL}/api/v1/queue/serving`,
            {
              headers: {
                Authorization: `Bearer ${token}` 
              }
            });
          setData(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []); 
  
    return { datas, loadings, errors };
  };

  const getAllPatient = () => {
    const token = localStorage.getItem('token');
    const [dataall, setDataAll] = useState([]);
    const [loadingall, setLoadingAll] = useState(true);
    const [errorall, setErrorAll] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/queue/allpatient`,{
            headers: {
              Authorization: `Bearer ${token}` 
            }
          });
          setDataAll(response.data);
        } catch (error) {
          setErrorAll(error);
        } finally {
          setLoadingAll(false);
        }
      };

      fetchData();
    }, []);

    return { dataall, loadingall, errorall };
  };



const useWaitlist = (userId) => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/queue/public-waitlist/${userId}`);
        setWaitlist(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
    const interval = setInterval(fetchWaitlist, 30000); // Fetch every 30 secs

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);

  return { waitlist, loading, error };
};

const useQueueStatus = (userId) => {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueueStatus = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/user/queue-status/${userId}`);
          setQueueStatus(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 60000); // Fetch every 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);

  return { queueStatus, loading, error };
};

const getTodayBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/appointment/today-bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Filter only scheduled bookings and sort by time
        const scheduledBookings = response.data
          .filter(booking => booking.status === 'scheduled')
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        setBookings(scheduledBookings);
      } catch (err) {
        setErrorBookings(err.message);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { bookings, loadingBookings, errorBookings };
};

const getUser = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoadingUser(true);
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setErrorUser('Failed to fetch user data');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loadingUser, errorUser };
};

export {getServelist,getWaitlist,getAllPatient,useWaitlist,useQueueStatus,getTodayBookings,getUser};