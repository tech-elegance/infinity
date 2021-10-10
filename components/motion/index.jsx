import React, { Component, useState, useEffect } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import { Card, Pagination } from "react-rainbow-components";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import useSWR from "swr";
import { motion } from "framer-motion";
import Link from "next/link";
import { setMapPosition, setActivePage } from "../../libs/redux/action";
import fetcher from "../../libs/fetcher/swr";

const App = ({
  project,
  position,
  alert,
  setMapPosition,
  activePage,
  setActivePage,
}) => {
  const [scale, setScale] = useState({
    scale: 0.9,
    translation: { x: 300, y: 0 },
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

  //? checck activePage undefined from redux
  const onPage = () => {
    if (typeof activePage === "undefined") return 1;
    else return activePage;
  };

 

  return (
    <>
      {data && (
        <div className="grid justify-items-center mt-7">
          <div className="flex items-center">
            <a
              href="#"
              onClick={() => onPage() > 1 && setActivePage(onPage() - 1)}
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
                      onPage() === i + 1 && "bg-yellow-400 text-white"
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
                  onPage() < data.organizationPlans.length &&
                  setActivePage(onPage() + 1);
              }}
            >
              <BsChevronRight className="h-5 w-5 text-gray-500" />
            </a>
          </div>
        </div>
      )}

      {data &&
        data.organizationPlans.slice(onPage() - 1, onPage()).map((value) => {
          return (
            <>
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
                            .includes(data.organizationPlans[onPage() - 1]._id)
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
                              className={` absolute text-center ${handleAlert(
                                row
                              )}`}
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
  activePage: state.activePage,
});

const mapDispatchToProps = (dispatch) => ({
  setMapPosition: bindActionCreators(setMapPosition, dispatch),
  setActivePage: bindActionCreators(setActivePage, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
