"use client";
// import { SUCCESSALERT } from '@/Redux/Slices/alertSlice';
// import { LOGOUT } from '@/Redux/Slices/adminSlice';
import { useDispatch} from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { MouseEvent } from 'react';
import Button from '@/components/Button';

function Logout() {
    // const navigate=useNavigate();
    const dispatch=useDispatch();
    interface LogoutEvent extends MouseEvent<HTMLButtonElement> {}

    const handleLogout = (e: LogoutEvent) => {
      e.preventDefault();
      // dispatch(LOGOUT());
      // navigate('/');
      // dispatch(SUCCESSALERT(` logout successfully`));
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Are you sure you want to log out?</h1>
            <p className="text-gray-600 mb-6">You can always log back in anytime.</p>
            <Button name={"Logout"} handler={handleLogout}/>
          </div>
        </div>
      );
}

export default Logout