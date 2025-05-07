import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="p-4 bg-gray-100 flex justify-between">
      <div>Your App</div>
      {user && (
        <button onClick={logout} className="text-red-500 hover:underline">
          Log out
        </button>
      )}
    </nav>
  );
}
