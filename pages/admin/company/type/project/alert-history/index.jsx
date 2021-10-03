import React, { useState, useEffect } from "react";
import TablePagination from "@material-ui/core/TablePagination";
import Head from "next/head";
import { connect } from "react-redux";
import useSWR from "swr";
import { DatePicker, Input } from "react-rainbow-components";
import "@szhsin/react-menu/dist/index.css";
import moment from "moment";
import router from "next/router";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";
import fetcher from "../../../../../../libs/fetcher/swr";

const columns = [
  { id: "no", label: "ลำดับ" },
  { id: "address", label: "บ้านเลขที่" },
  { id: "detail", label: "รายละเอียด" },
  {
    id: "date-time",
    label: "วันที่ เวลา",
  },
];

const Alert_History = ({ project }) => {
  const [tabs, setTabs] = useState("alert");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searched, setSearched] = useState("");
  const [dateStart, setDateStart] = useState(moment().add(-1, "days"));
  const [dateEnd, setDateEnd] = useState(new Date());

  useEffect(() => {
    //? check click project
    if (!project) router.push("/admin/company/type/project");
  }, []);

  //? Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/events/?start=${dateStart}&end=${dateEnd}`,
      fetcher
    );
  } catch (err) {
    console.log(err);
  }
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
              <h1 className="py-4">ประวัติการแจ้งเตือน</h1>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-5">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium">
                    <Input
                      id="input-component-1"
                      label="บ้านเลขที่/รายละเอียด"
                      placeholder="ค้นหา"
                      className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                      onChange={(e) => setSearched(e.target.value)}
                    />
                  </div>
                  <div className="font-medium">
                    <div className="rainbow-m-around_small">
                      <DatePicker
                        formatStyle="large"
                        value={dateStart}
                        label="วันที่เริ่มต้น"
                        onChange={(value) => {
                          if (dateEnd <= value) {
                            setDateEnd(value);
                            setDateStart(value);
                          } else setDateStart(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="font-medium">
                    <div className="rainbow-m-around_small">
                      <DatePicker
                        formatStyle="large"
                        value={dateEnd}
                        label="วันที่สิ้นสุด"
                        onChange={(value) => {
                          if (dateStart >= value) setDateEnd(dateStart);
                          else setDateEnd(value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-10 grid grid-cols-3 gap-4 lg:w-3/4 md:w-full">
                  <button
                    className={`rounded-md py-3 px-5  ${
                      tabs === "alert"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-50"
                    }`}
                    onClick={() => setTabs("alert")}
                  >
                    การแจ้งเตือน
                  </button>
                  <button
                    className={`rounded-md py-3 px-5  ${
                      tabs === "active"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-50"
                    }`}
                    onClick={() => setTabs("active")}
                  >
                    เหตุการณ์ที่รอสรุป
                  </button>
                  <button
                    className={`rounded-md py-3 px-5  ${
                      tabs === "submit"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-50"
                    }`}
                    onClick={() => setTabs("submit")}
                  >
                    เหตุการณ์ที่สรุปแล้ว
                  </button>
                </div>
                <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg mt-3">
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
                              filt.residence.title
                                .toLowerCase()
                                .includes(searched.toLowerCase()) ||
                              filt.details
                                .toLowerCase()
                                .includes(searched.toLowerCase())
                          )
                          .filter((filt) =>
                            filt.status
                              .toLowerCase()
                              .includes(tabs.toLowerCase())
                          )
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, no) => {
                            return (
                              <tr key={row.code} className="text-center ">
                                <td className="px-3 py-3">{no + 1}</td>
                                <td className="px-3 py-3">
                                  {row.residence.title}
                                </td>
                                <td className="px-3 py-3">{row.details}</td>
                                <td className="px-3 py-3">
                                  {moment(row.createdAt).format(
                                    "DD/MM/YYYY, HH:mm:ss "
                                  )}
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
  project: state.project,
});

export default connect(mapStateToProps)(Alert_History);
