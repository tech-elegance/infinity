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
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import { Modal, Button } from "react-rainbow-components";
import Header from "../../../components/header";
import Navbar from "../../../components/navbar";

function AddSensor() {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast
  const [id, setId] = useState(router.query.id);
  const [name, setName] = useState(router.query.name);
  const [dev_type, setDev_type] = useState(router.query.dev_type);
  const [params, setParams] = useState(router.query.params);
  const [imageGet, setImage] = useState(router.query.image);

  //? images icon
  const [imageIcon, setimageIcon] = useState();
  const onChangeIcon = (imageList, addUpdateIndex) => setimageIcon(imageList);

  //? from submit
  const [paramsValid, setParamsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const { name, dev_type, wire, params } = data;
    var obj;
    if (imageIcon) {
      //* check image
      var image = [];
      imageIcon.forEach((value) => image.push(value.data_url)); //* create loop array for images
      try {
        obj = {
          name,
          dev_type,
          params: JSON.parse(params),
          image,
          organizationType: wire,
        };
      } catch (e) {
        setParamsValid(true);
      }
      // console.log(obj);
      setLoading(true); //* set loading effect on
      //? send data
      axios
        .put(`${process.env.BACK_END_URL}/sensor/${id}`, obj)
        .then((response) => router.push("/admin/sensor?alert=UPDATE"))
        .catch((err) => {
          addToast("การเพิ่มข้อมูลมีปัญหา", {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false); //* set loading effect off
        });
    } else {
      try {
        obj = {
          name,
          dev_type,
          params: JSON.parse(params),
          image : imageGet,
          organizationType: wire,
        };
      } catch (e) {
        setParamsValid(true);
      }
      setLoading(true); //* set loading effect on
      //? send data
      axios
        .put(`${process.env.BACK_END_URL}/sensor/${id}`, obj)
        .then((response) => router.push("/admin/sensor?alert=UPDATE"))
        .catch((err) => {
          addToast("การเพิ่มข้อมูลมีปัญหา", {
            appearance: "error",
            autoDismiss: true,
          });
          setLoading(false); //* set loading effect off
        });
    }
    console.log(obj);
  };

  //? from delete
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading2, setLoading2] = useState(false); //* loading on,off
  const [checkname, setCheckname] = useState();
  const onDelete = () => {
    if (checkname == name) {
      setLoading2(true);
      axios
        .delete(`${process.env.BACK_END_URL}/sensor/${id}`)
        .then((res) => {
          router.push("/admin/sensor?alert=DELETE");
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

  const uploadIcon = () => {
    return (
      <ImageUploading
        value={imageIcon}
        onChange={onChangeIcon}
        maxNumber={1}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          isDragging,
          dragProps,
        }) => (
          <div className="space-y-1 grid ">
            <div className="upload__image-wrapper">
              {imageIcon && imageIcon.length ? (
                <div>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                    style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpdate}
                    {...dragProps}
                  >
                    <CgArrowsExchangeAlt className="h-5 w-5 mr-3" /> เปลี่ยน
                    Icon sensor
                  </button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item mt-5">
                      <label className="block text-sm font-medium text-gray-700">
                        อัพโหลด Icon sensor
                      </label>
                      <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md">
                        <img src={image.data_url} alt="" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                    style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <FiUpload className="h-5 w-5 mr-3" /> เพิ่ม Icon sensor
                  </button>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700">
                      อัพโหลด Icon sensor
                    </label>
                    <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md">
                      <img
                        src={`${process.env.BACK_END_URL}${imageGet}`}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ImageUploading>
    );
  };

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
                <Link href="/admin/sensor">
                  <a
                    href="#"
                    className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                  >
                    <GoChevronLeft className="h-5 w-5 text-white" />
                  </a>
                </Link>
                <span className="ml-2">เพิ่มเซ็นเซอร์</span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-12 ">
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      your an email with all of the details of your order.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="">
                        <p className={`text-md`}>
                          Device name
                          <span className="text-red-500">*</span>
                        </p>
                        <input
                          {...register("name", { required: true })}
                          className={`w-full py-2 px-4 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                            errors.name && "border-red-500"
                          }`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (
                          <span className="text-red-500 text-sm">
                            กรุณากรอกชื่ออุปกรณ์
                          </span>
                        )}
                      </div>
                      <div className="">
                        <p className={`text-md`}>
                          Device type
                          <span className="text-red-500">*</span>
                        </p>
                        <input
                          {...register("dev_type", { required: true })}
                          className={`w-full py-2 px-4 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                            errors.dev_type && "border-red-500"
                          }`}
                          value={dev_type}
                          onChange={(e) => setDev_type(e.target.value)}
                        />
                        {errors.dev_type && (
                          <span className="text-red-500 text-sm">
                            กรุณากรอกชื่อประเภทอุปกรณ์
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-5">
                      <p className={`text-md`}>
                        Parameter
                        <span className="text-red-500">*</span>
                      </p>
                      <textarea
                        {...register("params", { required: true })}
                        className={`w-full py-2 px-4 h-52 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                          errors.params && "border-red-500"
                        }`}
                        value={params}
                        onChange={(e) => setParams(e.target.value)}
                      />
                      {errors.params && (
                        <span className="text-red-500 text-sm">
                          กรุณากรอก Params ของอุปกรณ์แบบ JSON
                        </span>
                      )}
                      {paramsValid && (
                        <span className="text-red-500 text-sm">
                          กรุณากรอกข้อมูลในรูปแบบ JSON ห้ามเป็นรูปแบบ String
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center">
                        <label className="inline-flex ">
                          <input
                            {...register("wire", { required: true })}
                            className="form-radio h-5 w-5 "
                            type="radio"
                            value="wireless"
                          />
                          <span
                            className={`ml-2 text-gray-700 ${
                              errors.wire && "text-red-500"
                            }`}
                          >
                            Wireless
                          </span>
                        </label>
                        <label className="inline-flex items-center ml-12">
                          <input
                            {...register("wire", { required: true })}
                            className="form-radio h-5 w-5 "
                            type="radio"
                            value="wiring"
                          />
                          <span
                            className={`ml-2 text-gray-700 ${
                              errors.wire && "text-red-500"
                            }`}
                          >
                            Wiring
                          </span>
                        </label>
                      </div>
                      {errors.wire && (
                        <div className="text-red-500 text-sm">
                          กรุณาเลือกประเภทโครงการ
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5">{uploadIcon()}</div>
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
                          กรุณาเพิ่มรูปแบรน
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
}

export default AddSensor;
