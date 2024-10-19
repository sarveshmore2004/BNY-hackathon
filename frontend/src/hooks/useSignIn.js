import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const useSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = async (formData) => {
    dispatch(signInStart());
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' ,
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message)
        dispatch(signInFailure(data.message));
      } else {
        navigate('/');
        console.log(data);
        dispatch(signInSuccess(data));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return {
    handleSubmit,
  };
};

export default useSignIn;
