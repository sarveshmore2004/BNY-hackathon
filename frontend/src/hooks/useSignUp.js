
import { useDispatch } from 'react-redux';
import { signUpStart, signUpSuccess, signUpFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const useSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    dispatch(signUpStart());
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message)
        dispatch(signUpFailure(data.message));
      } else {
        navigate('/sign-in');
        dispatch(signUpSuccess());
      }
    } catch (error) {
      dispatch(signUpFailure(error.message));
    }
  };

  return {
    handleSubmit,
  };
};

export default useSignUp;
