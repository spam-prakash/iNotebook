import React from "react";
import Notes from "./Notes";

const Home = (props) => {
  return (
    <>
      <div className="mx-auto p-4">

      <Notes showAlert={props.showAlert}/>
      </div>
    </>
  );
};

export default Home;
