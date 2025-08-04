import { Sidebar } from "../components/Sidebar"
import AllPatientList from "../components/AllPatients"


export function Customers() {
  return (
    <div className="flex w-full">
      {/* Sidebar: fixed and occupying 1/6th of the screen */}
      <div className="w-1/6 fixed  ">
        <Sidebar />
      </div>

      {/* Main content area, with enough margin for the sidebar */}
      <div className="w-5/6 ml-[16.66%] p-4 bg-gray-100">
        <AllPatientList />
      </div>
    </div>
  );
}
