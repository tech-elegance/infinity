import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import TablePagination from "@material-ui/core/TablePagination";
import { HiPlusSm } from "react-icons/hi";
import { RiImageEditFill } from "react-icons/ri";
import { Input } from "react-rainbow-components";
import { useToasts } from "react-toast-notifications";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setProject } from "../../../../../../libs/redux/action";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";
import fetcher from "../../../../../../libs/fetcher/swr";

const columns = [
  { id: "no", label: "ลำดับ" },
  { id: "title", label: "ชื่อ" },
  { id: "floor", label: "จำนวนชั้น" },
  {
    id: "action",
    label: "แก้ไข",
  },
];

function Plan({ project }) {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast

  useEffect(() => {
    //? check click project
    if (!project) router.push("/admin/company/type/project");

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
  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/plan`,
      fetcher
    );
  } catch (err) {
    console.log(err);
  }

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
                <Link href="/admin/company/type/project/plan/add">
                  <button className="flex px-5 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg">
                    <HiPlusSm className="h-5 w-5" />
                    เพิ่มบ้าน
                  </button>
                </Link>
              </div>
              <h1 className="py-4">แปลนบ้าน</h1>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-5">
                <div className="lg:w-1/3 md:w-1/2 w-full font-medium">
                  <Input
                    id="input-component-1"
                    placeholder="ค้นหาชื่อแปลน"
                    onChange={(e) => setSearched(e.target.value)}
                  />
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
                          .filter((filt) =>
                            filt.title
                              .toLowerCase()
                              .includes(searched.toLowerCase())
                          )
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, no) => {
                            return (
                              <tr key={row._id} className="text-center ">
                                <td className="px-3 py-3">{no + 1}</td>
                                <td className="px-3 py-3">{row.title}</td>
                                <td className="px-3 py-3">{row.plan.length}</td>
                                <td className="px-3 py-3 grid justify-items-center">
                                  <Link
                                    href={`/admin/company/type/project/plan/edit?id=${
                                      row._id
                                    }&title=${row.title}&image=${JSON.stringify(
                                      row.plan
                                    )}`}
                                  >
                                    <RiImageEditFill className="w-7 h-7 hover:text-yellow-500" />
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
}

const mapStateToProps = (state) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch) => ({
  setProject: bindActionCreators(setProject, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
