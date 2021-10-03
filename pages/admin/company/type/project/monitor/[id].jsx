import react, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GoChevronLeft } from "react-icons/go";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import router from "next/router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import useSWR from "swr";
import Header from "../../../../../../components/header";
import Navbar from "../../../../../../components/navbar";
import Motion from "../../../../../../components/motion/resident/index";
import fetcher from "../../../../../../libs/fetcher/swr";

const PlanHome = ({ project }) => {
  const router = useRouter();
  const [token, setToken] = useState(false);

  useEffect(() => {
    //? check click company
    if (!project) router.push("/admin/company/type/project");
  }, []);

  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/residence/${router.query.id}`,
      fetcher,
      { refreshInterval: 3000 }
    );
    console.log(data);
  } catch (err) {
    console.log(err);
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 h-full dark:bg-gray-800  overflow-hidden relative">
        <Header />
        <div className="flex items-start justify-between">
          <Navbar />
          <div className="w-full lg:ml-8 lg:mr-4 mb-12">
            <div className="mt-4 bg-white lg:rounded-2xl">
              <div className="pt-8 pl-8 pr-8">
                <h1 className="py-4 flex">
                  <Link href="/admin/company/type/project/monitor">
                    <a
                      href="#"
                      className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-500 hover:bg-yellow-400"
                    >
                      <GoChevronLeft className="h-5 w-5 text-white" />
                    </a>
                  </Link>
                  <span className="ml-2">แบบแปลน</span>
                </h1>
                <hr className="bg-yellow-500 h-0.5" />
                <div className=" grid grid-cols-2 items-center mt-3">
                  <p className=" text-gray-700 font-medium">
                    เซ็นเซอร์ทั้งหมด : {data && data.sensorPosition.length} ตัว
                  </p>
                  {/* <p className=" text-gray-700 place-self-end font-medium">
                    ทั้งหมดชั้นที่ {data && data.residenceplan.plan.length}
                  </p> */}
                </div>
                <div className=" grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4 mt-3">
                  {data &&
                    data.sensorPosition.map((value) => (
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium">
                          {value.name}:
                        </span>
                        {value.status === 1 ? (
                          <span className="px-2 inline-flex  leading-5 font-medium rounded-full bg-green-100 text-green-800 ml-3">
                            Online
                          </span>
                        ) : (
                          <span className="px-2 inline-flex  leading-5 font-medium rounded-full bg-red-100 text-red-800 ml-3">
                            Offline
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              <div className="h-full w-full lg:rounded-b-2xl mt-3 flex items-center justify-center py-3">
                <Motion />
              </div>
            </div>

            <div className="mt-5 ">
              <div className="flex items-center">
                <AiOutlineQuestionCircle className="w-7 h-7 text-yellow-500" />
                <h1 className="ml-1">ข้อมูลบ้าน</h1>
              </div>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 ml-8 mt-5">
                <div>
                  <p className="text-gray-700">ชื่อสมาชิก</p>
                  <p>{data && data.data.customer.name}</p>
                </div>
                <div>
                  <p className="text-gray-700">บ้านเลขที่</p>
                  <p>{data && data.data.title}</p>
                </div>
                <div>
                  <p className="text-gray-700">User ID</p>
                  <p>{data && data.data.customer._id}</p>
                </div>
                <div>
                  <p className="text-gray-700">ชั้น</p>
                  <p>{data && data.data.residenceplan.plan.length}</p>
                </div>
                <div>
                  <p className="text-gray-700">เบอร์โทรติดต่อ</p>
                  <p>{data && data.data.customer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-700">สร้างเมื่อวันที่</p>
                  <p>23/04/2564 15:23:34</p>
                </div>
                <div>
                  <p className="text-gray-700">Line Token</p>
                  <p></p>
                </div>
                <div>
                  <p className="text-gray-700">วันที่ออนไลน์ล่าสุด</p>
                  <p>23/04/2564 15:23:34</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setToken(!token);
                    console.log(token);
                  }}
                  className="ml-8 mt-5 bg-yellow-500 text-white rounded-sm py-2 px-5"
                >
                  User Token
                </button>
                {token && (
                  <span className="mt-4 ml-7">
                    {data && data.data.customer.usertoken}
                  </span>
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
  project: state.project,
});

export default connect(mapStateToProps)(PlanHome);
