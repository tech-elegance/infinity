import React, { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { RiImageEditFill } from "react-icons/ri";
import { Input } from "react-rainbow-components";
import { GoChevronLeft } from "react-icons/go";
import useSWR from "swr";
import Header from "../../../../../components/header";
import Navbar from "../../../../../components/navbar";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setProject } from "../../../../../libs/redux/action";
import router from "next/router";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Project = ({ company, types, setProject }) => {

  useEffect(() => {
    //? check click project
    if (!types) router.push("/admin/company/type");
  }, []);

  //? fetch data
  const [rows, setRows] = useState();
  const [searched, setSearched] = useState("");

  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/company/${company._id}/type/${types._id}/organizations`,
      fetcher
    );
  } catch (err) {
    console.log(err);
  }
  // console.log(data);

  return (
    <div>
      <Head>
        <title>โครงการ - Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full dark:bg-gray-800  overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full my-4 lg:ml-8 lg:mr-4 bg-white lg:rounded-2xl">
            <div className="p-8">
              <div className="float-right">
                <Link href="/admin/company/type/project/add">
                  <button className="flex px-5 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg">
                    เพิ่มโครงการ
                  </button>
                </Link>
              </div>
              <h1 className="py-4 flex">
                <Link href="/admin/company/type">
                  <a
                    href="#"
                    className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                  >
                    <GoChevronLeft className="h-5 w-5 text-white" />
                  </a>
                </Link>
                <span className="ml-2">
                  โครงการ {company && company.title} {types && types.title}
                </span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-5">
                <div className="lg:w-1/3 md:w-1/2 w-full">
                  <Input
                    id="input-component-1"
                    placeholder="ค้นหาโครงการ"
                    onChange={(e) => setSearched(e.target.value)}
                  />
                </div>
                <div className=" mt-10">
                  <div className="rounded-md bg-blue-50 px-5 py-3 grid grid-cols-4 gap-4 font-bold">
                    <div className="text-center">แบนเนอร์</div>
                    <div className="text-center">ชื่อโครงการ</div>
                    <div className="text-center">ประเภท</div>
                    <div className="text-center">Action</div>
                  </div>

                  <div className="mt-5">
                    {data ? (
                      data.data
                        .filter((filt) =>
                          filt.title
                            .toLowerCase()
                            .includes(searched.toLowerCase())
                        )
                        .map((row) => {
                          return (
                            <div
                              key={row._id}
                              className="grid grid-cols-4 bg-gray-50 mt-3 rounded-md hover:bg-blue-50 items-center font-medium justify-items-center"
                            >
                              <a
                                onClick={() => {
                                  setProject({
                                    _id: row._id,
                                    title: row.title,
                                  });
                                  router.push(
                                    `/admin/company/type/project/monitor`
                                  );
                                }}
                                className="outline-none hover:ring-4 hover:ring-yellow-500 hover:ring-opacity-50"
                                href="#"
                              >
                                <img
                                  src={`${process.env.BACK_END_URL}${row.image}`}
                                  alt={`${process.env.BACK_END_URL}${row.image}`}
                                  className="rounded-md"
                                  style={{ height: "100px", width: "200px" }}
                                />
                              </a>
                              <a
                                onClick={() => {
                                  setProject({
                                    _id: row._id,
                                    title: row.title,
                                  });
                                  router.push(
                                    `/admin/company/type/project/monitor`
                                  );
                                }}
                                className="outline-none  hover:text-yellow-500 hover:ring-opacity-50"
                                href="#"
                              >
                                {row.title}
                              </a>
                              <a
                                onClick={() => {
                                  setProject({
                                    _id: row._id,
                                    title: row.title,
                                  });
                                  router.push(
                                    `/admin/company/type/project/monitor`
                                  );
                                }}
                                className="outline-none  hover:text-yellow-500 hover:ring-opacity-50"
                                href="#"
                              >
                                {row.type}
                              </a>
                              <div>
                                <Link
                                  href={`/admin/company/type/project/edit?id=${row._id}&title=${row.title}&type=${row.type}`}
                                >
                                  <RiImageEditFill className="w-7 h-7 hover:text-yellow-500" />
                                </Link>
                              </div>
                            </div>
                          );
                        })
                    ) : error ? (
                      <span>failed to load</span>
                    ) : (
                      <span>Loading...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  types: state.types,
  company: state.company,
});

const mapDispatchToProps = (dispatch) => ({
  setProject: bindActionCreators(setProject, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
