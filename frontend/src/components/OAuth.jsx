import useGoogleSignIn from "../hooks/useGoogleSignIn";

function OAuth() {
  const { handleGoogleSignIn } = useGoogleSignIn(); 

  return (
    <button
      className="flex justify-center bg-transparent hover:bg-blue-500 text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full"
      onClick={handleGoogleSignIn}
    >
      <img
        src="https://docs.material-tailwind.com/icons/google.svg"
        alt="Google"
        className="w-6 h-6"
      />
      <div className="pl-5">Continue with Google</div>
    </button>
  );
}

export default OAuth;
