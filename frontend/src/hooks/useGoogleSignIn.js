import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';

const useGoogleSignIn = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        console.log('Failed to sign in:', data.message);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return {
    handleGoogleSignIn 
  }; 
};

export default useGoogleSignIn;
