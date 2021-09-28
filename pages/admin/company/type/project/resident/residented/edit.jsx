import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { GoChevronLeft } from "react-icons/go";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import axios from "axios";
import Motion from "../../../../../../../components/motion/resident/edit";
import Header from "../../../../../../../components/header";
import Navbar from "../../../../../../../components/navbar";
import fetcher from "../../../../../../../libs/fetcher/swr";

const Residented = ({ form_address_map, project }) => {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    //? check click project
    if (!project) router.push("/admin/company/type/project");
  }, []);

  //? from submit
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const { title, line, phone } = data;
    var obj = { name: title, phone, lineid: line };
    console.log(obj);
    setLoading(true); //* set loading effect on
    // //? send data
    axios
      .put(
        `${process.env.BACK_END_URL}/organization/${project._id}/residence/${router.query.id}`,
        obj
      )
      .then((response) => {
        console.log(response);
        router.push("/admin/company/type/project/resident?alert=UPDATE");
      })
      .catch((err) => {
        addToast(`การอัพเดทข้อมูลมีปัญหา`, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false); //* set loading effect off
      });
  };

  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/residence/${router.query.id}`,
      fetcher
    );
     console.log(data);
  } catch (err) {
    console.log(err);
  }

  return (
    <div>
      <Head>
        <title>แก้ไขผู้อยู่อาศัย - Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-full dark:bg-gray-800  overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full lg:mb-8 mt-4 lg:mx-4 pb-4 bg-white lg:rounded-2xl">
            <div className="p-8">
              <h1 className="py-4 flex">
                <Link href="/admin/company/type/project/resident">
                  <a
                    href="#"
                    className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                  >
                    <GoChevronLeft className="h-5 w-5 text-white" />
                  </a>
                </Link>
                <span className="ml-2">แก้ไขผู้อยู่อาศัย</span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-12 grid lg:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-md`}>
                      ชื่อผู้อาศัย<span className="text-red-500">*</span>
                    </p>
                    <input
                      {...register("title", { required: true })}
                      className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                        errors.title && "border-red-500"
                      }`}
                    />
                    {errors.title && (
                      <div className="text-red-500">กรุณากรอกชื่อผู้อาศัย</div>
                    )}
                  </div>
                  <div>
                    <p className={`text-md`}>
                      เบอร์โทร<span className="text-red-500">*</span>
                    </p>
                    <input
                      {...register("phone", { required: true })}
                      className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                        errors.phone && "border-red-500"
                      }`}
                    />
                    {errors.phone && (
                      <div className="text-red-500">กรุณากรอกเบอร์โทร</div>
                    )}
                  </div>
                  <div>
                    <p className={`text-md`}>Line ID</p>
                    <input
                      {...register("line", { required: false })}
                      className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                        errors.line && "border-red-500"
                      }`}
                    />
                    {errors.line && (
                      <div className="text-red-500">กรุณากรอก ID line</div>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex items-center">
                  {/* <div className="w-1/3">
                    <p className={`text-md`}>
                      User token(Life smart)
                      <span className="text-red-500">*</span>
                    </p>
                    <input
                      {...register("usertoken", { required: true })}
                      className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                        errors.usertoken && "border-red-500"
                      }`}
                    />
                    {errors.usertoken && (
                      <div className="text-red-500">กรุณากรอก User Token</div>
                    )}
                  </div> */}
                  <a
                    type="button"
                    target="_blank"
                    // onClick={() => token !== "" && onToken(token)}
                    href={`http://13.213.85.55:3030/residence/${router.query.id}/usertoken`}
                    className="lg:mt-5 flex px-5 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg lg:float-right"
                  >
                    เชื่อมต่อ Token
                  </a>
                </div>

                <div className="mt-12">
                  <p className={`text-md`}>เลือกตำแหน่งเซ็นเซอร์</p>
                  <div className="mt-3">
                    <Motion />
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded-md text-white float-right font-bold flex items-center"
                  >
                    {loading && (
                      <UseAnimations
                        aria-hidden="true"
                        animation={LoadingIcon}
                        size={20}
                        strokeColor="#fff"
                        className="mr-2"
                      />
                    )}
                    ยืนยันการแก้ไข
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  form_address_map: state.form_address_map,
  project: state.project,
});

export default connect(mapStateToProps)(Residented);
