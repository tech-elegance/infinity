import React, { Component, useState, useEffect } from "react";
import { useRouter } from "next/router";
import ResizableRect from "react-resizable-rotatable-draggable";
import { MapInteractionCSS } from "react-map-interaction";
import { Card, Pagination } from "react-rainbow-components";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import useSWR from "swr";
import {
  motion,
  useMotionValue,
  useDragControls,
  transform,
} from "framer-motion";
import { setFormAddress_Map } from "../../../libs/redux/action";
import fetcher from "../../../libs/fetcher/swr";

const App = ({ setFormAddress_Map, form_address_map, project }) => {
  const router = useRouter();
  const [id, setID] = useState(router.query.id);
  const [old, setOld] = useState({});

  //? find data
  try {
    var { data, error } = useSWR(
      `${process.env.BACK_END_URL}/organization/${project._id}/marks`,
      fetcher
    );
  } catch (err) {
    console.log(err);
  }
  console.log(data);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [top, setTop] = useState(50);
  const [left, setLeft] = useState(50);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [scale, setScale] = useState({
    scale: 0.9,
    translation: { x: 50, y: 50 },
  });

  // useEffect(() => {
  //   data &&
  //     data.data
  //       .filter((filt) => filt._id.toLowerCase().includes(id.toLowerCase()))
  //       .map((row) => {
  //         setWidth(row.position.width);
  //         setHeight(row.position.height);
  //         setTop(row.position.position.y);
  //         setLeft(row.position.position.x);
  //         setRotateAngle(row.position.position.rotate);
  //       });
  // }, []);

  //? Motion
  const handleResize = (style, isShiftKey, type) => {
    let { top, left, width, height } = style;
    top = Math.round(top);
    left = Math.round(left);
    width = Math.round(width);
    height = Math.round(height);
    setWidth(width);
    setHeight(height);
    setTop(top);
    setLeft(left);
    setFormAddress_Map({
      left,
      top,
      height,
      width,
      rotateAngle,
      activePage: data.organizationPlans[activePage - 1]._id,
    });
  };

  const handleRotate = (rotateAngle) => {
    setRotateAngle(rotateAngle);
    //! redux get for form
    setFormAddress_Map({
      left,
      top,
      height,
      width,
      rotateAngle,
      activePage: data.organizationPlans[activePage - 1]._id,
    });
  };

  const handleDrag = (deltaX, deltaY) => {
    setLeft(left + deltaX);
    setTop(top + deltaY);
    //! redux get for form
    setFormAddress_Map({
      left,
      top,
      height,
      width,
      rotateAngle,
      activePage: data.organizationPlans[activePage - 1]._id,
    });
  };

  const handleActivePage = (value) => {
    setActivePage(value);
    //! redux get for form
    setFormAddress_Map({
      left,
      top,
      height,
      width,
      rotateAngle,
      activePage: data.organizationPlans[activePage]._id,
    });
  };

  return (
    <>
      {data &&
        data.organizationPlans
          .slice(activePage - 1, activePage)
          .map((value) => {
            return (
              <>
                <div className=" h-96">
                  <MapInteractionCSS
                    key={value.title}
                    value={scale}
                    onChange={(value) => setScale(value)}
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
                              <motion.div
                                animate={row.position.position}
                                style={{
                                  height: row.position.height,
                                  width: row.position.width,
                                }}
                                className=" bg-yellow-500 absolute text-center"
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
                        backgroundImage: `url(${process.env.BACK_END_URL}/${value.image})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        height: 768,
                        width: 1024,
                        display: "flex",
                      }}
                    />

                    <ResizableRect
                      left={left}
                      top={top}
                      width={width}
                      height={height}
                      rotateAngle={rotateAngle}
                      // aspectRatio={false}
                      // minWidth={10}
                      // minHeight={10}
                      zoomable="n, w, s, e, nw, ne, se, sw"
                      // rotatable={true}
                      // onRotateStart={handleRotateStart}
                      onRotate={handleRotate}
                      // onRotateEnd={handleRotateEnd}
                      // onResizeStart={handleResizeStart}
                      onResize={handleResize}
                      // onResizeEnd={handleUp}
                      // onDragStart={handleDragStart}
                      onDrag={handleDrag}
                      // onDragEnd={handleDragEnd}
                    />
                  </MapInteractionCSS>
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
            {data.organizationPlans.map((row, i) => (
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
                activePage < data.organizationPlans.length &&
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
          pages={data.organizationPlans.length}
          activePage={handleActivePage}
          onChange={(event, page) => setActivePage(page)}
          className="mt-5"
        />
      )} */}
    </>
  );
};

const mapStateToProps = (state) => ({
  form_address_map: state.form_address_map,
  project: state.project,
});

const mapDispatchToProps = (dispatch) => ({
  setFormAddress_Map: bindActionCreators(setFormAddress_Map, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
