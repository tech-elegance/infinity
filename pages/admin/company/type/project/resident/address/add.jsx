import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { GoChevronLeft, GoPlus } from "react-icons/go";
import { useForm, Controller } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import axios from "axios";
import { connect } from "react-redux";
import Header from "../../../../../../../components/header";
import Navbar from "../../../../../../../components/navbar";
import Motion from "../../../../../../../components/motion/address/add";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const PlanAdd = ({ form_address_map, project }) => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast
  const [select, setSelete] = useState("");

  useEffect(() => {
    //? check click project
    if (!project) router.push("/admin/company/type/project");
  }, []);

  //? from submit
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    // console.log(obj)
    if (typeof form_address_map === "object" && form_address_map !== null) {
      const { title, plan } = data;
      const { activePage, height, width, rotateAngle, top, left } =
        form_address_map;
      var obj = {
        title,
        residencePlan: plan,
        position: {
          position: {
            x: left,
            y: top,
            scale: 1,
            rotate: rotateAngle,
          },
          height: height,
          width: width,
          plan_floor: activePage,
        },
      };

      setLoading(true); //* set loading effect on
      //? send data
      axios
        .post(
          `${process.env.BACK_END_URL}/organization/${project._id}/mark`,
          obj
        )
        .then((response) => {
          console.log(response);
          router.push("/admin/company/type/project/resident?alert=ADD");
        })
        .catch((err) => {
          addToast(`การเพิ่มข้อมูลมีปัญหา`, {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false); //* set loading effect off
        });
    } else {
      addToast(`กรุณาตีกรอบในแผนที่`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/plan`,
      fetcher
    );
    console.log(data);
  } catch (err) {
    console.log(err);
  }

  return (
    <div>
      <Head>
        <title>เพิ่มแปลนที่อยู่อาศัย - Admin</title>
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
                <span className="ml-2">เพิ่มที่อยู่อาศัย</span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-12 grid lg:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <p className={`text-md`}>
                      ชื่อที่อยู่เช่น (บ้านเลขที่/ห้องเลขที่)
                      <span className="text-red-500">*</span>
                    </p>
                    <input
                      {...register("title", { required: true })}
                      className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                        errors.title && "border-red-500"
                      }`}
                    />
                    {errors.title && (
                      <div className="text-red-500">
                        กรุณากรอกชื่อแปลนบ้านหรือห้อง
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className={`text-md`}>
                      เลือกแปลนบ้าน<span className="text-red-500">*</span>
                    </p>
                    <select
                      {...register("plan", { required: true })}
                      className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                        errors.title && "border-red-500"
                      }`}
                      value={select}
                      onChange={(e) => setSelete(e.target.value)}
                    >
                      <option value="" disabled>
                        กรุณาเลือกแปลน
                      </option>
                      {data ? (
                        data.data.map((row) => (
                          <option value={row._id}>{row.title}</option>
                        ))
                      ) : (
                        <option disabled>loading...</option>
                      )}
                      {error && <option disabled>failed to load</option>}
                    </select>
                    {errors.plan && (
                      <div className="text-red-500">
                        กรุณาเลือกแปลนบ้านหรือห้อง
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 h-full">
                  <Motion />
                </div>
                <div className="mt-12">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded-md text-white float-right font-bold flex items-center"
                  >
                    {loading ? (
                      <UseAnimations
                        aria-hidden="true"
                        animation={LoadingIcon}
                        size={20}
                        strokeColor="#fff"
                        className="mr-2"
                      />
                    ) : (
                      <GoPlus className="h-4 w-4 mr-2" />
                    )}
                    ยืนยันการเพิ่มบ้าน
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

export default connect(mapStateToProps)(PlanAdd);
