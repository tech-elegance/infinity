import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ImageUploading from "react-images-uploading";
import { GoChevronLeft, GoPlus } from "react-icons/go";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import { Modal, Button } from "react-rainbow-components";
import axios from "axios";
import { connect } from "react-redux";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";

const Plan = ({ project }) => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast
  const [id, setId] = useState(router.query.id);
  const [title, setTitle] = useState(router.query.title);
  const [imageOld, setImageOld] = useState(router.query.image);

  useEffect(() => {
    //? check click project
    if (!project) router.push("/admin/company/type/project");
  }, []);

  //? max image
  const maxNumber2 = 10;

  //? images condo
  const [imagesPlan, setimagesPlan] = useState();
  const onChangeCondo = (imageList, addUpdateIndex) => {
    setimagesPlan(imageList);
  };

  //? from submit
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const { title, planName } = data;
    if (imagesPlan) {
      //* check image
      var plan = [];
      imagesPlan.forEach((value, index) =>
        plan.push({ plan: value.data_url, title: planName[index] })
      );
      var obj = {
        title,
        plan,
      };
      setLoading(true); //* set loading effect on
      //? send data
      axios
        .put(
          `${process.env.BACK_END_URL}/organization/${project._id}/plan/${id}`,
          obj
        )
        .then((response) => {
          console.log(response);
          router.push("/admin/company/type/project/plan?alert=UPDATE");
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
    if (checkname == title) {
      setLoading2(true);
      axios
        .delete(
          `${process.env.BACK_END_URL}/organization/${project._id}/plan/${id}`
        )
        .then((res) => {
          router.push("/admin/company/type/project/plan?alert=ADD");
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

  const uploadPlan = () => {
    return (
      <ImageUploading
        multiple
        value={imagesPlan}
        onChange={onChangeCondo}
        maxNumber={maxNumber2}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="space-y-1 grid ">
            <div className="upload__image-wrapper">
              {imagesPlan && imagesPlan.length ? (
                <div>
                  <div className="pb-12">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex float-left"
                      style={isDragging ? { color: "red" } : null}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FiUpload className="h-5 w-5 mr-3" /> เพิ่มรูปแปลน
                    </button>
                    <button
                      type="button"
                      onClick={onImageRemoveAll}
                      className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md text-white float-right flex"
                    >
                      <RiDeleteBin2Line className="w-5 h-5 mr-3" /> ลบรูปทั้งหมด
                    </button>
                  </div>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item mt-3">
                      <div className="mt-3 w-1/5">
                        <p className={`text-md`}>
                          ชื่อชั้น<span className="text-red-500">*</span>
                        </p>
                        <input
                          type="text"
                          {...register(`planName.${index}`, {
                            required: true,
                          })}
                          className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                            errors.planName && "border-red-500"
                          }`}
                        />
                      </div>
                      <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md">
                        <img src={image.data_url} alt="" />
                      </div>

                      <div className="image-item__btn-wrapper mt-3 flex">
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                          onClick={() => onImageUpdate(index)}
                        >
                          <CgArrowsExchangeAlt className="h-5 w-5 mr-3" />
                          เปลี่ยนแปลนนี้
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-700 px-4 py-2 ml-3 rounded-md text-white flex"
                          onClick={() => onImageRemove(index)}
                        >
                          <RiDeleteBin2Line className="w-5 h-5 mr-3" />
                          ลบแปลนชั้นนี้
                        </button>
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
                    <FiUpload className="h-5 w-5 mr-3" /> เพิ่มรูปแปลน
                  </button>
                  <div className="image-item mt-5">
                    <label className="block text-sm font-medium text-gray-700">
                      อัพโหลดแปลนชั้น
                    </label>
                    <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md"></div>
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
                <Link href="/admin/company/type/project/plan">
                  <a
                    href="/admin/company/type/project/plan"
                    className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                  >
                    <GoChevronLeft className="h-5 w-5 text-white" />
                  </a>
                </Link>
                <span className="ml-2">เพิ่มแปลนที่อยู่อาศัย</span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-12 grid lg:grid-cols-5 gap-12 items-center">
                  <div className="col-span-2">
                    <div className="mt-3">
                      <p className={`text-md`}>
                        ชื่อแปลน<span className="text-red-500">*</span>
                      </p>
                      <input
                        {...register("title", { required: true })}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                  </div>
                </div>

                <div className="mt-5">{uploadPlan()}</div>
                <div className="mt-4">
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
                      กรุณากรอกชื่อกลุ่มโครงการ
                      <span className="text-red-500">"{title}"</span>
                      ให้ถูกต้อง
                    </p>
                    <div className="mt-3">
                      <p className={`text-md`}>
                        ชื่อแปลน
                        <span className="text-red-500">*</span>
                      </p>
                      <input
                        value={checkname}
                        onChange={(e) => setCheckname(e.target.value)}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500 border-2 border-gray-500 rounded-md flex items-center mt-1
                            ${checkname !== title && "border-red-500"}`}
                      />
                      {checkname !== title && (
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
};

const mapStateToProps = (state) => ({
  project: state.project,
});

export default connect(mapStateToProps)(Plan);
