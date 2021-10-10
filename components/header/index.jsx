import React, { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineProfile } from "react-icons/ai";
import { IoIosOptions } from "react-icons/io";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import UseAnimations from "react-useanimations";
import alertTriangle from "react-useanimations/lib/alertTriangle";
import { Popover, Transition, Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import useSWR from "swr";
import {
  setMapPosition,
  setAlert,
  setActivePage,
} from "../../libs/redux/action";
import io from "socket.io-client";
import { Modal, Button, Slider } from "react-rainbow-components";
import useSound from "use-sound";
import moment from "moment";
import fetcher from "../../libs/fetcher/swr";
import axios from "axios";

const Header = ({
  setMapPosition,
  setAlertRedux,
  project,
  alertRedux,
  setActivePage,
}) => {
  //? check role for position
  const router = useRouter();
  const [role, setrole] = useState(); //* admin=ผู้ดูแลระบบ,developer=ผู้ดูแลโครงการ,guard=หน่วยรักษาความปลอดภัย

  //? Sound
  const [option, setOption] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [play, { stop }] = useSound("/sounds/alert.mp3", {
    volume: volume,
  });
  const [alert, setAlert] = useState([]);

  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("volume"))
      setVolume(parseFloat(localStorage.getItem("volume")));

    if (localStorage.getItem("user")) {
      setrole(user.data.role);
    } else router.push("/");

    if (project) {
      const socket = io(`http://13.213.85.55:3030/`, {
        transports: ["websocket", "polling"],
        query: {
          organization: project._id,
        },
      });

      socket.on("notification", (data) => {
        setAlertRedux(data);
        setAlert(data);
        play();
      });
    }
  }, []);

  // console.log(alert[0].data.residence[0].position.plan_floor);

  const onAlert = async (item) => {
    console.log(item.data);
    close();
    setMapPosition({
      scale: 3,
      translation: {
        x: item.data.residence[0].position.position.x,
        y: item.data.residence[0].position.position.y,
      },
    });

    //! active change page
    axios
      .get(`${process.env.BACK_END_URL}/organization/${project._id}/monitoring`)
      .then(function (response) {
        response.data &&
          response.data.organizationPlans.map((val, i) => {
            if (val._id == item.data.residence[0].position.plan_floor) {
              setActivePage(i + 1);
              console.log(response.data);
            }
          });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    //! check role for change path
    if (role == "admin") router.push("/admin/company/type/project/monitor");
    else if (role == "developer") router.push("/developer/monitor");
    else if (role == "guard") router.push("/guard/monitor");
  };

  //? find data Header
  var userlocal =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  try {
    var { data: user, error } = useSWR(
      `${process.env.BACK_END_URL}/profile/${userlocal.data.id}`,
      fetcher,
      { refreshInterval: 3000 }
    );
  } catch (err) {
    console.log(err);
  } finally {
    //console.log({ user });
  }

  return (
    <header className="shadow-lg bg-white dark:bg-gray-700 items-center h-16 z-40 lg:rounded-2xl lg:m-4">
      <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
        <div className="relative items-center pl-1 flex w-full lg:max-w-68 sm:pr-2 sm:ml-0">
          <div className="container relative left-0 z-50 flex w-3/4 h-full">
            <div className="relative flex items-center w-full lg:w-64 h-full group">
              <svg
                width="35"
                height="30"
                viewBox="0 0 256 366"
                version="1.1"
                preserveAspectRatio="xMidYMid"
              >
                <defs>
                  <linearGradient
                    x1="12.5189534%"
                    y1="85.2128611%"
                    x2="88.2282959%"
                    y2="10.0225497%"
                    id="linearGradient-1"
                  >
                    <stop stopOpacity="0.16" offset="0%"></stop>
                    <stop offset="86.1354%"></stop>
                  </linearGradient>
                </defs>
                <g>
                  <path
                    d="M0,60.8538006 C0,27.245261 27.245304,0 60.8542121,0 L117.027019,0 L255.996549,0 L255.996549,86.5999776 C255.996549,103.404155 242.374096,117.027222 225.569919,117.027222 L145.80812,117.027222 C130.003299,117.277829 117.242615,130.060011 117.027019,145.872817 L117.027019,335.28252 C117.027019,352.087312 103.404567,365.709764 86.5997749,365.709764 L0,365.709764 L0,117.027222 L0,60.8538006 Z"
                    fill="#001B38"
                  ></path>
                  <circle
                    fill="url(#linearGradient-1)"
                    transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675) "
                    cx="147.013244"
                    cy="147.014675"
                    r="78.9933938"
                  ></circle>
                  <circle
                    fill="url(#linearGradient-1)"
                    opacity="0.5"
                    transform="translate(147.013244, 147.014675) rotate(90.000000) translate(-147.013244, -147.014675) "
                    cx="147.013244"
                    cy="147.014675"
                    r="78.9933938"
                  ></circle>
                </g>
              </svg>
              LOGO
            </div>
          </div>
          <div className="relative p-1 flex items-center justify-end w-1/4 ml-5 pr-7 sm:mr-0 sm:right-auto">
            {project && (
              <Popover className="relative">
                {({ open, close }) => (
                  <>
                    <Popover.Button
                      className={`
                ${open ? "" : "text-opacity-90"}
                 group bg-orange-700 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <IconButton
                        aria-label="show 17 new notifications"
                        color="inherit"
                      >
                        <Badge
                          badgeContent={alert.length >= 0 && alert.length}
                          color="secondary"
                        >
                          <FaBell className="w-5 h-5 text-gray-700" />
                        </Badge>
                      </IconButton>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-1">
                            {/* {JSON.stringify(alert)} */}

                            {alert.length > 0 &&
                              alert.slice(0, 10).map((item) => (
                                <a
                                  href="#"
                                  key={item.data._id}
                                  onClick={() => onAlert(item)}
                                  className="flex p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                >
                                  <div className="flex items-center w-10 h-10  sm:h-12 sm:w-12">
                                    <UseAnimations
                                      aria-hidden="true"
                                      animation={alertTriangle}
                                      size={56}
                                      strokeColor="#ff0000 "
                                    />
                                  </div>
                                  <div className="ml-4 w-full flex items-center">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        <span>บ้าน/ห้องเลขที่</span>
                                        <span className="ml-3">
                                          {item.data.residence[0].title}
                                        </span>
                                        {item.count > 1 && (
                                          <span className="text-red-500 ml-3">
                                            ({item.count})
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {item.data.details}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-full flex items-center justify-center">
                                    <p className="text-sm text-gray-500 ">
                                      {moment(item.data.createdAt).format(
                                        "HH:mm:ss DD MMMM YYYY"
                                      )}
                                    </p>
                                  </div>
                                </a>
                              ))}
                          </div>
                          <div className="p-4 bg-gray-50">
                            <Link href="/admin/company/type/project/alert-history">
                              <a
                                href="##"
                                className="flow-root px-2 py-2 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                              >
                                <span className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    ประวัติการแจ้งเตือน
                                  </span>
                                </span>
                                <span className="block text-sm text-gray-500">
                                  Start integrating products and tools
                                </span>
                              </a>
                            </Link>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            )}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  <button className="flex">
                    <div className="ml-6">
                      <img
                        alt="profil"
                        src="https://res.cloudinary.com/techelegance/image/upload/v1623776681/Tech%20Elegance/profile/80222948_2762348530488695_3354444439715053568_n_k4wgnq.jpg"
                        className="mx-auto object-cover rounded-full h-10 w-10 "
                      />
                    </div>
                    <div className="ml-2">
                      <span className="text-gray-500">
                        {user && user.data.name}
                      </span>
                      <br />
                      <span className="text-gray-400 grid text-right">
                        {user && user.data.role}
                      </span>
                    </div>
                  </button>
                  <ChevronDownIcon
                    className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    {/* <Menu.Item>
                      <button
                        onClick={() => play()}
                        className={`group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100`}
                      >
                        <AiOutlineProfile className="h-5 w-5 mr-3" />
                        โปรไฟล์
                      </button>
                    </Menu.Item> */}
                    <Menu.Item>
                      <button
                        onClick={() => setOption(true)}
                        className={`group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100`}
                      >
                        <IoIosOptions className="h-5 w-5 mr-3" />
                        ตั้งค่า
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => {
                          localStorage.removeItem("user");
                          router.push("/");
                        }}
                        className={`group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-100`}
                      >
                        <FiLogOut className="h-5 w-5 mr-3" /> ออกจากระบบ
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <Modal
              id="modal-1"
              isOpen={option}
              onRequestClose={() => setOption(false)}
            >
              <div className="flex justify-between items-center">
                <h3 className="py-4 flex">ตั้งค่าระบบ</h3>
              </div>
              <hr className="bg-yellow-500 h-0.5" />
              <div className="mt-12">
                <Slider
                  label="ปรับเสียงแจ้งเตือน"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    localStorage.setItem("volume", e.target.value);
                    setVolume(e.target.value);
                    play();
                  }}
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  alertRedux: state.alert,
  project: state.project,
});

const mapDispatchToProps = (dispatch) => ({
  setMapPosition: bindActionCreators(setMapPosition, dispatch),
  setAlertRedux: bindActionCreators(setAlert, dispatch),
  setActivePage: bindActionCreators(setActivePage, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
