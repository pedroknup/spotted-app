import React from "react";
import PropTypes from "prop-types";
import "./new-spotted.component.css";
import { bindActionCreators } from "redux";

// import { Spotteds } from "../../../api/spotteds.js";
import * as locationActions from "../../redux/actions/index";
import { connect } from "react-redux";
import { withTracker } from "meteor/react-meteor-data";
import { PAGE_SPOTTED, PAGE_HOME } from "../../redux/constants/pages";
import Spotteds from "../../../api/spotteds";
import InputComponent from "../core/input/input.component.jsx";
import { uploadPicture, getGeolocation } from "../../util/react-native-bridge";

const getRandomColor = () => {
  const colors = [
    "yellow",
    "yellow-orange",
    "orange",
    "orange-red",
    "red",
    "red-purple",
    "purple-blue",
    "purple",
    "green",
    "green-yellow",
    "white",
    "black"
  ];
  const randIndex = Math.floor(Math.random() * colors.length);
  return colors[randIndex];
};

const NewSpotted = props => {
  const [text, setText] = React.useState("");
  const [colorClass, setColorClass] = React.useState(getRandomColor());
  const [uploadedImage, setUploadedImage] = React.useState("");
  const postSpotted = (text, color, source, actions) => {
    if (!text || !text.trim()) {
      alert("Spotted can not be empty!");
      return;
    }
    getGeolocation(res => {
      Meteor.call(
        "spotteds.insertSpotted",
        props.uniqueId,
        text,
        color,
        res,
        uploadedImage
      );
      props.previousPage();
    });
  };

  React.useEffect(()=>{
    setUploadedImage("")
  }, [colorClass])

  return (
    <div style={{ height: "calc(100vh - 175px)" }}>
      <div
        style={{ position: "relative" }}
        className={`new-spotted new-spotted-${
          uploadedImage ? "custom" : colorClass
        } ${colorClass != "white" && "white-fg"}`}
      >
        <div style={{ zIndex: 100 }} className="new-spotted-text">
          {text ? text : "Preview"}
        </div>
        {uploadedImage && (
          <img style={{zIndex: 0}} className="new-spotted-bg-img" src={uploadedImage} />
        )}
      </div>
      <div className="new-spotted-form">
        <InputComponent
          onChange={value => {
            setText(value);
          }}
          placeholder="Type your Spotted"
        ></InputComponent>

        <div className="color-selector">
          <div
            onClick={() => {
              setColorClass(getRandomColor());
            }}
            className="random"
          >
            <div>?</div>
          </div>
          <div
            onClick={() => {
              uploadPicture(res => {
                setUploadedImage(res.uri);
              }, ()=>{
                alert("Camera access denied or your phone doesn't have a camera.")
              });
            }}
            className="upload-picture"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              width="510px"
              height="510px"
              viewBox="0 0 510 510"
             
            >
              <g>
                <g id="camera-alt">
                  <circle cx="255" cy="280.5" r="81.6" />
                  <path d="M178.5,25.5l-45.9,51H51c-28.05,0-51,22.95-51,51v306c0,28.05,22.95,51,51,51h408c28.05,0,51-22.95,51-51v-306    c0-28.05-22.95-51-51-51h-81.6l-45.9-51H178.5z M255,408c-71.4,0-127.5-56.1-127.5-127.5c0-71.4,56.1-127.5,127.5-127.5    c71.4,0,127.5,56.1,127.5,127.5C382.5,351.9,326.4,408,255,408z" />
                </g>
              </g>
            </svg>
          </div>
          <div
            onClick={() => {
              setColorClass("yellow");
            }}
            className="yellow"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("yellow-orange");
            }}
            className="yellow-orange"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("orange");
            }}
            className="orange"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("orange-red");
            }}
            className="orange-red"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("red");
            }}
            className="red"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("red-purple");
            }}
            className="red-purple"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("purple");
            }}
            className="purple"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("purple-blue");
            }}
            className="purple-blue"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("blue");
            }}
            className="blue"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("blue-green");
            }}
            className="blue-green"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("green");
            }}
            className="green"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("green-yellow");
            }}
            className="green-yellow"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("white");
            }}
            className="white"
          >
            <div></div>
          </div>
          <div
            onClick={() => {
              setColorClass("red");
            }}
            className="red"
          >
            <div></div>
          </div>
        </div>
      </div>

      <div className="post-spotted">
        <div className="policy">
          By proceeding you are stating that you agree to the terms of use and
          privacy policy. We guarantee absolute anonymity.
        </div>
        <button
          onClick={() => {
            postSpotted(text, colorClass, "source", props.actions);
          }}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

NewSpotted.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  _id: PropTypes.string,
  source: PropTypes.string,
  comments: PropTypes.object,
  likes: PropTypes.number,
  isLiked: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    currentLocation: state.currentLocation,
    coordinates: state.coordinates,
    uniqueId: state.uniqueId
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(locationActions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTracker(() => {
    return {
      tasks: []
    };
  })(NewSpotted)
);
