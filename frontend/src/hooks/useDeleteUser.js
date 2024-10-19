import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';
import { toast } from 'sonner';

const useDeleteUser = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteUser = async (userId) => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
      } else {
        dispatch(deleteUserSuccess(data));
        toast.success("User's profile deleted successfully");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  return { showModal, setShowModal, handleDeleteUser };
};

export default useDeleteUser;
