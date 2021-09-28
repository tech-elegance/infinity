import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ImageUploading from "react-images-uploading";
import { GoChevronLeft } from "react-icons/go";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import { Modal, Button } from "react-rainbow-components";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setType } from "../../../../../libs/redux/action";
import Header from "../../../../../components/header";
import Navbar from "../../../../../components/navbar";
import { useRouter } from "next/router";

const AddProject = ({ company, types }) => {
  const router = useRouter();
  const { id, title, type } = router.query;
  const { addToast } = useToasts(); //* toast
  //? radio box select home or condo
  const [radio, setRadio] = useState();

  useEffect(() => {
    //? check click project
    if (!types) router.push("/admin/company/type");
  }, []);

  //? max image
  const maxNumber = 1;
  const maxNumber2 = 50;

  //? banner
  const [imageBanner, setimageBanner] = useState();
  const onChangeBanner = (imageList, addUpdateIndex) => {
    setimageBanner(imageList);
  };

  //? images home
  const [imageHome, setimageHome] = useState();
  const onChangeHome = (imageList, addUpdateIndex) => {
    setimageHome(imageList);
  };

  //? images condo
  const [imagesCondo, setImagesCondo] = useState();
  const onChangeCondo = (imageList, addUpdateIndex) => {
    setImagesCondo(imageList);
  };

  //? from submit
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    if (data.check == "home") {
      var obj = {
        title: data.project,
        type: data.check,
        connection_type: data.wire,
        image: imageBanner[0].data_url,
        plan_floor: [imageHome[0].data_url],
      };
      // console.log(obj);
      axios
        .put(
          `${process.env.BACK_END_URL}/company/${company._id}/type/${types._id}/organization/${id}`,
          obj
        )
        .then((res) => {
          console.log(res);
          switch (res.status) {
            case 201:
              {
                router.push("/admin/company/type/project");
              }
              break;
            case 404:
              addToast("ไม่พบข้อมูล", {
                appearance: "error",
                autoDismiss: true,
              });
              break;
            case 500:
              addToast("เซอร์เวอร์ฐานข้อมูลไม่ตอบสนอง", {
                appearance: "error",
                autoDismiss: true,
              });
              break;
          }
        });
    } else if (data.check == "condo") {
      var images = [];
      imagesCondo.forEach((element) => images.push(element.data_url));
      var obj = {
        title: data.project,
        type: data.check,
        connection_type: data.wire,
        image: imageBanner[0].data_url,
        plan_floor: images,
      };
      // console.log(obj);
      axios
        .put(
          `${process.env.BACK_END_URL}/company/${company._id}/type/${types._id}/organization/${id}`,
          obj
        )
        .then((res) => {
          console.log(res);
          switch (res.status) {
            case 201:
              {
                router.push("/admin/company/type/project");
              }
              break;
            case 404:
              addToast("ไม่พบข้อมูล", {
                appearance: "error",
                autoDismiss: true,
              });
              break;
            case 500:
              addToast("เซอร์เวอร์ฐานข้อมูลไม่ตอบสนอง", {
                appearance: "error",
                autoDismiss: true,
              });
              break;
          }
        });
    }
  };

  //? from delete
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading2, setLoading2] = useState(false); //* loading on,off
  const [checkTitle, setCheckTitle] = useState();
  const onDelete = () => {
    if (checkTitle == title) {
      setLoading2(true);
      axios
        .delete(
          `${process.env.BACK_END_URL}/company/${company._id}/type/${types._id}/organization/${id}`
        )
        .then((res) => {
          setLoading2(false);
          switch (res.status) {
            case 200:
              router.push("/admin/company/type/project");
              break;
            case 404:
              addToast("ไม่พบข้อมูล", {
                appearance: "error",
                autoDismiss: true,
              });
              break;
            case 500:
              addToast("เซอร์เวอร์ฐานข้อมูลไม่ตอบสนอง", {
                appearance: "error",
                autoDismiss: true,
              });
              break;
          }
        });
    }
  };

  const uploadBanner = () => {
    return (
      <ImageUploading
        value={imageBanner}
        onChange={onChangeBanner}
        maxNumber={maxNumber}
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
              {imageBanner && imageBanner.length ? (
                <div>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                    style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpdate}
                    {...dragProps}
                  >
                    <CgArrowsExchangeAlt className="h-5 w-5 mr-3" />{" "}
                    เปลี่ยนแบนเนอร์
                  </button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item mt-5">
                      <label className="block text-sm font-medium text-gray-700">
                        อัพโหลดแบนเนอร์โครงการ
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
                    <FiUpload className="h-5 w-5 mr-3" /> เพิ่มแบนเนอร์
                  </button>
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700">
                      อัพโหลดแบนเนอร์โครงการ
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

  //TODO Home upload
  const uploadHome = () => {
    return (
      <ImageUploading
        value={imageHome}
        onChange={onChangeHome}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          onImageUpdate,
          isDragging,
          dragProps,
        }) => (
          <div className="space-y-1 grid ">
            <div className="upload__image-wrapper">
              {imageHome && imageHome.length ? (
                <>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                    style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpdate}
                    {...dragProps}
                  >
                    <CgArrowsExchangeAlt className="h-5 w-5 mr-3" />{" "}
                    เปลี่ยนหมู่บ้าน
                  </button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item mt-5">
                      <label className="block text-sm font-medium text-gray-700">
                        อัพโหลดแบนเนอร์โครงการ
                      </label>
                      <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md">
                        <img src={image.data_url} alt="" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div>
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                    style={isDragging ? { color: "red" } : null}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <FiUpload className="h-5 w-5 mr-3" /> เพิ่มแปลนบ้าน
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

  //TODO Condo upload
  const uploadCondo = () => {
    return (
      <ImageUploading
        multiple
        value={imagesCondo}
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
              {imagesCondo && imagesCondo.length ? (
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
                    <div key={index} className="image-item">
                      <label className="block text-sm font-medium text-gray-700">
                        อัพโหลดแปลนชั้น {index + 1}
                      </label>
                      <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md">
                        <img src={image.data_url} alt="" />
                      </div>

                      <div className="image-item__btn-wrapper mt-3 flex">
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                          onClick={() => onImageUpdate(index)}
                        >
                          <CgArrowsExchangeAlt className="h-5 w-5 mr-3" />{" "}
                          เปลี่ยนแปลนนี้
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-700 px-4 py-2 ml-3 rounded-md text-white flex"
                          onClick={() => onImageRemove(index)}
                        >
                          <RiDeleteBin2Line className="w-5 h-5 mr-3" />{" "}
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

  const onUpload = () => {
    if (radio == "home") return uploadHome();
    else if (radio == "condo") return uploadCondo();
  };

  //TODO Main
  return (
    <div>
      <Head>
        <title>แก้ไขโครงการ - Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-full dark:bg-gray-800  overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full lg:mb-8 mt-4 lg:mx-4 pb-4 bg-white lg:rounded-2xl">
            <div className="p-8">
              <h1 className="py-4 flex">
                <Link href="/admin/company/type/project">
                  <a
                    href="#"
                    className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                  >
                    <GoChevronLeft className="h-5 w-5 text-white" />
                  </a>
                </Link>
                <span className="ml-2">แก้ไขโครงการ</span>
              </h1>
              <hr className="bg-yellow-500 h-0.5" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-12 grid grid-cols-3 gap-4 items-center ">
                  <div className="col-span-1">
                    <div>
                      <p className={`text-md`}>
                        ชื่อโครงการ<span className="text-red-500">*</span>
                      </p>
                      <input
                        {...register("project", { required: true })}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                          errors.project && "border-red-500"
                        }`}
                      />
                      {errors.project && (
                        <div className="text-red-500">กรุณากรอกชื่อโครงการ</div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center justify-center">
                      <label className="inline-flex ">
                        <input
                          {...register("check", { required: true })}
                          className="form-radio h-5 w-5 "
                          type="radio"
                          value="home"
                          onChange={(event) => setRadio(event.target.value)}
                        />
                        <span
                          className={`ml-2 text-gray-700 ${
                            errors.check && "text-red-500"
                          }`}
                        >
                          หมู่บ้านจัดสรร
                        </span>
                      </label>
                      <label className="inline-flex items-center ml-12">
                        <input
                          {...register("check", { required: true })}
                          className="form-radio h-5 w-5 "
                          type="radio"
                          value="condo"
                          onChange={(event) => setRadio(event.target.value)}
                        />
                        <span
                          className={`ml-2 text-gray-700 ${
                            errors.check && "text-red-500"
                          }`}
                        >
                          คอนโดมิเนียม
                        </span>
                      </label>
                    </div>
                    {errors.check && (
                      <div className="text-red-500">
                        กรุณาเลือกประเภทโครงการ
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center justify-center">
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
                      <div className="text-red-500">
                        กรุณาเลือกประเภทการเชื่อมต่อ
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-5 gap-12">
                  <div className="col-span-3 ">{uploadBanner()}</div>
                </div>
                <div className="mt-5">{onUpload()}</div>
                <div className="mt-12 ">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded-md text-white  font-bold"
                  >
                    ยืนยัน
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModal(true)}
                    className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md text-white float-right font-bold"
                  >
                    ลบข้อมูลนี้
                  </button>
                  {/* Modal Delete */}
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
                      <span className="text-red-500">"{title}"</span> ให้ถูกต้อง
                    </p>
                    <div className="mt-3">
                      <p className={`text-md`}>
                        ชื่อกลุ่มโครงการ
                        <span className="text-red-500">*</span>
                      </p>
                      <input
                        value={checkTitle}
                        onChange={(e) => setCheckTitle(e.target.value)}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500 border-2 border-gray-500 rounded-md flex items-center mt-1
                            ${checkTitle !== title && "border-red-500"}`}
                      />
                      {checkTitle !== title && (
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
  company: state.company,
  types: state.types,
});

const mapDispatchToProps = (dispatch) => ({
  setType: bindActionCreators(setType, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddProject);
