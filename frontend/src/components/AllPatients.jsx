import AllPatientRow from './AllPatientsRow';
import { getAllPatient } from '../hooks';
import { User } from 'lucide-react';

const AllPatientList = () => {
  const { dataall, loadingall, errorall } = getAllPatient();

  if (loadingall) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading waitlist...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen h-max p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Waitlist Overview</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <User className="w-4 h-4 mr-1" />
                  {`${dataall.length} total customers`}
                </div>
              </div>
            </div>
          </div>

          {/* Table Headers */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="w-1/4 pr-8">Name</div>
              <div className="w-1/5 pr-8">Phone Number</div>
              <div className="w-1/12 pr-8">Age</div>
              <div className="w-1/5 pr-8">Entry Time</div>
              <div className="w-1/5">Time Waited</div>
            </div>
          </div>

          {/* Patient List */}
          <div className="divide-y divide-gray-100">
            {dataall.length > 0 ? (
              dataall.map((item) => (
                <AllPatientRow 
                  key={item._id} 
                  patient={item.patient}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No customers found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPatientList; 