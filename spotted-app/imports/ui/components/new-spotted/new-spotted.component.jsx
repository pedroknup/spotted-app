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
    getGeolocation((res)=>{
      Spotteds.insert({
        color,
        text,
        coordinates: res,
        authorId: props.uniqueId,
        createdAt: new Date() // current time
      });
      props.previousPage();
    })

   
  };
  const openSpottedDetails = () => {
    const spottedPage = PAGE_SPOTTED;
    spottedPage.backButton = {
      PAGE_HOME
    };
    spottedPage.payload = {
      color,
      text,
      id,
      source,
      comments,
      likes,
      isLiked
    };
    props.actions.changeLocation({
      ...spottedPage
    });
  };

  return (
    <div style={{ height: "calc(100vh - 175px)" }}>
      <div
        style={{ position: "relative" }}
        className={`new-spotted new-spotted-${
          uploadedImage ? "custom" : colorClass
        } ${colorClass != "white" && "white-fg"}`}
      >
        <div style={{zIndex: 2}} className="new-spotted-text">{text ? text : "Preview"}</div>
        {uploadedImage && (
          <img
            style={{left:0, right: 0, bottom: 0, top: 0, zIndex: 0, height: "100%", width: "100%", position: "absolute" }}
            src={uploadedImage}
          />
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
              });
            }}
            className="upload-picture"
          >
            <svg style={{ width: 8, height: 8 }}>
              <g>
                <path d="M526.76,131.045c-14.277-14.274-31.498-21.413-51.675-21.413h-63.953l-14.558-38.826    c-3.618-9.325-10.229-17.368-19.846-24.128c-9.613-6.757-19.462-10.138-29.551-10.138H200.996    c-10.088,0-19.939,3.381-29.552,10.138c-9.613,6.76-16.225,14.803-19.842,24.128l-14.56,38.826H73.089    c-20.179,0-37.401,7.139-51.678,21.413C7.137,145.32,0,162.544,0,182.721v255.813c0,20.178,7.137,37.404,21.411,51.675    c14.277,14.277,31.5,21.416,51.678,21.416h401.989c20.177,0,37.397-7.139,51.675-21.416    c14.273-14.271,21.412-31.497,21.412-51.675V182.721C548.169,162.544,541.03,145.32,526.76,131.045z M364.446,400.993    c-25.029,25.03-55.147,37.548-90.362,37.548s-65.331-12.518-90.362-37.548c-25.031-25.026-37.544-55.151-37.544-90.358    c0-35.218,12.517-65.333,37.544-90.364c25.028-25.031,55.148-37.544,90.362-37.544s65.333,12.516,90.362,37.544    c25.03,25.028,37.545,55.146,37.545,90.364C401.991,345.842,389.477,375.964,364.446,400.993z" />
                <path d="M274.084,228.403c-22.651,0-42.018,8.042-58.102,24.128c-16.084,16.084-24.126,35.448-24.126,58.104    c0,22.647,8.042,42.014,24.126,58.098c16.084,16.081,35.45,24.123,58.102,24.123c22.648,0,42.017-8.042,58.101-24.123    c16.084-16.084,24.127-35.45,24.127-58.098c0-22.655-8.043-42.019-24.127-58.104C316.102,236.446,296.732,228.403,274.084,228.403    z" />
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
