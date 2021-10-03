import React, { Component, useState, useEffect } from "react";
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

const App = ({ project }) => {
  const router = useRouter();
  var position;

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
    console.log(data)
  }

  const [activePage, setActivePage] = useState(1);

  const handleActivePage = (value) => {
    setActivePage(value);
  };

  return (
    <>
      {data &&
        data.data.residenceplan.plan

          .slice(activePage - 1, activePage)
          .map((value) => {
            return (
              <>
                <div className="shadow-lg ">
                  <div className="relative">
                    {data
                      ? data.sensorPosition.map((row) => (
                          <motion.div
                            drag
                            dragMomentum={false}
                            animate={row.position}
                            style={{
                              backgroundImage: `url(${process.env.BACK_END_URL}/${row.image})`,
                              backgroundPosition: "center",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              height: 50,
                              width: 50,
                            }}
                            className="  absolute text-center"
                          >
                            <small
                              className="text-white"
                              style={{ fontSize: 8 }}
                            >
                              {row.title}
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
                </div>
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
      {/* {data && (
        <Pagination
          type="button"
          className="rainbow-m_auto"
          pages={data.data.residenceplan.plan.length}
          activePage={handleActivePage}
          onChange={(event, page) => setActivePage(page)}
          className="mt-5"
        />
      )} */}
    </>
  );
};

const mapStateToProps = (state) => ({
  project: state.project,
});

export default connect(mapStateToProps)(App);
