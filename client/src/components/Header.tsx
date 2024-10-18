import { Button } from "./ui/button";

export default function Header() {
 const user = JSON.parse(localStorage.getItem("user") || "{}");
 const handelLogout = () => {
  localStorage.removeItem("token");
  location.assign("/login");
 };
 return (
  <div className="flex items-center justify-end gap-4 p-4">
   {user.username}
   <Button className="bg-black text-white" onClick={handelLogout}>
    logout
   </Button>
  </div>
 );
}
