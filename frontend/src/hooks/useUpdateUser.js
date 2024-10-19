import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { toast } from "sonner";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from '../redux/user/userSlice';

const useUpdateUser = () => {
    const dispatch = useDispatch();
    const { currentUser, loading } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (Object.keys(formData).length === 0) {
        toast.error('No changes made');
        return;
      }
  
      try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(updateFailure(data.message));
          toast.error(data.message);
        } else {
          dispatch(updateSuccess(data));
          toast.success("User's profile updated successfully");
        }
      } catch (error) {
        dispatch(updateFailure(error.message));
        toast.error(error.message);
      }
    };
  
    return { formData, loading, handleChange, handleSubmit };
  };

  export default useUpdateUser;