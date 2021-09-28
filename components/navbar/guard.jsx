import Link from "next/link";
import { useRouter } from "next/router";
import { MdDashboard, MdSimCardAlert } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { FiLogOut } from "react-icons/fi";

const Guard = () => {
  const router = useRouter();
  const path = router.asPath;
  const active =
    "dark:from-gray-700 dark:to-gray-800 text-white bg-gradient-to-r from-yellow-500 to-yellow-300 border-r-4 border-yellow-400";

  return (
    <nav>
      <Link href="/guard/monitor">
        <a
          className={
            "rounded-t-2xl uppercase flex items-center p-5 transition-colors duration-200 justify-start " +
            (path.includes("/guard/monitor") ? active : "text-gray-600")
          }
          href="#"
        >
          <span className="text-left">
            <MdDashboard className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">Plan monitoring</span>
        </a>
      </Link>
      <Link href="/guard/user">
        <a
          className={
            "uppercase flex items-center p-5 transition-colors duration-200 justify-start " +
            (path.includes("/guard/user") ? active : "text-gray-600")
          }
          href="#"
        >
          <span className="text-left">
            <ImUsers className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">หน่วยรักษาความปลอดภัย</span>
        </a>
      </Link>
      <Link href="/guard/alert-history">
        <a
          className={
            "uppercase flex items-center p-5 transition-colors duration-200 justify-start " +
            (path.includes("/guard/alert-history") ? active : "text-gray-600")
          }
          href="#"
        >
          <span className="text-left">
            <MdSimCardAlert className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">ประวิติการแจ้งเตือน</span>
        </a>
      </Link>
      <Link href="/logout">
        <a
          className={
            "uppercase flex items-center p-5 transition-colors duration-200 justify-start text-gray-600"
          }
          href="#"
        >
          <span className="text-left">
            <FiLogOut className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">logout</span>
        </a>
      </Link>
    </nav>
  );
};

export default Guard;
