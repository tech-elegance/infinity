import react, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdDashboard, MdEventNote } from "react-icons/md";
import { AiFillIdcard, AiFillBell } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { FaListOl, FaHome, FaMap, FaUsers, FaUserShield } from "react-icons/fa";
import { HiOfficeBuilding } from "react-icons/hi";
import { ImOffice } from "react-icons/im";
import { connect } from "react-redux";

const Admin = ({ company, types, project }) => {
  const router = useRouter();
  const path = router.asPath;

  //? actice effect class css
  const active =
    "dark:from-gray-700 dark:to-gray-800 text-white bg-gradient-to-r from-yellow-500 to-yellow-300 border-r-4 border-yellow-400";
  const active2 = "text-yellow-500 border-yellow-500";

  return (
    <nav>
      <Link href="/admin/company">
        <a
          className={
            " rounded-t-2xl uppercase flex items-center p-5 transition-colors duration-200 justify-start " +
            (path.includes("/admin/company") ? active : "text-gray-600")
          }
          href="#"
        >
          <span className="text-left">
            <HiOfficeBuilding className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">
            กลุ่มโครงการ {company && company.title}
          </span>
        </a>
      </Link>
      {company ? (
        <Link href="/admin/company/type">
          <a
            className={
              "uppercase flex items-center ml-3 p-3 transition-colors duration-200 justify-start  border-l-2  hover:bg-gray-100 " +
              (path.includes("/admin/company/type") ? active2 : "text-gray-600")
            }
          >
            <span className="text-left">
              <ImOffice className="h-5 w-5" />
            </span>
            <span className="ml-2 text-sm font-medium">
              ประเภทโครงการ {types && types.title}
            </span>
          </a>
        </Link>
      ) : (
        <a className="uppercase flex items-center ml-3 p-3 transition-colors duration-200 justify-start border-l-2 text-gray-400">
          <span className="text-left">
            <ImOffice className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">ประเภทโครงการ</span>
        </a>
      )}
      {types ? (
        <Link href="/admin/company/type/project">
          <a
            className={
              "uppercase flex items-center ml-6 p-3 transition-colors duration-200 justify-start border-l-2 hover:bg-gray-100 " +
              (path.includes("/admin/company/type/project")
                ? active2
                : "text-gray-600")
            }
          >
            <span className="text-left">
              <FaHome className="h-5 w-5" />
            </span>
            <span className="ml-2 text-sm font-medium">
              โครงการ {project && project.title}
            </span>
          </a>
        </Link>
      ) : (
        <a className="uppercase flex items-center ml-6 p-3 transition-colors duration-200 justify-start border-l-2 text-gray-400">
          <span className="text-left">
            <FaHome className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">โครงการ</span>
        </a>
      )}
      {project ? (
        <>
          <Link href="/admin/company/type/project/monitor">
            <a
              className={
                "uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 hover:bg-gray-100 " +
                (path.includes("/admin/company/type/project/monitor")
                  ? active2
                  : "text-gray-600")
              }
            >
              <span className="text-left">
                <MdDashboard className="h-5 w-5" />
              </span>
              <span className="ml-2 text-sm font-medium">Plan monitor</span>
            </a>
          </Link>
          <Link href="/admin/company/type/project/plan">
            <a
              className={
                "uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 hover:bg-gray-100 " +
                (path.includes("/admin/company/type/project/plan")
                  ? active2
                  : "text-gray-600")
              }
            >
              <span className="text-left">
                <FaMap className="h-5 w-5" />
              </span>
              <span className="ml-2 text-sm font-medium">แปลน</span>
            </a>
          </Link>
          <Link href="/admin/company/type/project/resident">
            <a
              className={
                "uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 hover:bg-gray-100 " +
                (path.includes("/admin/company/type/project/resident")
                  ? active2
                  : "text-gray-600")
              }
            >
              <span className="text-left">
                <FaUsers className="h-5 w-5" />
              </span>
              <span className="ml-2 text-sm font-medium">ผู้อยู่อาศัย</span>
            </a>
          </Link>
          <Link href="/admin/company/type/project/alert-history">
            <a
              className={
                "uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 hover:bg-gray-100 " +
                (path.includes("/admin/company/type/project/alert-history")
                  ? active2
                  : "text-gray-600")
              }
            >
              <span className="text-left">
                <AiFillBell className="h-5 w-5" />
              </span>
              <span className="ml-2 text-sm font-medium">
                ประวัติดารแจ้งเตือน
              </span>
            </a>
          </Link>
          <Link href="/admin/company/type/project/user">
            <a
              className={
                "uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 hover:bg-gray-100 " +
                (path.includes("/admin/company/type/project/user")
                  ? active2
                  : "text-gray-600")
              }
            >
              <span className="text-left">
                <FaUserShield className="h-5 w-5" />
              </span>
              <span className="ml-2 text-sm font-medium">ผู้ใช้</span>
            </a>
          </Link>
        </>
      ) : (
        <>
          <a className="uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 text-gray-400">
            <span className="text-left">
              <MdDashboard className="h-5 w-5" />
            </span>
            <span className="ml-2 text-sm font-medium">Plan monitor</span>
          </a>
          <a className="uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 text-gray-400">
            <span className="text-left">
              <FaMap className="h-5 w-5" />
            </span>
            <span className="ml-2 text-sm font-medium">แปลน</span>
          </a>
          <a className="uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 text-gray-400">
            <span className="text-left">
              <FaUsers className="h-5 w-5" />
            </span>
            <span className="ml-2 text-sm font-medium">ผู้อยู่อาศัย</span>
          </a>
          <a className="uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 text-gray-400">
            <span className="text-left">
              <AiFillBell className="h-5 w-5" />
            </span>
            <span className="ml-2 text-sm font-medium">
              ประวัติดารแจ้งเตือน
            </span>
          </a>
          <a className="uppercase flex items-center ml-9 p-3 transition-colors duration-200 justify-start border-l-2 text-gray-400">
            <span className="text-left">
              <FaUserShield className="h-5 w-5" />
            </span>
            <span className="ml-2 text-sm font-medium">ผู้ใช้</span>
          </a>
        </>
      )}

      {/* Total */}

      <Link href="/admin/alert-history">
        <a
          className={
            "  uppercase  dark:text-gray-200 flex items-center p-5  transition-colors duration-200 justify-start hover:bg-gray-100 " +
            (path === "/admin/alert-history" ? active : "text-gray-600")
          }
          href="#"
        >
          <span className="text-left">
            <FaListOl className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">ประวัติการแจ้งเตือน</span>
        </a>
      </Link>
      <Link href="/admin/user">
        <a
          className={
            "  uppercase  dark:text-gray-200 flex items-center p-5  transition-colors duration-200 justify-start hover:bg-gray-100 " +
            (path === "/admin/user" ? active : "text-gray-600")
          }
          href="#"
        >
          <span className="text-left">
            <FaUserShield className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">ผู้ใช้ทั้งหมด</span>
        </a>
      </Link>
      <Link href="/admin/sensor">
        <a
          className={
            "  uppercase  dark:text-gray-200 flex items-center p-5  transition-colors duration-200 justify-start hover:bg-gray-100 " +
            (path === "/admin/sensor" ? active : "text-gray-600")
          }
          href="#"
        >
          <span className="text-left">
            <AiFillIdcard className="h-5 w-5" />
          </span>
          <span className="ml-2 text-sm font-medium">จัดการ Sensor IOT</span>
        </a>
      </Link>
      <a
        onClick={() => {
          localStorage.removeItem("user");
          router.push("/");
        }}
        className={
          "  uppercase  dark:text-gray-200 flex items-center p-5  transition-colors duration-200 justify-start hover:bg-gray-100 " +
          (path === "/logout" ? active : "text-gray-600")
        }
        href="#"
      >
        <span className="text-left">
          <FiLogOut className="h-5 w-5" />
        </span>
        <span className="ml-2 text-sm font-medium">ออกจากระบบ</span>
      </a>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  company: state.company,
  types: state.types,
  project: state.project,
});

export default connect(mapStateToProps)(Admin);
