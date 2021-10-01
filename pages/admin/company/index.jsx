import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { GoPlus } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";
import ImageUploading from "react-images-uploading";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "react-rainbow-components";
import { Dialog, Transition } from "@headlessui/react";
import useSWR from "swr";
import fetcher from "../../../libs/fetcher/swr";
import Skeleton from "@material-ui/lab/Skeleton";
import Header from "../../../components/header";
import Navbar from "../../../components/navbar";
import { useToasts } from "react-toast-notifications";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { setCompany, setType, setProject } from "../../../libs/redux/action";

const Company = ({ setCompany, setType, setProject }) => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast

  useEffect(() => {
    //? check click project
    switch (router.query.alert) {
      case "ADD":
        {
          addToast("เพิ่มข้อมูลเสร็จสิ้น", {
            appearance: "success",
            autoDismiss: true,
          });
        }
        break;
      case "UPDATE":
        {
          addToast("แก้ไขข้อมูลเสร็จสิ้น", {
            appearance: "success",
            autoDismiss: true,
          });
        }
        break;
      case "DELETE":
        {
          addToast("ลบข้อมูลเสร็จสิ้น", {
            appearance: "success",
            autoDismiss: true,
          });
        }
        break;
    }
  }, []);

  //? Modal Add Data
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

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
                        อัพโหลดแบนเนอร์กลุ่มโครงการ
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

  //? fetch data
  const [searched, setSearched] = useState("");
  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/companies`,
      fetcher,
      { refreshInterval: 3000 }
    );
  } catch (err) {
    console.log(err);
  }

  //? from submit
  const [logoValidate, setLogoValidate] = useState(false); //* check logo
  const [bannerValidate, setBannerValidate] = useState(false); //* check banner
  const [loading2, setLoading] = useState(false); //* loading on,off
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
        .post(`${process.env.BACK_END_URL}/company`, {
          title,
          logo: imageLogo[0].data_url,
          banner: imageBanner[0].data_url,
        })
        .then((res) => {
          setLoading(false);
          switch (res.status) {
            case 201:
              {
                addToast("เพิ่มข้อมูลเสร็จสิ้น", {
                  appearance: "success",
                  autoDismiss: true,
                });
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
      closeModal(); //* close modal
      setLogoValidate(false);
      setBannerValidate(false);
    }
  };

  //TODO Main
  return (
    <div>
      <Head>
        <title>กลุ่มโครงการ - Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" dark:bg-gray-800 ">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full mt-4 lg:ml-8 lg:mr-4 bg-white lg:rounded-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center">
                <h1 className="py-4 flex">กลุ่มโครงการ</h1>
                <button
                  type="button"
                  onClick={openModal}
                  className="bg-blue-400 hover:bg-blue-500 rounded-md text-white px-4 py-2 flex items-center order-last"
                >
                  {loading2 ? (
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
                  เพิ่มกลุ่ม
                </button>
                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                  >
                    <div className="min-h-screen px-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Dialog.Overlay className="fixed inset-0" />
                      </Transition.Child>

                      {/* This element is to trick the browser into centering the modal contents. */}
                      <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                      >
                        &#8203;
                      </span>
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                        >
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-bold leading-6 text-gray-900 py-4"
                          >
                            เพิ่มกลุ่มโครงการ
                          </Dialog.Title>
                          <hr className="bg-yellow-500 h-0.5" />
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Your payment has been successfully submitted.
                              We’ve sent your an email with all of the details
                              of your order.
                            </p>
                            <div className="mt-3">
                              <p className={`text-md`}>
                                ชื่อกลุ่มโครงการ
                                <span className="text-red-500">*</span>
                              </p>
                              <input
                                {...register("title", { required: true })}
                                className={`w-full py-2 px-4 outline-none bg-blue-50 focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
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
                              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                            >
                              ยืนยัน
                            </button>
                          </div>
                        </form>
                      </Transition.Child>
                    </div>
                  </Dialog>
                </Transition>
              </div>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-12">
                <div className="lg:w-1/3 md:w-1/2 w-full flex items-center">
                  <Input
                    id="input-component-1"
                    placeholder="ค้นหากลุ่มโครงการ"
                    onChange={(e) => setSearched(e.target.value)}
                  />
                  {/* <a
                    onClick={() => router.reload("/admin/company")}
                    className="ml-3"
                  >
                    <HiRefresh className="h-7 w-7 text-gray-700 hover:text-yellow-500" />
                  </a> */}
                </div>
              </div>
              <div className="mt-7">
                {data ? (
                  <div className="grid md:grid-cols-4 gap-4 items-center mt-7">
                    {data.data
                      .filter((filt) =>
                        filt.title
                          .toLowerCase()
                          .includes(searched.toLowerCase())
                      )
                      .map((row) => {
                        return (
                          <div key={row._id} className="relative">
                            <Link
                              href={`/admin/company/edit?id=${row._id}&title=${row.title}&logo=${row.logo}&banner=${row.banner}`}
                              className="invisible"
                            >
                              <span className="absolute top-2 right-2 group-hover:visible ">
                                <RiEdit2Fill className="h-8 w-8 text-white rounded-full p-1 hover:bg-yellow-500" />
                              </span>
                            </Link>
                            <a
                              href="#"
                              key={row._id}
                              onClick={() => {
                                setCompany({
                                  _id: row._id,
                                  title: row.title,
                                });
                                setType(null);
                                setProject(null);
                                router.push("/admin/company/type");
                              }}
                              className="justify-center text-center hover:text-yellow-500 group"
                            >
                              <div className="flex items-center">
                                <img
                                  src={`${process.env.BACK_END_URL}${row.banner}`}
                                  alt={`${process.env.BACK_END_URL}${row.banner}`}
                                  className="rounded-md"
                                  style={{ height: "300px", width: "500px" }}
                                />
                              </div>
                              <h3 className="font-medium text-center">
                                {row.title}
                              </h3>
                            </a>
                          </div>
                        );
                      })}
                  </div>
                ) : error ? (
                  <div>failed to load</div>
                ) : (
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 items-center mt-7">
                    <div>
                      <Skeleton variant="rect" width={"100%"} height={150} />
                      <Skeleton variant="text" />
                    </div>
                    <div>
                      <Skeleton variant="rect" width={"100%"} height={150} />
                      <Skeleton variant="text" />
                    </div>
                    <div>
                      <Skeleton variant="rect" width={"100%"} height={150} />
                      <Skeleton variant="text" />
                    </div>
                    <div>
                      <Skeleton variant="rect" width={"100%"} height={150} />
                      <Skeleton variant="text" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  position: state.position,
  types: state.types,
});

const mapDispatchToProps = (dispatch) => ({
  setCompany: bindActionCreators(setCompany, dispatch),
  setType: bindActionCreators(setType, dispatch),
  setProject: bindActionCreators(setProject, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Company);
