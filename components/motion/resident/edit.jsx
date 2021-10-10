import React, { Component, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ResizableRect from "react-resizable-rotatable-draggable";
import { MapInteractionCSS } from "react-map-interaction";
import { Card, Pagination } from "react-rainbow-components";
import { bindActionCreators } from "redux";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { connect } from "react-redux";
import useSWR from "swr";
import {
  motion,
  useMotionValue,
  useDragControls,
  transform,
} from "framer-motion";
import fetcher from "../../../libs/fetcher/swr";
import { setSensorResident } from "../../../libs/redux/action";

const App = ({ project, sensorResident ,setSensorResident}) => {
  const router = useRouter();
  const constraintsRef = useRef(null);
  const [activePage, setActivePage] = useState(1);
  const [sensor, setSensor] = useState([]);

  //? find data
  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/residence/${router.query.id}`,
      fetcher,
      { refreshInterval: 3000 }
    );
  } catch (err) {
    console.log(err);
  } finally {
    //console.log({ data });
  }

  const updateFieldChanged =
    (index, data) =>
    ({ x, y }) => {
      var top = Math.round(y);
      var left = Math.round(x);
      // console.log("index: " + index);
      // console.log({top,left});
      let newArr = [...sensor]; // copying the old datas array
      newArr[index] = {
        top,
        left,
        data,
      }; // replace e.target.value with whatever you want to change it to
      setSensor(newArr);
      setSensorResident(newArr);
    };

  console.log({sensorResident});

  return (
    <>
      {data &&
        data.data.residenceplan.plan
          .slice(activePage - 1, activePage)
          .map((value) => {
            return (
              <>
                <motion.div ref={constraintsRef}>
                  <div className="relative">
                    {data
                      ? data.sensorPosition
                          .filter((filt) =>
                            filt.floor.toLowerCase().includes("fl" + activePage)
                          )
                          .map((row, index) => (
                            <motion.div
                              drag
                              dragConstraints={constraintsRef}
                              dragMomentum={false}
                              animate={row.position}
                              onHoverEnd={updateFieldChanged(index, row)}
                              style={{
                                backgroundImage: `url(${process.env.BACK_END_URL}/${row.image})`,
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                height: 75,
                                width: 75,
                              }}
                              className="text-center"
                            >
                              <small
                                className="absolute left-0 text-red-500 font-bold"
                                style={{ fontSize: 10, bottom: -1, width: 75 }}
                              >
                                {row.name}
                              </small>
                            </motion.div>
                          ))
                      : null}
                  </div>

                  <div
                    style={{
                      backgroundImage: `url(${process.env.BACK_END_URL}/${value.plan})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      height: 768,
                      width: 1024,
                      display: "flex",
                    }}
                  />
                </motion.div>
              </>
            );
          })}
      {data && (
        <div className="grid justify-items-center mt-7">
          <div className="flex items-center">
            <a
              href="#"
              onClick={() => activePage > 1 && setActivePage(activePage - 1)}
            >
              <BsChevronLeft className="h-5 w-5 text-gray-500" />
            </a>
            {data.data.residenceplan.plan.map((row, i) => (
              <a href="#" className="px-1" onClick={() => setActivePage(i + 1)}>
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
              onClick={() =>
                activePage < data.data.residenceplan.plan.length &&
                setActivePage(activePage + 1)
              }
            >
              <BsChevronRight className="h-5 w-5 text-gray-500" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  project: state.project,
  sensorResident: state.sensorResident,
});

const mapDispatchToProps = (dispatch) => ({
  setSensorResident: bindActionCreators(setSensorResident, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
