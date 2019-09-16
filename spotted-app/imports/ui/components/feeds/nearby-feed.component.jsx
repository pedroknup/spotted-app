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
import { getRandomNames } from "../../util/random-names";
import { connect } from "react-redux";
import Spotteds from "../../../api/spotteds";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import {
  calculateDistanceBetweenTwoCoords,
  simplifyDistance
} from "../../util/geolocalization";

const itemPerPage = 10;

class NearbyFeedComponent extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      coordinates: null,
      subscription: null,
      skip: 0,
      filters: {}
      //   sort: defaultOrder,
    };
    getGeolocation(
      response => {
        // {
        //   coords={
        //     altitude,
        //     altitudeAccuracy,
        //     latitude,
        //     accuracy,
        //     longitude,
        //   },
        //   timestamp
        // }

        console.log("response", response);
        const coordinates = {
          latitude: response.latitude,
          longitude: response.longitude
        };
        // alert(JSON.stringify(coordinates))

        this.setState({
          subscription: {
            spotteds: Meteor.subscribe("spotteds.published", 0, itemPerPage, {
              latitude: response.latitude,
              longitude: response.longitude
            }, props.uniqueId)
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
  }

  componentWillUnmount() {
    this.state.subscription.spotteds.stop();
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
    console.log("loading more");
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

    // Reset previous array
    this.previous = [];
    console.log(this.data);
    return this.data;
  }

  render() {
    const { coordinates } = this.props;
    const fixedHeight = () => {
      let value;
      if (this.props.device === devices.IOS_NOTCH) {
        // return "calc(100vh - 171px)";
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
    let movies = this.getSpotteds();
    return (
      <div className="wtf" style={fixedHeight()}>
        {!this.state.subscription ? (
          <div
            style={{
              minHeight: "100vh",
              minWidth: "100vw",
              backgroundColor: "red"
            }}
          >
            Loading
          </div>
        ) : !this.state.subscription.spotteds.ready() ? (
          <div
            style={{
              minHeight: "100vh",
              minWidth: "100vw",
              backgroundColor: "red"
            }}
          >
            Loading
          </div>
        ) : (
          <div style={fixedHeight()} data-elastic className="content">
            {movies.map((el, id) => {
              console.log(el);
              return (
                <div
                  key={id}
                  onClick={() => {
                    // ;
                    if (this.props.openSpotted) this.props.openSpotted(el);
                    //   console.log("clicked");
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
                      isLiked={el.isLiked}
                    />
                  )}

                  {/* <code>lol</code> */}
                </div>
              );
            })}
          </div>
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
    coordinates: state.coordinates
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NearbyFeedComponent);

// )(
//   withTracker(() => {
//     const handle = Meteor.subscribe("spotteds");
//     let spotteds = [];
//     let loadedGeolocation = false;
//     try {
//       let currentState = JSON.parse(localStorage.getItem("reducer"));

//       //amsterdam
//       // latitude 52.370216
//       // longitude:  4.895168

//       if (!currentState)
//         currentState = {
//           coordinates: { latitude: 54.370216, longitude: 4.895168 }
//         };
//       else if (!currentState.coordinates)
//         currentState.coordinates = { latitude: 54.370216, longitude: 4.895168 };

//       getGeolocation(res => {
//         console.log(res);
//         spotteds = Spotteds.find({}, { sort: { createdAt: -1 } })
//           .fetch()
//           .map(item => {
//             const distance = calculateDistanceBetweenTwoCoords(
//               item.coordinates.latitude,
//               item.coordinates.longitude,
//               res.latitude,
//               res.longitude
//             );

//             let toReturn = { ...item };
//             toReturn.source = simplifyDistance(distance);
//             return toReturn;
//           });

//         loadedGeolocation = true;
//       });
//     } catch (e) {
//       alert(e);
//     }
//     return {
//       isLoading: !handle.ready() && !loadedGeolocation,
//       spotteds: spotteds
//     };
//   })(NearbyFeedComponent)
