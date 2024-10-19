import { useDispatch } from 'react-redux';
import {
  signoutSuccess,
} from '../redux/user/userSlice';
import { toast } from 'sonner';

const useSignOut = () => {
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        toast.error(data.message);
      } else {
        dispatch(signoutSuccess());
        toast.success("User signed out successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return { handleSignout };
};


export default useSignOut;