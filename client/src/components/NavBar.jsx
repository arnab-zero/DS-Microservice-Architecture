import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center px-12 py-6 bg-blue-300">
      <h1 className="text-2xl font-semibold cursor-pointer hover:underline">
        <NavLink to="/">Stack Overflow</NavLink>
      </h1>
      <ul className="flex">
        <li className="ml-8 font-medium hover:underline cursor-pointer hover:text-blue-600">
          {" "}
          <NavLink to="sign-out">Sign Out</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
