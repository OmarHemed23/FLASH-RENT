import { Link } from 'react-router-dom';
import Profile from '../images/profile.jpg';

export default function ChatList ({ messages }) {
  return (
    <>
      {messages.map((msg) => (
        <Link
          to="#"
          key={msg.id}
          className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
        >
          <div className="flex-shrink-0 relative">
            <img className="w-11 h-11 rounded-full" src={Profile} alt={`${msg.name} Picture`} />
            {msg.status === 'online' && (
              <span className="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
            )}
            <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-blue-600 dark:border-gray-700">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
              </svg>
            </div>
          </div>
          <div className="pl-3 w-full">
            <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
              New message from
              <span className="font-semibold text-gray-900 dark:text-white ml-2">{msg.name}</span>
              : "{msg.message}"
            </div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-500">{msg.time}</div>
          </div>
        </Link>
      ))}
    </>
  );
};
