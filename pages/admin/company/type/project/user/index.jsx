import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TablePagination from "@material-ui/core/TablePagination";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { RiImageEditFill } from "react-icons/ri";
import { Input } from "react-rainbow-components";
import { useToasts } from "react-toast-notifications";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setProject } from "../../../../../../libs/redux/action";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import fetcher from "../../../../../../libs/fetcher/swr";

const columns = [
  { id: "no", label: "ลำดับ" },
  { id: "name", label: "ชื่อ-นามสกุล" },
  { id: "email", label: "อีเมล" },
  { id: "role", label: "บทบาท" },
  { id: "project", label: "โครงการ" },
  // { id: "date", label: "ใช้งานล่าสุด" },
  {
    id: "action",
    label: "แก้ไข",
  },
];

const User = ({ project }) => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast

  useEffect(() => {
    //? check click project
    if (!project) router.push("/admin/company");

    switch (router.query.alert) {
      case "ADD":
        {
          addToast("เพิ่มข้อมูลเสร็จสิ้น", {
            appearance: "success",
            autoDismiss: true,
          });
        }
        break;
      case "UPDATE":
        {
          addToast("แก้ไขข้อมูลเสร็จสิ้น", {
            appearance: "success",
            autoDismiss: true,
          });
        }
        break;
      case "DELETE":
        {
          addToast("ลบข้อมูลเสร็จสิ้น", {
            appearance: "success",
            autoDismiss: true,
          });
        }
        break;
    }
  }, []);

  //? Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [searched, setSearched] = useState("");
  const [role, setRole] = useState("");
  var JsonData;
  if (typeof project !== "undefined")
    JsonData = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/users`,
      fetcher
    ).data;
  //console.log(JsonData);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-full dark:bg-gray-800  overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full my-4 lg:ml-8 lg:mr-4 bg-white lg:rounded-2xl">
            <div className="pt-8 pl-8 pr-8">
              <div className="float-right">
                <Link href="/admin/company/type/project/user/add">
                  <button className="flex px-5 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg">
                    เพิ่มผู้ใช้
                  </button>
                </Link>
              </div>
              <h1 className="py-4">ผู้ใช้</h1>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-5">
                <div className="grid grid-cols-2 gap-4 font-medium">
                  <div>
                    <Input
                      id="input-component-1"
                      placeholder="ค้นหาชื่อแปลน"
                      onChange={(e) => setSearched(e.target.value)}
                    />
                  </div>
                  <div
                    className={`w-full pt-2 pb-1 px-4 border border-gray-400 outline-none rounded-full focus:ring-blue-400 focus:border-blue-400`}
                  >
                    <Menu
                      menuButton={
                        <MenuButton className="w-full text-left relative">
                          {role === "" ? (
                            <span>บทบาททั้งหมด</span>
                          ) : role === "admin" ? (
                            <span>ผู้ดูแลระบบ</span>
                          ) : role === "organization" ? (
                            <span>ผู้ดูแลโครงการ</span>
                          ) : (
                            role === "security" && (
                              <span>หน่วยรักษาความปลอดภัย</span>
                            )
                          )}
                          <span className="absolute inset-y-0 right-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </MenuButton>
                      }
                    >
                      <MenuItem onClick={() => setRole("")}>
                        บทบาททั้งหมด
                      </MenuItem>
                      <MenuItem onClick={() => setRole("security")}>
                        หน่วยรักษาความปลอดภัย
                      </MenuItem>
                      <MenuItem onClick={() => setRole("organization")}>
                        ผู้ดูแลโครงการ
                      </MenuItem>
                      {/* <MenuItem onClick={() => setRole("admin")}>
                        ผู้ดูแลระบบ
                      </MenuItem> */}
                    </Menu>
                  </div>
                </div>
                <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg mt-10">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50  text-center">
                      <tr>
                        {columns.map((column) => (
                          <th
                            className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider"
                            key={column.id}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {JsonData ? (
                        JsonData.data
                          .filter((filt) =>
                            filt.name
                              .toLowerCase()
                              .includes(searched.toLowerCase())
                          )
                          .filter((filt) =>
                            filt.role.toLowerCase().includes(role.toLowerCase())
                          )
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, no) => {
                            return (
                              <tr key={row._id} className="text-center ">
                                <td className="px-3 py-3">{no + 1}</td>
                                <td className="px-3 py-3">{row.name}</td>
                                <td className="px-3 py-3">{row.email}</td>
                                <td className="px-3 py-3">{row.role}</td>
                                <td className="px-3 py-3">
                                  {row.organization.map(
                                    (row2, no2) => row2.title + ", "
                                  )}
                                </td>

                                {/* <td className="px-3 py-3">{row.date}</td> */}
                                <td className="px-3 py-3 grid justify-items-center">
                                  <Link
                                    href={`/admin/company/type/project/user/edit?id=${row._id}&name=${row.name}&email=${row.email}&role=${row.role}&member=${JSON.stringify(row.member)}`}
                                  >
                                    <RiImageEditFill className="w-7 h-7 hover:text-yellow-500" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td>Loading...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {JsonData && (
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={JsonData.data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  project: state.project,
});



export default connect(mapStateToProps)(User);
