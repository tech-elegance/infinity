import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import TablePagination from "@material-ui/core/TablePagination";
import Head from "next/head";
import Link from "next/link";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import useSWR from "swr";
import { useToasts } from "react-toast-notifications";
import { Input } from "react-rainbow-components";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import Header from "../../../components/header";
import Navbar from "../../../components/navbar";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const columns = [
  { id: "no", label: "ลำดับ" },
  { id: "device", label: "Device name" },
  { id: "type", label: "Device type" },
  { id: "parameter", label: "Parameter" },
  { id: "parameter", label: "Parameter" },
  {
    id: "action",
    label: "แก้ไข",
  },
];

const Sensor = () => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast

  useEffect(() => {
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
  const [sensorType, setSensorType] = useState("");
  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/sensors`,
      fetcher
    );
  } catch (err) {
    console.log(err);
  }

  console.log(data);
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
                <Link href="/admin/sensor/add">
                  <button
                    type="button"
                    className="flex px-5 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg"
                  >
                    เพิ่มเซ็นเซอร์
                  </button>
                </Link>
              </div>
              <h1 className="py-4">จัดการเซ็นเซอร์</h1>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className=" w-full font-medium">
                    <Input
                      id="input-component-1"
                      label="Device name/Device type/Parameter"
                      placeholder="ค้นหา"
                      onChange={(e) => setSearched(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-center text-sm">Sensor Type</p>
                    <div
                      className={`w-full pt-2 pb-1 mt-1 px-4 border border-gray-400 outline-none rounded-full focus:ring-blue-400 focus:border-blue-400`}
                    >
                      <Menu
                        menuButton={
                          <MenuButton className="w-full text-left relative">
                            {sensorType === "" ? (
                              <span>ทั้งหมด</span>
                            ) : sensorType === "wireless" ? (
                              <span>wireless</span>
                            ) : (
                              sensorType === "wiring" && <span>wiring</span>
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
                        <MenuItem onClick={() => setSensorType("")}>
                          ทั้งหมด
                        </MenuItem>
                        <MenuItem onClick={() => setSensorType("wireless")}>
                          wireless
                        </MenuItem>
                        <MenuItem onClick={() => setSensorType("wiring")}>
                          wiring
                        </MenuItem>
                      </Menu>
                    </div>
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
                      {data ? (
                        data.data
                          .filter(
                            (filt) =>
                              filt.name
                                .toLowerCase()
                                .includes(searched.toLowerCase()) ||
                              filt.dev_type
                                .toLowerCase()
                                .includes(searched.toLowerCase()) ||
                              JSON.stringify(filt.params)
                                .toLowerCase()
                                .includes(searched.toLowerCase())
                          )
                          .filter((filt) =>
                            filt.organizationType
                              .toLowerCase()
                              .includes(sensorType.toLowerCase())
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
                                <td className="px-3 py-3">{row.dev_type}</td>
                                <td className="px-3 py-3">
                                  {JSON.stringify(row.params)}
                                </td>
                                <td className="px-3 py-3">
                                  {row.organizationType}
                                </td>
                                <td className="px-3 py-3 grid justify-items-center">
                                  <Link
                                    href={`/admin/sensor/edit?id=${
                                      row._id
                                    }&name=${row.name}&dev_type=${
                                      row.dev_type
                                    }&image=${row.image}&organizationType=${
                                      row.organizationType
                                    }&params=${JSON.stringify(row.params)}`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 hover:text-yellow-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                      ) : error ? (
                        <tr>
                          <td>failed to load</td>
                        </tr>
                      ) : (
                        <tr>
                          <td>Loading...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {data && (
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={data.data.length}
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
  alert: state.alert,
});



export default connect(mapStateToProps)(Sensor);
