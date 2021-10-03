import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GoChevronLeft, GoPlus } from "react-icons/go";
import { useForm, Controller } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import useSWR from "swr";
import axios from "axios";
import MultiSelect from "react-multi-select-component";
import { connect } from "react-redux";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";
import fetcher from "../../../../../../libs/fetcher/swr";

const AddUser = ({ project }) => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast

  //? from submit
  const [radio, setRadio] = useState(""); //* radio role
  const [selected, setSelected] = useState([]); //* select project
  const [inputGuard, setInputGuard] = useState();
  const [guardArray, setGuardArray] = useState([]); //* select project
  const [loading, setLoading] = useState(false);
  const [passValid, setPassValid] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const { name, email, password, confirmPassword, check } = data;
    var obj;
    // console.log(data);
    if (password != confirmPassword) {
      setPassValid(true);
    } else {
      if (check == "ผู้ดูแลระบบ")
        obj = {
          role: "admin",
          name,
          email,
          password,
        };
      else if (check == "ผู้ดูแลโครงการ")
        obj = {
          role: "organization",
          name,
          email,
          password,
          selected,
        };
      else if (check == "หน่วยความปลอดภัย") {
        obj = {
          role: "security",
          name,
          email,
          password,
          member: guardArray,
        };
      }

      //  console.log(obj);
      setLoading(true); //* set loading effect on
      axios
        .post(
          `${process.env.BACK_END_URL}/organization/${project._id}/user`,
          obj
        )
        .then((response) => {
          // console.log(response);
          router.push("/admin/company/type/project/user?alert=ADD");
        })
        .catch((err) => {
          addToast("การเพิ่มข้อมูลมีปัญหา", {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false); //* set loading effect off
        });
    }
  };

  var JsonData;
  JsonData = useSWR(
    `${process.env.BACK_END_URL}/onlyorganizations`,
    fetcher
  ).data;
  console.log(JsonData);
  //TODO ผู้ดูแลโครงการ
  const developer = () => {
    return (
      <div className="mt-12 lg:grid-cols-2 gap-4 items-center">
        <p className={`text-md`}>
          โครงการ<span className="text-red-500">*</span>
        </p>
        <div>
          <MultiSelect
            options={JsonData.data}
            value={selected}
            onChange={setSelected}
            labelledBy={"เลือกโครงการ"}
            className="w-1/2 border-2 border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p>
            {selected.map((number) => (
              <div className="rounded-md bg-gray-100 w-1/2 mt-3 px-4 py-2">
                {number.label}
              </div>
            ))}
          </p>
        </div>
      </div>
    );
  };

  //TODO หน่วยความปลอดภัย
  const securityGuard = () => {
    return (
      <div className="mt-12 w-full">
        <div className="flex items-end">
          <div className="flex-1">
            <p className={`text-md`}>
              ชื่อ-นามสกุล<span className="text-red-500">*</span>
            </p>
            <input
              value={inputGuard}
              onChange={(e) => setInputGuard(e.target.value)}
              className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 `}
            />
          </div>
          <div className="flex-1 ml-5">
            <button
              type="button"
              onClick={() => {
                setGuardArray((e) => [...e, { name: inputGuard }]);
                // console.log(guardArray);
              }}
              className="bg-blue-400 hover:bg-blue-500 px-6 py-2 rounded-md text-white font-bold mb-1"
            >
              เพิ่ม
            </button>
          </div>
        </div>
        <div>
          {guardArray.map((value, num) => (
            <div className="flex items-center">
              <div className="rounded-md bg-gray-100 w-1/2 mt-3 px-4 py-2">
                {value.name}
              </div>
              <a
                onClick={() => {
                  setGuardArray(
                    guardArray.filter((item) => item.name !== value.name)
                  );
                }}
                className="mt-3 ml-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>เพิ่มผู้ใช้ภายในโครงการ - Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-full dark:bg-gray-800  overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full lg:mb-8 mt-4 lg:mx-4 pb-4 bg-white lg:rounded-2xl">
            <div className="p-8">
              <h1 className="py-4 flex">
                <Link href="/admin/company/type/project/user">
                  <a
                    href="#"
                    className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                  >
                    <GoChevronLeft className="h-5 w-5 text-white" />
                  </a>
                </Link>
                <span className="ml-2">เพิ่มผู้ใช้ภายในโครงการ</span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="flex items-center pt-7">
                    {/* <label className="inline-flex ">
                      <input
                        {...register("check", { required: true })}
                        className="form-radio h-5 w-5 "
                        type="radio"
                        value="ผู้ดูแลระบบ"
                        onChange={(event) => setRadio(event.target.value)}
                      />
                      <span
                        className={`ml-2 text-gray-700 ${
                          errors.check && "text-red-500"
                        }`}
                      >
                        ผู้ดูแลระบบ
                      </span>
                    </label>
                    <label className="inline-flex items-center ml-12">
                      <input
                        {...register("check", { required: true })}
                        className="form-radio h-5 w-5 "
                        type="radio"
                        value="ผู้ดูแลโครงการ"
                        onChange={(event) => setRadio(event.target.value)}
                      />
                      <span
                        className={`ml-2 text-gray-700 ${
                          errors.check && "text-red-500"
                        }`}
                      >
                        ผู้ดูแลโครงการ
                      </span>
                    </label> */}
                    <label className="inline-flex items-center ml-12">
                      <input
                        {...register("check", { required: true })}
                        className="form-radio h-5 w-5 "
                        type="radio"
                        value="หน่วยความปลอดภัย"
                        defaultChecked 
                        onChange={(event) => setRadio(event.target.value)}
                      />
                      <span
                        className={`ml-2 text-gray-700 ${
                          errors.check && "text-red-500"
                        }`}
                      >
                        ผู้รักษาความปลอดภัย
                      </span>
                    </label>
                  </div>
                  {errors.check && (
                    <div className="text-red-500">กรุณาเลือกบทบาท</div>
                  )}
                </div>
                <div className="mt-12 grid lg:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <div>
                      <p className={`text-md`}>
                        ชื่อ-นามสกุล<span className="text-red-500">*</span>
                      </p>
                      <input
                        {...register("name", { required: true })}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                          errors.name && "border-red-500"
                        }`}
                      />
                      {errors.name && (
                        <div className="text-red-500">
                          กรุณากรอกชื่อแปลนบ้านหรือห้อง
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div>
                      <p className={`text-md`}>
                        อีเมล<span className="text-red-500">*</span>
                      </p>
                      <input
                        {...register("email", { required: true })}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                          errors.email && "border-red-500"
                        }`}
                      />
                      {errors.email && (
                        <div className="text-red-500">
                          กรุณากรอกชื่อแปลนบ้านหรือห้อง
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div>
                      <p className={`text-md`}>
                        รหัสผ่าน<span className="text-red-500">*</span>
                      </p>
                      <input
                        type="password"
                        {...register("password", { required: true })}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                          errors.password && "border-red-500"
                        }`}
                      />
                      {errors.password && (
                        <div className="text-red-500">
                          กรุณากรอกชื่อแปลนบ้านหรือห้อง
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div>
                      <p className={`text-md`}>
                        ยืนยันรหัสผ่าน<span className="text-red-500">*</span>
                      </p>
                      <input
                        type="password"
                        {...register("confirmPassword", { required: true })}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                          passValid && "border-red-500"
                        }`}
                      />
                      {passValid && (
                        <div className="text-red-500">
                          กรุณากรอกรหัสผ่านให้ตรงกัน
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* {radio === "ผู้ดูแลโครงการ" ? developer() : null}
                {radio === "หน่วยความปลอดภัย" ? securityGuard() : null} */}
                {securityGuard()}
                <div className="mt-12 ">
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
                    ยืนยัน
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
  project: state.project,
});

export default connect(mapStateToProps)(AddUser);
