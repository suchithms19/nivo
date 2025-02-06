import { Sidebar } from "../components/Sidebar";
import ComingSoon from "../components/ComingSoon";

export function Messages() {
  return (
    <div className="flex w-full">
      {/* Sidebar: fixed and occupying 1/6th of the screen */}
      <div className="w-1/6 fixed  ">
        <Sidebar />
      </div>

      
      <div className="w-5/6 ml-[16.66%] px-4">
        <ComingSoon/>
      </div>
    </div>
  );
}
