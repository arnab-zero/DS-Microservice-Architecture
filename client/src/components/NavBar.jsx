import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

const NavBar = () => {
  const { setAuthInfo } = useContext(AuthContext);

  const handleSignOut = () => {
    setAuthInfo({ isAuthenticated: false, user: null });
  };

  return (
    <div className="flex justify-between items-center px-12 py-6 bg-blue-300">
      <h1 className="text-2xl font-semibold cursor-pointer hover:underline">
        <NavLink to="/">Stack Overflow</NavLink>
      </h1>
      <ul className="flex">
        <li className="ml-8 font-medium hover:underline cursor-pointer hover:text-blue-600">
          {" "}
          <button
            className="hover:border-2 hover:border-blue-700 hover:px-4 hover:py-2 hover:rounded-lg"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
