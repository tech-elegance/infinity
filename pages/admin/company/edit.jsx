import Head from "next/head";
import { Fragment, useState } from "react";
import ImageUploading from "react-images-uploading";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";
import { useRouter } from "next/router";
import Header from "../../../components/header";
import Navbar from "../../../components/navbar";
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import { Modal, Button } from "react-rainbow-components";

const Project = () => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast
  const { id, title, logo, banner } = router.query;
  //   console.log(router.query);

  //? logo input file
  const [imageLogo, setimageLogo] = useState();
  const onChangeLogo = (imageList, addUpdateIndex) => {
    setimageLogo(imageList);
  };

  //? banner input file
  const [imageBanner, setimageBanner] = useState();
  const onChangeBanner = (imageList, addUpdateIndex) => {
    setimageBanner(imageList);
  };

  //? from submit Edit
  const [logoValidate, setLogoValidate] = useState(false); //* check logo
  const [bannerValidate, setBannerValidate] = useState(false); //* check banner
  const [loading, setLoading] = useState(false); //* loading on,off
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const title = data.title;
    if (!imageLogo) {
      setLogoValidate(true);
      setBannerValidate(false);
    } else if (!imageBanner) {
      setLogoValidate(false);
      setBannerValidate(true);
    } else {
      setLoading(true);
      axios
        .put(`${process.env.BACK_END_URL}/company/${id}`, {
          title,
          logo: imageLogo[0].data_url,
          banner: imageBanner[0].data_url,
        })
        .then((res) => {
          console.log(res);
          setLoading(false);
          switch (res.status) {
            case 200:
              addToast("แก้ไขข้อมูลเสร็จสิ้น", {
                appearance: "success",
                autoDismiss: true,
              });
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
      setLogoValidate(false);
      setBannerValidate(false);
    }
  };

  //? delete
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading2, setLoading2] = useState(false); //* loading on,off
  const [checkTitle, setCheckTitle] = useState();
  const onDelete = () => {
    if (checkTitle == title) {
      setLoading2(true);
      axios.delete(`${process.env.BACK_END_URL}/company/${id}`).then((res) => {
        setLoading2(false);
        switch (res.status) {
          case 200:
            router.push("/admin/company");
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

  //TODO Logo
  const uploadLogo = () => {
    return (
      <>
        <ImageUploading
          value={imageLogo}
          onChange={onChangeLogo}
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
                {imageLogo && imageLogo.length ? (
                  <div>
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md text-white flex"
                      style={isDragging ? { color: "red" } : null}
                      onClick={onImageUpdate}
                      {...dragProps}
                    >
                      <CgArrowsExchangeAlt className="h-5 w-5 mr-3" />
                      เปลี่ยนโลโก้
                    </button>
                    {imageList.map((image, index) => (
                      <div key={index} className="image-item mt-5">
                        <label className="block text-sm font-medium text-gray-700">
                          อัพโหลดโลโก้กลุ่มโครงการ
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
                      <FiUpload className="h-5 w-5 mr-3" /> เพิ่มโลโก้
                    </button>
                    <div className="image-item mt-5">
                      <label className="block text-sm font-medium text-gray-700">
                        อัพโหลดโลโก้โครงการ
                      </label>
                      <div className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 h-96 border-gray-300 border-dashed rounded-md"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </ImageUploading>
      </>
    );
  };

  //TODO Banner
  const uploadBanner = () => {
    return (
      <ImageUploading
        value={imageBanner}
        onChange={onChangeBanner}
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

  //TODO Main
  return (
    <div>
      <Head>
        <title>แก้ไขกลุ่มโครงการ - Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 dark:bg-gray-800 ">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full mt-4 lg:ml-8 lg:mr-4 bg-white lg:rounded-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center">
                <h1 className="py-4 flex">แก้ไขกลุ่มโครงการ </h1>
              </div>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-12">
                <form onSubmit={handleSubmit(onSubmit)} className="">
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      your an email with all of the details of your order.
                    </p>
                    <div className="mt-3">
                      <p className={`text-md`}>
                        ชื่อกลุ่มโครงการ
                        <span className="text-red-500">*</span>
                      </p>
                      <input
                        {...register("title", { required: true })}
                        className={`w-full py-2 px-4 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500 border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                          errors.title && "border-red-500"
                        }`}
                      />
                      {errors.title && (
                        <span className="text-red-500 text-sm">
                          กรุณากรอกชื่อกลุ่มโครงการ
                        </span>
                      )}
                    </div>
                    <div className="mt-5">{uploadLogo()}</div>
                    {logoValidate && (
                      <span className="text-red-500 text-sm">
                        กรุณาเพิ่มรูปโลโก้
                      </span>
                    )}
                    <div className="mt-5">{uploadBanner()}</div>
                    {bannerValidate && (
                      <span className="text-red-500 text-sm">
                        กรุณาเพิ่มรูปแบรน
                      </span>
                    )}
                  </div>

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
                        กรุณากรอกชื่อกลุ่มโครงการ{" "}
                        <span className="text-red-500">"{title}"</span>{" "}
                        ให้ถูกต้อง
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
        </div>
      </main>
    </div>
  );
};
export default Project;
