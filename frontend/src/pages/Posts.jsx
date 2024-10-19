import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Posts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/post/getposts?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  return (
    <div className="flex flex-col bg-gray-800 min-h-screen">
      <Header />
      <div className="flex-1">
        <div className='bg-gray-800 overflow-x-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
          {currentUser.isAdmin && userPosts.length > 0 ? (
            <>
              <table className="min-w-full shadow-md bg-blue-500">
                <thead>
                  <tr>
                    <th className='px-6 py-3 border-b border-gray-700 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                      Date updated
                    </th>
                    <th className='px-6 py-3 border-b border-gray-700 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                      Post image
                    </th>
                    <th className='px-6 py-3 border-b border-gray-700 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                      Post title
                    </th>
                    <th className='px-6 py-3 border-b border-gray-700 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                      Category
                    </th>
                    <th className='px-6 py-3 border-b border-gray-700 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                      Delete
                    </th>
                    <th className='px-6 py-3 border-b border-gray-700 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {userPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-700">
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300'>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className='w-20 h-10 object-cover bg-gray-500'
                          />
                        </Link>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Link
                          className='font-medium text-gray-300 dark:text-white'
                          to={`/post/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                        {post.category}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <span className='text-red-500 hover:underline cursor-pointer'>
                          Delete
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <Link
                          className='text-teal-500 hover:underline'
                          to={`/update-post/${post._id}`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="text-gray-300">You have no posts yet!</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
