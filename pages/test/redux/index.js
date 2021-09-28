import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Link from "next/link";
import { setMapPosition } from "../../../libs/redux/action";

const HomePage = (props) => {
  const setMapPosition = (position) => {
    props.setMapPosition(position);
  };

  return (
    <>
      <h1>Hello world home page {JSON.stringify(props.position)}</h1>
      <button onClick={() => setMapPosition({ scale: 1, x: 50, y: 50 })}>
        TH
      </button>
      <button className="ml-5" onClick={() => setMapPosition({ scale: 1, x: 200, y: 250 })}>
        EN
      </button>
      <Link href="/test/redux/next">
        <button className="ml-5">Next.js</button>
      </Link>
    </>
  );
};

const mapStateToProps = (state) => ({
  position: state.position,
});

const mapDispatchToProps = (dispatch) => ({
  setMapPosition: bindActionCreators(setMapPosition, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
