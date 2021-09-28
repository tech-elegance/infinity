import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { GoChevronLeft } from "react-icons/go";
import { MapInteractionCSS } from "react-map-interaction";
import router from "next/router";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";
import Motion from "../../../../../../components/motion/index";
import { setMapPosition } from "../../../../../../libs/redux/action";
// import useSocket from "../../../../../../libs/socket";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Home = ({ position, project, setMapPosition }) => {
  useEffect(() => {
    //? check click company
    if (!project) router.push("/admin/company/type/project");
  }, []);

  return (
    <div>
      <Head>
        <title>Create Next App </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100  dark:bg-gray-800  overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full  mt-4 lg:ml-8 lg:mr-4 bg-white lg:rounded-2xl">
            <div className="pt-8 pl-8 pr-8">
              <h1 className="py-4 flex">
                <Link href="/admin/company/type/project">
                  <a
                    href="#"
                    className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                  >
                    <GoChevronLeft className="h-5 w-5 text-white" />
                  </a>
                </Link>
                <span className="ml-2">
                  แบบผังโครงการ บ้านกาญจน์กนก 21
                  {/* {JSON.stringify(position)} */}
                </span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <div className=" grid grid-cols-2 items-center mt-3">
                <p className=" text-gray-600 font-medium">
                  จำนวนทั้งหมด: 10 หลัง
                </p>
              </div>
            </div>

            <Motion />
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  position: state.position,
  project: state.project,
});

const mapDispatchToProps = (dispatch) => ({
  setMapPosition: bindActionCreators(setMapPosition, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
