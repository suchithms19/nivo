import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function AnalyticsUser() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [statsResponse, patientsResponse] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/v1/user/patient-stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${BACKEND_URL}/api/v1/queue/allpatient`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats(statsResponse.data);
        setPatients(patientsResponse.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  // Process data for charts
  const processPatientData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyCounts = last7Days.reduce((acc, date) => {
      acc[date] = 0;
      return acc;
    }, {});

    patients.forEach(entry => {
      const date = new Date(entry.patient.entryTime).toISOString().split('T')[0];
      if (dailyCounts[date] !== undefined) {
        dailyCounts[date]++;
      }
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      data: Object.values(dailyCounts)
    };
  };

  const processStatusData = () => {
    const statusCounts = patients.reduce((acc, entry) => {
      const status = entry.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      data: Object.values(statusCounts)
    };
  };

  const patientTrends = processPatientData();
  const statusDistribution = processStatusData();

  const lineChartData = {
    labels: patientTrends.labels,
    datasets: [
      {
        label: 'Daily Customers',
        data: patientTrends.data,
        borderColor: '#605BFF',
        backgroundColor: 'rgba(96, 91, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: statusDistribution.labels,
    datasets: [
      {
        data: statusDistribution.data,
        backgroundColor: [
          '#605BFF',
          '#FF6B6B',
          '#4ECDC4',
          '#FFD93D',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalPatients || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Today's Customers</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.dailyPatients || 0}</p>
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Average Wait Time</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {Math.round(patients.reduce((acc, curr) => {
                const waitTime = curr.timeWaited || 0;
                return acc + waitTime;
              }, 0) / (patients.length || 1))} min
            </p>
          </div> */}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-800 font-semibold mb-4">Customer Trends</h3>
            <div className="h-[300px]">
              <Line 
                data={lineChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-800 font-semibold mb-4">Waitlist Status Distribution</h3>
            <div className="h-[300px]">
              <Doughnut 
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}