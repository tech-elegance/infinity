import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import { HiPlusSm } from "react-icons/hi";
import { RiImageEditFill } from "react-icons/ri";
import { CgTikcode } from "react-icons/cg";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaHome, FaUserEdit } from "react-icons/fa";
import { Input } from "react-rainbow-components";
import { useToasts } from "react-toast-notifications";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { Modal, Button } from "react-rainbow-components";
import Tooltip from "@material-ui/core/Tooltip";
import QRCode from "qrcode.react";
import axios from "axios";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import {
  setProject,
  setImportReside,
} from "../../../../../../libs/redux/action";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";
import Import from "../../../../../../components/excel/import";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const columns = [
  { id: "status", label: "สถานะ" },
  { id: "title", label: "บ้านเลขที่" },
  { id: "name", label: "ชื่อผู้อาศัย" },
  { id: "phone", label: "เบอร์ติดต่อ" },
  { id: "date", label: "วันเวลาออนไลน์ล่าสุด" },
  { id: "qrcode", label: "QR Form" },
  {
    id: "action",
    label: "แก้ไข",
  },
];

const Resident = ({ project, importReside, setImportReside }) => {
  // console.log({ importReside });
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
  const [qrcode, setQrcode] = useState(false);
  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/residences`,
      fetcher,
      { refreshInterval: 3 * 1000 }
    );
  } catch (err) {
    console.log(err);
  }

  //? Modal Import
  let [importModal, setImportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validate, setValidate] = useState([]);
  const exportFile = () => {
    var obj = [];
    importReside.map((value, i) => {
      if (i > 0)
        obj.push({
          title: value[0],
          name: value[1],
          phone: value[2],
          line: value[3],
        });
    });
    setLoading(true);
    axios
      .post(
        `${process.env.BACK_END_URL}/organization/${project._id}/bulkResidence`,
        obj
      )
      .then((res) => {
        console.log({ res });
        if (res.data.code == 203) {
          setValidate(res.data.data);
        } else if (res.status == 200) {
          setImportModal(false);
          setImportReside([]);
          setValidate([]);
          addToast(`เพิ่มผู้อยู่อาศัยเสร็จสิ้น`, {
            appearance: "success",
            autoDismiss: true,
          });
        }
        setLoading(false); //* set loading effect off
      })
      .catch((err) => {
        setLoading(false); //* set loading effect off
        setImportModal(false);
        setImportReside([]);
        setValidate([]);
        addToast(`การอัพเดทข้อมูลมีปัญหา`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-full dark:bg-gray-800 overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full my-4 lg:ml-8 lg:mr-4 bg-white lg:rounded-2xl">
            <div className="pt-8 pl-8 pr-8">
              <div className="float-right flex">
                <button
                  onClick={() => setImportModal(true)}
                  className="flex px-5 py-2 bg-green-400 hover:bg-green-500 text-white rounded-lg"
                >
                  <SiMicrosoftexcel className="h-5 w-5" />
                  <span className="ml-1">เพิ่มไฟล์ผู้อยู่อาศัย</span>
                </button>
                <Modal
                  id="modal-1"
                  isOpen={importModal}
                  onRequestClose={() => {
                    setImportModal(false);
                    setImportReside([]);
                    setValidate([]);
                  }}
                  style={{ width: "50%", padding: 0 }}
                >
                  <Import />
                  {validate.length > 0 && (
                    <div className="mt-5 ">
                      <p>ข้อมูลบ้านที่มีผู้อยู่อาศัยแล้ว</p>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-center">
                          <tr className="text-sm">
                            <th>บ้านเลขที่</th>
                            <th>ชื่อผู้อาศัย</th>
                            <th>เบอร์ติดต่อ</th>
                            <th>Line ID</th>
                          </tr>
                        </thead>
                        <tbody className="text-red-500">
                          {validate.map((value, i) => (
                            <tr key={i} className="text-center ">
                              <td>{value.title}</td>
                              <td>{value.name}</td>
                              <td>{value.phone}</td>
                              <td>{value.line}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-red-500">
                        กรุณาตรวจสอบก่อนส่งอีกครั้ง
                      </p>
                    </div>
                  )}
                  {importReside && importReside.length > 0 && (
                    <button
                      onClick={exportFile}
                      className="mt-3 w-64 flex items-center justify-center px-4 py-2 rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer bg-green-500 hover:bg-green-400 text-white  ease-linear transition-all duration-150"
                    >
                      {loading && (
                        <UseAnimations
                          aria-hidden="true"
                          animation={LoadingIcon}
                          size={20}
                          strokeColor="#6495ED"
                          className="mr-2"
                        />
                      )}
                      <span className="mt-2 text-base leading-normal">
                        ส่งไฟล์
                      </span>
                    </button>
                  )}
                </Modal>
                <Link href="/admin/company/type/project/resident/address/add">
                  <button className="flex px-5 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg ml-3">
                    <HiPlusSm className="h-5 w-5" />
                    เพิ่มบ้าน
                  </button>
                </Link>
              </div>
              <h1 className="py-4">ผู้อยู่อาศัย</h1>
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
                                <td className="px-3 py-3 flex justify-center">
                                  {row.station.status === "1" ? (
                                    <div className="h-5 w-5 rounded-full bg-green-400" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full bg-gray-500" />
                                  )}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  {row.title}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  {row.customer ? (
                                    <span>{row.customer.name}</span>
                                  ) : (
                                    <span className="text-gray-400 ">
                                      ไม่พบข้อมูล
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  {row.customer ? (
                                    <span>{row.customer.phone}</span>
                                  ) : (
                                    <span className="text-gray-400 ">
                                      ไม่พบข้อมูล
                                    </span>
                                  )}
                                </td>

                                <td className="px-3 py-3">
                                  {row.station ? (
                                    <span>
                                      {moment
                                        .unix(row.station.updated_date)
                                        .format("MM/DD/YYYY HH:mm:ss")}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 ">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 text-center items-center justify-center">
                                  {row.customer ? (
                                    <a onClick={() => setQrcode(true)}>
                                      <Tooltip title="Qr code สำหรับเพิ่มผู้อยู่อาศัยบ้านหลังนี้">
                                        <IconButton>
                                          <CgTikcode className="w-5 h-5 hover:text-yellow-500" />
                                        </IconButton>
                                      </Tooltip>
                                    </a>
                                  ) : (
                                    <span className="text-gray-400 ">
                                      ไม่พบข้อมูล
                                    </span>
                                  )}
                                  <Modal
                                    id="modal-1"
                                    isOpen={qrcode}
                                    onRequestClose={() => setQrcode(false)}
                                  >
                                    <div className="grid grid-cols-2 items-center">
                                      <QRCode
                                        value="http://facebook.github.io/react/"
                                        style={{ height: 250, width: 250 }}
                                      />
                                      <div className="text-center">
                                        <div>บ้าน/ห้องเลขที่ {row.title}</div>
                                        <div>{row.title}</div>
                                      </div>
                                    </div>
                                  </Modal>
                                </td>
                                <td className="px-3 py-3 flex items-center justify-center">
                                  <Link
                                    href={`/admin/company/type/project/resident/address/edit?id=${row._id}&title=${row.title}&plan=${row}`}
                                  >
                                    <Tooltip title="แก้ไขบ้าน">
                                      <IconButton>
                                        <FaHome className="w-5 h-5 hover:text-yellow-500" />
                                      </IconButton>
                                    </Tooltip>
                                  </Link>
                                  <Link
                                    href={`/admin/company/type/project/resident/residented/edit?id=${row._id}`}
                                  >
                                    <Tooltip title="แก้ไขผู้อยู่อาศัย">
                                      <IconButton>
                                        <FaUserEdit className="w-5 h-5 hover:text-yellow-500" />
                                      </IconButton>
                                    </Tooltip>
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
  importReside: state.importReside,
});

const mapDispatchToProps = (dispatch) => ({
  setProject: bindActionCreators(setProject, dispatch),
  setImportReside: bindActionCreators(setImportReside, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Resident);
