import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "./styles.css";
import SwipeableViews from "react-swipeable-views";
import Spotted from "../spotted/spotted.component.jsx";
import elasticScroll from "elastic-scroll-polyfill";
import NewSpotted from "../new-spotted/new-spotted.component.jsx";
import SpottedDetails from "../spotted-details/spotted-details.component.jsx";
import { devices } from "../../redux/constants/enums";
import FooterIos from "../footer-ios/footer-ios.component.jsx";
import { getRandomNames } from "../../util/random-names";
import NearbyFeedComponent from "../feeds/nearby-feed.component.jsx";
// import nearbyFeedComponent from "../feeds/nearby-feed.component.jsx";
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}
const ANIMATION_DURATION = 260;
export class NativeNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      secondPageNewSpotted: false,

      secondPageSpottedInfo: false
    };
    this.push = this.push.bind(this);
    this.mapPages = this.mapPages.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.alert = this.alert.bind(this);
    this.onChangeIndex = this.onChangeIndex.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.initialize = this.initialize.bind(this);
    this.openSpottedInfo = this.openSpottedInfo.bind(this);
    this.userOS = this.props.device == devices.ANDROID ? "android" : "ios";
  }

  alert() {
    alert("hello world");
  }
  previousPage() {
    this.swipeLeft();

    this.setState({
      secondPageNewSpotted: false,
      secondPageSpottedInfo: false,
      selectedSpotted: null
    });
  }
  componentDidMount() {
    this.initialize();
    elasticScroll();
  }

  onFirstPage() {
    const firstPageTitle = document.querySelector(".title-red");
    const firstPageTitleBlack = document.querySelector(".title-red-black");

    const backButton = document.querySelector(".navbar-ios-button");

    if (this.props.device === devices.ANDROID) {
      const elWidthFirstPageTitle = firstPageTitle.getBoundingClientRect()
        .width;

      let initialPositionFirstPage =
        window.outerWidth / 2 - 26 - elWidthFirstPageTitle / 2;

      firstPageTitle.style = `opacity: 0; `;
      firstPageTitleBlack.style = `opacity: 1; `;

      const secondPageTitle = document.querySelector(".title-blue");
      secondPageTitle.style = `opacity: 0`;

      const menuButton = document.querySelector(`.menu-button`);
      menuButton.style = `opacity: 1`;
      const backAndroidButton = document.querySelector(`.back-android`);
      backAndroidButton.style = `opacity: 0`;
    } else {
      const elWidthFirstPageTitle = firstPageTitle.getBoundingClientRect()
        .width;

      let initialPositionFirstPage =
        window.outerWidth / 2 - 26 - elWidthFirstPageTitle / 2;

      firstPageTitle.style = `transition: all ${ANIMATION_DURATION}ms ease; transform: translateX(${initialPositionFirstPage}px); opacity: 0; `;
      firstPageTitleBlack.style = `transition: all ${ANIMATION_DURATION}ms ease; transform: translateX(${initialPositionFirstPage}px); opacity: 1; `;

      const secondPageTitle = document.querySelector(".title-blue");
      secondPageTitle.style = `transition: all ${ANIMATION_DURATION}ms ease; transform: translateX(${window.outerWidth +
        100}px);opacity: 0`;
    }
  }
  onSecondPage() {
    const firstPageTitle = document.querySelector(".title-red");
    const firstPageTitleBlack = document.querySelector(".title-red-black");
    const secondPageTitle = document.querySelector(".title-blue");

    const backButton = document.querySelector(".navbar-ios-button");

    if (this.props.device == devices.ANDROID) {
      firstPageTitle.style = `opacity: 0; display: none; `;
      firstPageTitleBlack.style = `opacity: 0; `;
      secondPageTitle.style = `opacity: 1`;
    } else {
      let elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
        .width;
      if (this.state.secondPageSpottedInfo)
        elWidthSecondPageTitle = getTextWidth("Spotted", "bold 12pt arial");
      else
        elWidthSecondPageTitle = getTextWidth("New Spotted", "bold 12pt arial");
      let initialPositionSecondPage =
        window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;
      firstPageTitle.style = `transition: all ${ANIMATION_DURATION}ms ease; transform: translateX(0px); opacity: 1; `;
      firstPageTitleBlack.style = `transition: all ${ANIMATION_DURATION}ms ease; transform: translateX(0px); opacity: 0; `;
      secondPageTitle.style = `transition: all  ${ANIMATION_DURATION} ease; transform: translateX(${initialPositionSecondPage}px);opacity: 1`;
    }
  }

  initialize() {
    if (
      this.state.secondPageNewSpotted != true &&
      this.state.secondPageSpottedInfo != true
    ) {
      this.onFirstPage();
    } else {
      this.onSecondPage();
    }
    return;
  }

  push(component, title) {
    this.swipeRight();
  }

  componentWillReceiveProps(props) {
    this.initialize();
  }
  mapPages(currentPages) {
    // console.log(this.props.pages);

    this.initialize();
  }

  openSpottedInfo(selectedSpotted) {
    this.setState(
      { secondPageSpottedInfo: true, selectedSpotted },
      this.initialize
    );
  }

  onSwipeHandler = (progress, type) => {
    if (this.state.secondPageNewSpotted || this.state.secondPageSpottedInfo) {
      const backButton = document.querySelector(
        `.navbar-${this.userOS}-button`
      );
      const actionButton = document.querySelector(
        `.navbar-${this.userOS}-create-post`
      );

      const firstPageTitle = document.querySelector(`.title-red`);
      const firstPageTitleBlack = document.querySelector(`.title-red-black`);
      const secondPageTitle = document.querySelector(`.title-blue`);
      const elWidth = firstPageTitle.getBoundingClientRect().width / 2;
      const middleX = window.outerWidth / 2 - elWidth;
      const normalizedValue = (1 - progress) / 2;
      const output = normalizedValue * 2;
      const elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
        .width;

      let initialPositionSecondPage =
        window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;
      if (this.props.device === devices.ANDROID) {
        const menuButton = document.querySelector(`.menu-button`);
        const backAndroidButton = document.querySelector(`.back-android`);
        if (type != "end") {
          const progressNormalized = 1 - progress;
          const normalized = progressNormalized * 2;
          firstPageTitleBlack.style = `transition: none;opacity: ${progressNormalized}`;
          menuButton.style = `transition: none;opacity: ${1 - progress}`;
          secondPageTitle.style = `transition: none;opacity: ${1 - normalized}`;

          backAndroidButton.style = `transition: none;opacity: ${progress}`;
          actionButton.style = `transition: none;opacity: ${1 - progress}`;
        } else {
          if (progress == 0) {
            this.swipeLeft();
            actionButton.style = "opacity: 1";
            menuButton.style = `opacity: 1`;
            backAndroidButton.style = `opacity: 0`;
          } else {
            this.swipeRight();
            backAndroidButton.style = `opacity: 1`;
            menuButton.style = `opacity: 0`;
            actionButton.style = "opacity: 0";
          }
        }
      } else {
        if (type != "end") {
          const progressNormalized = 1 - progress;
          const normalized = progressNormalized * 2;
          const translateFirstElementToCenter = output * middleX - 26 * output;
          firstPageTitle.style = `transition: none;transform: translateX(${translateFirstElementToCenter}px); opacity: ${progress}`;
          firstPageTitleBlack.style = `transition: none;transform: translateX(${translateFirstElementToCenter}px);opacity: ${progressNormalized}`;
          backButton.style = `opacity: ${progress}`;

          secondPageTitle.style = `transition: none;transform: translateX( ${initialPositionSecondPage +
            (normalized * window.outerWidth) / 2}px);opacity: ${1 -
            normalized}`;

          actionButton.style = `transition: none;opacity: ${1 - progress}`;
        } else {
          if (progress == 0) {
            this.swipeLeft();
            actionButton.style = "opacity: 1";
          } else {
            this.swipeRight();
            actionButton.style = "opacity: 0";
          }
        }
      }
    }
  };

  swipeLeft(changing) {
    setTimeout(() => {
      this.setState({
        secondPageNewSpotted: false,
        secondPageSpottedInfo: false,
        selectedSpotted: null
      });
    }, ANIMATION_DURATION);

    const firstPageTitle = document.querySelector(".title-red");
    const firstPageTitleBlack = document.querySelector(".title-red-black");
    const secondPageTitle = document.querySelector(".title-blue");
    const actionButton = document.querySelector(
      `.navbar-${this.userOS}-create-post`
    );


    if (this.props.device === devices.ANDROID) {
      const backAndroidButton = document.querySelector(`.back-android`);
      backAndroidButton.style = `opacity: 0`;
      secondPageTitle.style = `opacity: 0;`;
      firstPageTitleBlack.style = `opacity: 1;`;
      const menuButton = document.querySelector(`.menu-button`);
      menuButton.style = `opacity: 1`;
      actionButton.style = `opacity: 1`;
    } else {
      const elWidthFirstPageTitle = firstPageTitle.getBoundingClientRect()
        .width;
      const middleX = window.outerWidth / 2 - elWidthFirstPageTitle;
      const elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
        .width;
      let initialPositionSecondPage =
        window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;
      initialPositionSecondPage -= 0;
      let initialPositionFirstPage =
        window.outerWidth / 2 - 26 - elWidthFirstPageTitle / 2;
      initialPositionFirstPage -= 0;
      secondPageTitle.style = `transition: all ${ANIMATION_DURATION}ms ease;opacity: 0; transform: translateX(${window.outerWidth}px)`;
      firstPageTitle.style = `transition: all ${ANIMATION_DURATION}ms ease; transform: translateX(${initialPositionFirstPage}px);opacity: 0;`;
      firstPageTitleBlack.style = `transition: all ${ANIMATION_DURATION}ms ease;transform: translateX(${initialPositionFirstPage}px); opacity: 1`;
      actionButton.style = `transition: all ${ANIMATION_DURATION}ms ease; opacity: 1`;
    }
  }
  threshold = false;
  swipeRight() {
    this.threshold = false;
    if (this.threshold) {
      this.threshold = false;
    } else {
      const backButton = document.querySelector(
        `.navbar-${this.userOS}-button`
      );
      const firstPageTitle = document.querySelector(".title-red");
      const firstPageTitleBlack = document.querySelector(".title-red-black");
      const middleReference = document.querySelector(".middle");
      const secondPageTitle = document.querySelector(".title-blue");

      backButton.style = `opacity: 1`;
      let elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
        .width;

      if (this.props.device == devices.ANDROID) {
        secondPageTitle.style = `opacity:1;`;
        firstPageTitle.style = `opacity: 0`;
        firstPageTitleBlack.style = `opacity: 0`;
        const menuButton = document.querySelector(`.menu-button`);
        menuButton.style = `opacity: 0`;

        const backAndroidButton = document.querySelector(`.back-android`);
        backAndroidButton.style = `opacity: 1`;
      } else {
        if (this.state.secondPageNewSpotted) {
          elWidthSecondPageTitle = getTextWidth(
            "New Spotted",
            "bold 12pt arial"
          );
        } else if (this.state.secondPageSpottedInfo) {
          elWidthSecondPageTitle = getTextWidth("Spotted", "bold 12pt arial");
        }

        let initialPositionSecondPage =
          window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;

        secondPageTitle.style = `transition: all ${ANIMATION_DURATION}ms ease; opacity:1;transform: translateX(${initialPositionSecondPage}px);`;
        firstPageTitle.style = `transition: all ${ANIMATION_DURATION}ms ease;transform: translateX(${0}px);`;
        firstPageTitleBlack.style = `transition: all ${ANIMATION_DURATION}ms ease;transform: translateX(${0}px);`;
      }
    }
  }

  previousPageTitle = "";
  currentPageTitle = "";

  openModal(page) {
    if (this.props.openModal) this.props.openModal(page);
  }
  closeModal() {
    if (this.props.closeModal) this.props.closeModal();
  }
  onChangeIndex(index, index2) {
    console.log("changed", index, index2);
    if (index == 0) {
      this.previousPage();
    }
  }
  render() {
    const {
      children,
      index,
      replace,

      location,
      history,
      staticContext,
      match: routeMatch,
      device,
      ...rest
    } = this.props;
    const self = this;

    const isNewIOS = true;

    return (
      <Router>
        <div className="App">
          <div
            style={{
              transform: `translateY(${
                this.props.modalPage ? "0px" : "calc(100vh)"
              })`
            }}
            className="page-modal"
          >
            <div className={`navbar-${this.userOS} page-modal-title`}>
              <div className={`navbar-${this.userOS}-title`}>
                {this.props.modalPage && this.props.modalPage.title}
              </div>
              <div
                onClick={() => {
                  this.closeModal();
                }}
                className={`page-modal-close`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 47.971 47.971"
                >
                  <g>
                    <path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="page-modal-content">
              {this.props.modalPage && this.props.modalPage.component}
            </div>
          </div>
          <div className={`navbar-${this.userOS}`}>
            {this.props.device === devices.ANDROID ? (
              <div>
                <div
                  onClick={() => {
                    if (
                      this.state.secondPageNewSpotted ||
                      this.state.secondPageSpottedInfo
                    )
                      self.previousPage();
                    else alert("Ooops. Menu still not implemented :P");
                  }}
                  className={`navbar-${this.userOS}-button`}
                >
                  <svg
                    style={{
                      opacity:
                        this.state.secondPageNewSpotted ||
                        this.state.secondPageSpottedInfo
                          ? 1
                          : 0
                    }}
                    className={`navbar-android-button-icon back-android`}
                  >
                    <path d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554  c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587  c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z" />
                  </svg>
                  <svg
                    style={{
                      opacity:
                        this.state.secondPageNewSpotted ||
                        this.state.secondPageSpottedInfo
                          ? 0
                          : 1
                    }}
                    className={`navbar-android-button-icon menu-button`}
                    height="32px"
                    version="1.1"
                    viewBox="0 0 32 32"
                    width="32px"
                  >
                    <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  self.previousPage();
                }}
                className={`navbar-${this.userOS}-button`}
                style={{
                  opacity:
                    this.state.secondPageNewSpotted ||
                    this.state.secondPageSpottedInfo
                      ? 1
                      : 0
                }}
              >
                <svg
                  className={`navbar-ios-button-icon back`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" />
                </svg>
              </div>
            )}

            <div
              onClick={() => {
                self.previousPage();
              }}
              style={{
                top: this.props.device === devices.IOS_NOTCH ? 57 : "auto"
              }}
              className={`title-red navbar-${this.userOS}-title`}
            >
              Feed
            </div>
            <div
              onClick={() => {
                self.previousPage();
              }}
              style={{
                top: this.props.device === devices.IOS_NOTCH ? 57 : "auto"
              }}
              className={`title-red-black navbar-${this.userOS}-title`}
            >
              Feed
            </div>

            <div
              onClick={() => {
               
                  self.setState(
                    {
                      secondPageNewSpotted: true
                    },
                    this.initialize
                  );
                
              }}
              style={{
                display:
                  !this.state.secondPageNewSpotted &&
                  !this.state.secondPageSpottedInfo
                    ? "visible"
                    : "none"
                // transform: `translateX(${
                //   hasActionButton ? 0 : window.outerWidth * -1
                // }px)`
              }}
              className={`navbar-${this.userOS}-create-post`}
            >
              <svg
                style={{
                  height: "24px",
                  marginRight:
                    this.props.device === devices.ANDROID ? "0" : "6px"
                }}
                className="navbar-button-icon"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 1000 1000"
              >
                <g>
                  <path d="M979.3,152.5L847.5,20.7c-7.2-7.2-16.6-10.7-26-10.7c-9.4,0-18.8,3.5-26,10.7L285.6,530.6v183.8h183.8l509.9-510c7.2-7.2,10.7-16.6,10.7-26S986.5,159.6,979.3,152.5z M438.7,622.5h-61.2v-61.2l444-444l61.3,61.3L438.7,622.5z M882.8,469.4c-25.4,0-45.9,20.5-45.9,45.9v382.8h-735v-735h382.8c25.4,0,45.9-20.5,45.9-45.9c0-25.4-20.5-45.9-45.9-45.9H71.3C37.4,71.2,10,98.7,10,132.5v796.2c0,33.8,27.4,61.2,61.3,61.2h796.2c33.8,0,61.3-27.4,61.3-61.3V515.3C928.7,489.9,908.1,469.4,882.8,469.4z" />
                </g>
              </svg>
            </div>

            <div
              style={{
                top: this.props.device === devices.IOS_NOTCH ? 57 : "auto"
              }}
              className={`title-blue navbar-${this.userOS}-title`}
            >
              {this.state.secondPageNewSpotted ? "New Spotted" : "Spotted"}
            </div>
            <div className={`middle`}></div>
          </div>

          {this.state.secondPageNewSpotted === true ? (
            <SwipeableViews
              className="swipeable-views"
              onChangeIndex={this.onChangeIndex}
              index={1}
              onSwitching={this.onSwipeHandler}
              enableMouseEvents={true}
              axis="x"
              ref="swpv"
            >
              <div style={{ minHeight: "100vh" }}>
                {/* <NearbyFeedComponent openSpotted={(spotted)=>{
                  this.openSpottedInfo(spotted);
                }} /> */}
                <NearbyFeedComponent
                  openSpotted={spotted => {
                    this.openSpottedInfo(spotted);
                  }}
                />
              </div>
              <NewSpotted previousPage={this.previousPage} />
            </SwipeableViews>
          ) : this.state.secondPageSpottedInfo ? (
            <SwipeableViews
              className="swipeable-views"
              onChangeIndex={this.onChangeIndex}
              index={1}
              onSwitching={this.onSwipeHandler}
              enableMouseEvents={true}
              axis="x"
              ref="swpv"
            >
              <div style={{ minHeight: "100vh" }}>
                <NearbyFeedComponent
                  openSpotted={spotted => {
                    this.openSpottedInfo(spotted);
                  }}
                />
              </div>

              <SpottedDetails {...this.state.selectedSpotted} />
            </SwipeableViews>
          ) : (
            <SwipeableViews
              className="swipeable-views"
              onChangeIndex={this.onChangeIndex}
              index={0}
              onSwitching={this.onSwipeHandler}
              enableMouseEvents={true}
              axis="x"
              ref="swpv"
            >
              <div style={{ minHeight: "100vh" }}>
                <NearbyFeedComponent
                  openSpotted={spotted => {
                    this.openSpottedInfo(spotted);
                  }}
                />
              </div>
            </SwipeableViews>
          )}
        </div>
      </Router>
    );
  }
}
