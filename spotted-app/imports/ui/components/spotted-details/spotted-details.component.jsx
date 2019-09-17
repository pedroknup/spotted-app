import React from "react";
import PropTypes from "prop-types";
import "./spotted-details.component.css";
import { bindActionCreators } from "redux";
import elasticScroll from "elastic-scroll-polyfill";
import * as locationActions from "../../redux/actions/index";
import { connect } from "react-redux";
import { withTracker } from "meteor/react-meteor-data";
import { PAGE_SPOTTED, PAGE_HOME } from "../../redux/constants/pages";
import InputComponent from "../core/input/input.component.jsx";
import { Meteor } from "meteor/meteor";
import moment from "moment";
import { devices } from "../../redux/constants/enums";
import SpottedComponent from "../spotted/spotted.component.jsx";

const SpottedDetails = props => {
  const [commentInputValue, setCommentInputValue] = React.useState("");
  const {
    color,
    text,
    id,
    source,
    comments,
    likes,
    isLiked,
    backgroundImage
  } = props;
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
  React.useEffect(() => {
    elasticScroll();
  }, []);
  const postComment = () => {
    if (!commentInputValue.trim()) {
      alert("Spotted can not be empty!");
      return;
    }
    Meteor.call(
      "spotteds.insertComment",
      props._id,
      commentInputValue,
      props.uniqueId
    );
  };
  return (
    <div>
      <SpottedComponent {...props.selectedSpotted} />
      {console.log(props)}
      <section data-elastic className="comments">
        {props.selectedSpotted.comments.map(comment => (
          <div className="comment">
            <div>
              <span
                style={{ color: comment.id ? "red" : "black" }}
                className="comment-author"
              >
                {comment.author}
              </span>
              <span className="comment-body">{comment.text}</span>
            </div>
            <span className="comment-when">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
        ))}
      </section>
      <div
        class="write-comment"
        style={{
          padding: 16,
          bottom:
            props.device === devices.IOS_NOTCH
              ? "120px"
              : props.device === devices.IOS
              ? "42px"
              : "56px"
        }}
      >
        <InputComponent
          value={commentInputValue}
          onChange={setCommentInputValue}
          placeholder="Write a comment"
        />
        <button
          style={{ opacity: commentInputValue.trim() ? "1" : "0.5" }}
          onClick={() => {
            postComment();
            setCommentInputValue("");
          }}
        >
          POST
        </button>
      </div>
    </div>
  );
};

SpottedDetails.propTypes = {
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
    uniqueId: state.uniqueId,
    device: state.device,
    coordinates: state.coordinates,
    selectedSpotted: state.selectedSpotted
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
  })(SpottedDetails)
);
