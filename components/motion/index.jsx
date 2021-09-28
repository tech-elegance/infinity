import React, { Component, useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import { Card, Pagination } from "react-rainbow-components";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import useSWR from "swr";
import { motion } from "framer-motion";
import Link from "next/link";
import { setMapPosition } from "../../libs/redux/action";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const App = ({ project, position, alert, setMapPosition }) => {
  const [activePage, setActivePage] = useState(1);
  const [scale, setScale] = useState({
    scale: 0.5,
    translation: { x: 0, y: 0 },
  });

  //? find data
  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/monitoring`,
      fetcher,
      { refreshInterval: 3000 }
    );
  } catch (err) {
    console.log(err);
  }
  // console.log(data);
  //console.log("alert:", alert);

  const handleActivePage = (value) => {
    setActivePage(value);
  };

  //? เช็คสถานะบ้าน
  const handleAlert = (row) => {
    //* ตรวจสอบจาก alert
    var check = "";
    if (alert)
      alert.map((row2) => {
        if (
          row2.data.residence[0].title == row.title &&
          row2.data.status == "alert"
        ) {
          check = "alert";
        } else if (
          row2.data.residence[0].title == row.title &&
          row2.data.status == "active"
        ) {
          check = "active";
        }
      });

    //* เช็คสถานะบ้าน
    if (check == "alert") return "bg-red-500";
    else if (check == "active") return "bg-yellow-500";
    else {
      switch (row.status) {
        case "online":
          return "bg-green-500";
          break;
        case "offline":
          return "bg-gray-500";
          break;
        case "security":
          return "bg-blue-500";
          break;
      }
    }
  };

  return (
    <>
      {data && (
        <div className="grid justify-items-center mt-7">
          <div className="flex items-center">
            <a
              href="#"
              onClick={() => activePage > 1 && setActivePage(activePage - 1)}
            >
              <BsChevronLeft className="h-5 w-5 text-gray-500" />
            </a>
            {data &&
              data.organizationPlans.map((row, i) => (
                <a
                  href="#"
                  className="px-1"
                  onClick={() => setActivePage(i + 1)}
                >
                  <div
                    className={`h-6 w-6 flex items-center justify-center rounded-full ${
                      activePage === i + 1 && "bg-yellow-400 text-white"
                    } `}
                  >
                    {i + 1}
                  </div>
                </a>
              ))}

            <a
              href="#"
              onClick={() => {
                data &&
                  activePage < data.organizationPlans.length &&
                  setActivePage(activePage + 1);
              }}
            >
              <BsChevronRight className="h-5 w-5 text-gray-500" />
            </a>
          </div>
        </div>
      )}

      {data &&
        data.organizationPlans
          .slice(activePage - 1, activePage)
          .map((value) => {
            return (
              <>
                <div className="h-screen">
                  <MapInteractionCSS
                    key={value.title}
                    value={position ? position : scale}
                    onChange={(value) => {
                      setMapPosition(null);
                      setScale(value);
                    }}
                  >
                    <div className="relative">
                      {data
                        ? data.data
                            .filter((filt) =>
                              filt.position.plan_floor
                                .toLowerCase()
                                .includes(
                                  data.organizationPlans[activePage - 1]._id
                                )
                            )
                            .map((row) => (
                              <Link
                                href={`/admin/company/type/project/monitor/${row.residence}`}
                              >
                                <motion.div
                                  initial={false}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  animate={row.position.position}
                                  style={{
                                    height: row.position.height,
                                    width: row.position.width,
                                  }}
                                  className={` absolute text-center ${
                                    handleAlert(row)
                                    // console.log(row)
                                    // (row.status === "online" && "bg-green-500") ||
                                    // (row.status === "offline" && "bg-gray-500") ||
                                    // (row.status === "security" && "bg-blue-500")
                                  }`}
                                >
                                  <small
                                    className="text-white"
                                    style={{ fontSize: 8 }}
                                  >
                                    {row.title}
                                  </small>
                                </motion.div>
                              </Link>
                            ))
                        : null}
                    </div>
                    {/* <img
                    src={`${process.env.BACK_END_URL}/${value.image}`}
                    style={{ height: 800, width: 1280 }}
                  /> */}
                    <div
                      style={{
                        backgroundImage: `url(${process.env.BACK_END_URL}/${value.image})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        height: 768,
                        width: 1024,
                        display: "flex",
                      }}
                    />
                  </MapInteractionCSS>
                </div>
              </>
            );
          })}
    </>
  );
};

const mapStateToProps = (state) => ({
  project: state.project,
  position: state.position,
  alert: state.alert,
});

const mapDispatchToProps = (dispatch) => ({
  setMapPosition: bindActionCreators(setMapPosition, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
