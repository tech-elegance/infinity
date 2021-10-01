import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import UseAnimations from "react-useanimations";
import LoadingIcon from "react-useanimations/lib/loading";
import axios from "axios";
import { useToasts } from "react-toast-notifications";

const Residented = () => {
  const router = useRouter();
  const { addToast } = useToasts(); //* toast
  const { id, project } = router.query;
  const [Name, setName] = useState(router.query.name);
  const [Phone, setPhone] = useState(router.query.phone);
  const [Line, setLine] = useState();

  // useEffect(() => {
  //   setName(name);
  //   setPhone(phone);
  // }, []);

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
    // console.log(obj);
    setLoading(true); //* set loading effect on
    // //? send data
    axios
      .put(
        `${process.env.BACK_END_URL}/organization/${project}/residence/${id}`,
        obj
      )
      .then((response) => {
        // console.log(response);
        router.push("/form/residented/alert");
      })
      .catch((err) => {
        addToast(`การอัพเดทข้อมูลมีปัญหา ${err}`, {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false); //* set loading effect off
      });
  };

  return (
    <div>
      <Head>
        <title>เพิ่มผู้อยู่อาศัย</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-screen dark:bg-gray-800  overflow-hidden relative">
        <div className="flex items-start justify-between">
          <div className="w-full lg:mb-8 lg:mx-4 pb-4 rounded-md bg-white lg:rounded-2xl">
            <div className="p-8">
              <h1 className="py-4 flex">
                <span className="ml-2">เพิ่มผู้อยู่อาศัย</span>
              </h1>
              <p>id:{id}</p>
              <p>project:{project}</p>
              <hr className="bg-yellow-500 h-0.5" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-12 grid lg:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-md`}>
                      ชื่อผู้อาศัย<span className="text-red-500">*</span>
                    </p>
                    <input
                      {...register("title", { required: true })}
                      onChange={(e) => setName(e.target.value)}
                      value={Name}
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
                      onChange={(e) => setPhone(e.target.value)}
                      value={Phone}
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
                      onChange={(e) => setLine(e.target.value)}
                      value={Line}
                      className={`w-full py-2 px-4 outline-none bg-blue-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500  border-2 border-gray-500 rounded-md flex items-center mt-1 ${
                        errors.line && "border-red-500"
                      }`}
                    />
                    {errors.line && (
                      <div className="text-red-500">กรุณากรอก ID line</div>
                    )}
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

export default Residented;
