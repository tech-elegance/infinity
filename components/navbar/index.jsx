import react, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Admin from "./admin";
import Developer from "./developer";
import Guard from "./guard";

export default function Navbar() {
  const router = useRouter();
  const path = router.asPath;
  const [select, setSelect] = useState("admin"); //* admin=ผู้ดูแลระบบ,developer=ผู้ดูแลโครงการ
  //! check role
  useEffect(() => {
    if (!path.includes(select)) router.push("/");
  }, []);

  return (
    <div className="h-screen hidden lg:block ml-4 mt-4 relative w-96">
      <div className="bg-white h-full rounded-2xl dark:bg-gray-700">
        {select === "admin" ? <Admin /> : null}
        {select === "developer" ? <Developer /> : null}
        {select === "guard" ? <Guard /> : null}
      </div>
    </div>
  );
}
