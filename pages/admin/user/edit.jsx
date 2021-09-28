import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import ImageUploading from "react-images-uploading";
import { GoChevronLeft } from "react-icons/go";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import axios from "axios";
import Select from 'react-select'
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import { Modal, Button } from "react-rainbow-components";
import useSWR from "swr";
import Header from "../../../components/header";
import Navbar from "../../../components/navbar";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const EditUser = () => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast
  const [id, setID] = useState(router.query.id);
  const [name, setName] = useState(router.query.name);
  const [email, setEmail] = useState(router.query.email);
  const [role, setRole] = useState(router.query.role);
  const [organization, setOrganizationOld] = useState(
    router.query.organization
  );

  //? from submit
  const [radio, setRadio] = useState(""); //* radio role
  const [selected, setSelected] = useState([]); //* select single organization
  const [selected2, setSelected2] = useState([]); //* select multi organization
  const [inputGuard, setInputGuard] = useState();
  const [guardArray, setGuardArray] = useState([]); //* select guard
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
      else if (check == "ผู้ดูแลโครงการ") {
        var arr = [];
        selected2.map((value) => arr.push(value.value));
        obj = {
          role: "organization",
          name,
          email,
          password,
          organization: arr,
        };
      } else if (check == "หน่วยความปลอดภัย") {
        obj = {
          role: "security",
          name,
          email,
          password,
          organization: selected.value,
          member: guardArray,
        };
      }
      //console.log(obj);
      setLoading(true); //* set loading effect on
      axios
        .put(`${process.env.BACK_END_URL}/user/${id}`, obj)
        .then((response) => {
          // console.log(response);
          router.push("/admin/user?alert=UPDATE");
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

  //? from delete
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading2, setLoading2] = useState(false); //* loading on,off
  const [checkname, setCheckname] = useState();
  const onDelete = () => {
    if (checkname == name) {
      setLoading2(true);
      axios
        .delete(`${process.env.BACK_END_URL}/user/${id}`)
        .then((res) => {
          router.push("/admin/user?alert=DELETE");
        })
        .catch((res) => {
          addToast("การเพิ่มข้อมูลมีปัญหา", {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading2(false);
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
          <Select
            isMulti
            options={JsonData.data}
            value={selected2}
            onChange={setSelected2}
            className="w-1/2 border-2 border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p>
            {selected2.map((number) => (
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
      <div className="mt-5 w-full">
        <div className="grid grid-cols-2">
          <div className="flex items-end">
            <div>
              <p className={`text-md`}>
                ชื่อ-นามสกุล<span className="text-red-500">*</span>
              </p>
              <input
                value={inputGuard}
                onChange={(e) => setInputGuard(e.target.value)}
                className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 `}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setGuardArray((e) => [...e, { name: inputGuard }]);
                // console.log(guardArray);
              }}
              className="bg-blue-400 hover:bg-blue-500 px-6 py-2 h-10 rounded-md text-white font-bold mb-1 ml-5"
            >
              เพิ่ม
            </button>
          </div>

          <div className="">
            <p className={`text-md`}>
              โครงการ<span className="text-red-500">*</span>
            </p>
            <div>
              <Select
                options={JsonData.data}
                value={selected}
                onChange={setSelected}
                className="w-1/2 border-2 border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
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
                <Link href="/admin/user">
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
                    <label className="inline-flex ">
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
                    </label>
                    <label className="inline-flex items-center ml-12">
                      <input
                        {...register("check", { required: true })}
                        className="form-radio h-5 w-5 "
                        type="radio"
                        value="หน่วยความปลอดภัย"
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                {radio === "ผู้ดูแลโครงการ" ? developer() : null}
                {radio === "หน่วยความปลอดภัย" ? securityGuard() : null}

                <div className="mt-12 ">
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
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
                    ยืนยัน
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModal(true)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 float-right"
                  >
                    ลบข้อมูล
                  </button>
                  <Modal
                    id="modal-1"
                    isOpen={deleteModal}
                    onRequestClose={() => setDeleteModal(false)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="py-4 flex">
                        คุณต้องการลบข้อมูลนี้หรือไม่{" "}
                      </h3>
                    </div>
                    <hr className="bg-yellow-500 h-0.5" />
                    <p className="mt-3">
                      กรุณากรอกชื่อกลุ่มโครงการ{" "}
                      <span className="text-red-500">"{name}"</span>
                      ให้ถูกต้อง
                    </p>
                    <div className="mt-3">
                      <p className={`text-md`}>
                        ชื่อกลุ่มโครงการ
                        <span className="text-red-500">*</span>
                      </p>
                      <input
                        value={checkname}
                        onChange={(e) => setCheckname(e.target.value)}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500 border-2 border-gray-500 rounded-md flex items-center mt-1
                            ${checkname !== name && "border-red-500"}`}
                      />
                      {checkname !== name && (
                        <span className="text-red-500 text-sm">
                          กรุณากรอกให้ตรงกัน
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setDeleteModal(false)}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete()}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 float-right"
                      >
                        {loading2 && (
                          <UseAnimations
                            aria-hidden="true"
                            animation={LoadingIcon}
                            size={20}
                            strokeColor="#6495ED"
                            className="mr-2"
                          />
                        )}
                        ลบข้อมูล
                      </button>
                    </div>
                  </Modal>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditUser;
