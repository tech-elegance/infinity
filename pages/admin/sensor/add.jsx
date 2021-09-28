import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import ImageUploading from "react-images-uploading";
import { GoChevronLeft } from "react-icons/go";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { FiUpload } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import Header from "../../../components/header";
import Navbar from "../../../components/navbar";

function AddSensor() {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast

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
    if (imageIcon) {
      const { name, dev_type, G, V, B, AXS, wire, params } = data;
      //* check image
      var image = [];
      imageIcon.forEach((value) => image.push(value.data_url)); //* create loop array for images
      var obj;
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
        .post(`${process.env.BACK_END_URL}/sensor`, obj)
        .then((response) => {
          router.push("/admin/sensor?alert=ADD");
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
                    <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md"></div>
                  </div>
                </div>
              )}
              {!imageIcon && (
                <span className="text-red-500 text-sm">กรุณาอัพไฟล์รูป</span>
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
}

export default AddSensor;
