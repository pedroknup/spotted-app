import React from "react";
import { getGeolocation } from "../../util/react-native-bridge";
import { BrowserRouter as Router } from "react-router-dom";
import "../native-navbar/index.css";
import * as actions from "../../redux/actions/index";
import "../native-navbar//styles.css";
import { bindActionCreators } from "redux";
import { withTracker } from "meteor/react-meteor-data";
import SwipeableViews from "react-swipeable-views";
import Spotted from "../spotted/spotted.component.jsx";
import elasticScroll from "elastic-scroll-polyfill";
import NewSpotted from "../new-spotted/new-spotted.component.jsx";
import SpottedDetails from "../spotted-details/spotted-details.component.jsx";
import { devices } from "../../redux/constants/enums";
import FooterIos from "../footer-ios/footer-ios.component.jsx";
import TabAndroid from "../tab-android/tab-android.component.jsx";
import { getRandomNames } from "../../util/random-names";
import { connect } from "react-redux";
import Spotteds from "../../../api/spotteds";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import {
  calculateDistanceBetweenTwoCoords,
  simplifyDistance
} from "../../util/geolocalization";
import LoadingComponent from "../loading/loading.component.jsx";

const itemPerPage = 10;

class NearbyFeedComponent extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      coordinates: null,
      subscription: null,
      tabSelected: 0,
      skip: 0,
      filters: {}
      //   sort: defaultOrder,
    };
    getGeolocation(
      response => {
        const coordinates = {
          latitude: response.latitude,
          longitude: response.longitude
        };
        this.setState({
          subscription: {
            spotteds: Meteor.subscribe(
              "spotteds.published",
              0,
              itemPerPage,
              {
                latitude: response.latitude,
                longitude: response.longitude
              },
              props.uniqueId
            )
            // spottedsCount: Meteor.subscribe("spotteds.count")
          },
          coordinates
        });
      },
      () => {
        alert("err");
      }
    );
    // our local data
    this.data = [];
    this.previous = [];
    this.changeFeedToNearby = this.changeFeedToNearby.bind(this);
    this.changeFeedToPopular = this.changeFeedToPopular.bind(this);
  }

  changeFeedToPopular() {
    this.setState({
      data: [],
      previous: [],
      tabSelected: 1,
      subscription: {
        spotteds: Meteor.subscribe(
          "spotteds.publishedPopular",
          0,
          itemPerPage,
          this.props.uniqueId
        )
      }
    });
  }
  changeFeedToNearby() {
    this.state.subscription.spotteds.stop();
    getGeolocation(
      response => {
        const coordinates = {
          latitude: response.latitude,
          longitude: response.longitude
        };
        this.setState({
          data: [],
          previous: [],
          tabSelected: 0,
          subscription: {
            spotteds: Meteor.subscribe(
              "spotteds.published",
              0,
              itemPerPage,
              {
                latitude: response.latitude,
                longitude: response.longitude
              },
              this.props.uniqueId
            )
          },
          coordinates
        });
      },
      () => {
        alert("err");
      }
    );
  }

  componentWillUnmount() {
    this.state.subscription.spotteds.stop();
  }

  componentDidMount() {
    elasticScroll();
  }

  filterByGenre(event) {
    let filterGenre = {
      ["spotteds.slug"]:
        event.target.value !== "" ? event.target.value : { $ne: null }
    };
    this.updateFilters(filterGenre);
  }

  updateFilters(values) {
    // Merge filters
    // let filters = Object.assign(this.state.filters, values);

    // Update subscription ( reset pagination )
    this.state.subscription.spotteds.stop();
    const coordinates = this.state.coordinates;
    // this.state.subscription.spottedsCount.stop();
    let newSubscription = Object.assign({}, this.state.subscription, {
      spotteds: Meteor.subscribe(
        "spotteds.published",

        0,
        itemPerPage,
        coordinates,
        this.props.uniqueId
      )
      //   spottedsCount: Meteor.subscribe("spotteds.count", filters)
    });

    this.setState({
      subscription: newSubscription,
      filters: filters,
      skip: 0
    });
  }

  loadMore() {
    // Keep a copy of previous page items
    this.previous = this.data;
    // Update subscription
    this.state.subscription.spotteds.stop();
    let newSubscription = Object.assign({}, this.state.subscription, {
      spotteds: Meteor.subscribe(
        "spotteds.published",

        this.previous.length,
        itemPerPage,
        this.state.coordinates,
        this.props.uniqueId
      )
    });

    this.setState({
      subscription: newSubscription,
      skip: this.previous.length
    });
  }

  getSpotteds() {
    // Wait subscription ready to avoid replacing items
    if (!this.state.subscription) return [];
    if (!this.state.subscription.spotteds.ready()) {
      return this.previous;
    }

    // Get new data and merge with old ones
    let newData = Spotteds.find().fetch();
    this.data = this.previous.concat(newData);

    if (this.props.selectedSpotted) {
      console.log(this.state.subscription);
      const foundSpotted = this.data.find(spotted => {
        return spotted._id == this.props.selectedSpotted._id;
      });
      if (foundSpotted) {
        if (
          foundSpotted.commentsAmount !=
            this.props.selectedSpotted.commentsAmount ||
          foundSpotted.likesAmount != this.props.selectedSpotted.likesAmount ||
          foundSpotted.isLiked != this.props.selectedSpotted.isLiked
        ) {
          this.props.actions.changeSelectedSpotted(foundSpotted);
        }
      }
    }

    // Reset previous array
    this.previous = [];
    return this.data.reverse();
  }

  render() {
    const fixedHeight = () => {
      let value;
      if (this.props.device === devices.IOS_NOTCH) {
        value = "calc(100vh - 175px)";
      } else if (this.props.device === devices.IOS) {
        value = "calc(100vh - 110px)";
      } else if (this.props.device === devices.WEB) {
        value = "calc(100vh)";
      }
      return {
        maxHeight: value,
        minHeight: value
      };
    };
    let spottedsArray = this.getSpotteds();
    return (
      <div data-elastic style={fixedHeight()}>
        {!this.state.subscription ? (
          <div
            style={{
              minHeight: "100vh",
              minWidth: "100vw"
            }}
          >
            <LoadingComponent />
          </div>
        ) : !this.state.subscription.spotteds.ready() ? (
          <div
            style={{
              minHeight: "100vh",
              minWidth: "100vw"
            }}
          >
            <LoadingComponent />
          </div>
        ) : (
          <div style={fixedHeight()} className="content">
            {this.props.device === devices.ANDROID && <TabAndroid />}
            {spottedsArray.map((el, id) => {
              return (
                <div
                  key={id}
                  onClick={() => {
                    this.props.actions.changeSelectedSpotted(el);
                    if (this.props.openSpotted) this.props.openSpotted(el);
                  }}
                >
                  {el.visible && (
                    <Spotted
                      text={el.text}
                      source={el.source}
                      color={el.color}
                      id={el.id}
                      comments={el.comments}
                      likes={el.likes}
                      backgroundImage={el.backgroundImage}
                      likesAmount={el.likesAmount}
                      commentsAmount={el.commentsAmount}
                      isLiked={el.isLiked}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {this.props.device != devices.ANDROID && (
          <FooterIos
            selectedIndex={this.state.tabSelected}
            onPopularTabClick={this.changeFeedToPopular}
            onNearbyTabClick={this.changeFeedToNearby}
          />
        )}
      </div>
    );
  }
}

// export default NearbyFeedComponent;

function mapStateToProps(state) {
  return {
    device: state.device,
    uniqueId: state.uniqueId,
    coordinates: state.coordinates,
    selectedSpotted: state.selectedSpotted
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyFeedComponent);
