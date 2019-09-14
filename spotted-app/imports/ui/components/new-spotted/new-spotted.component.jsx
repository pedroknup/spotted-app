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

  const postSpotted = (text, color, source, actions) => {
    Spotteds.insert({
      color,
      text,
      source,
      comments: [],
      likes: [],
      isLiked: false,
      createdAt: new Date() // current time
    });
    // alert("Success!");
    props.previousPage();
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
    <div style={{height: 'calc(100vh - 100px)'}}>
      <div
        className={`new-spotted new-spotted-${colorClass} ${colorClass !=
          "white" && "white-fg"}`}
      >
        <div className="new-spotted-text">{text ? text : "Preview"}</div>
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
  return { currentLocation: state.currentLocation };
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
