import React from "react";
import { connect } from "react-redux";

const HomePage = (props) => {
  return (
    <>
      <h1>page 2 {JSON.stringify(props.position)}</h1>
    </>
  );
};

const mapStateToProps = (state) => ({
    position: state.position,
});

export default connect(mapStateToProps)(HomePage);
