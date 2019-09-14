import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import { matchPath, withRouter } from "react-router";
import generatePath from "./generatePath";

class SwipeableNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: {}
    };
    this.threshold = true;
    this.changePageTo = this.changePageTo.bind(this);
  }

  changePageTo(path) {
    this.props.history.push(path);
  }
  currentPageIndex = 0;

  // Trigger the location change to the route path
  handleIndexChange = (index, type) => {
    this.currentPageIndex = this.matchedIndex;
    const {
      props: { path, defaultParams }
    } = React.Children.toArray(this.props.children)[index];

    let url;
    if (path.includes(":")) {
      if (path in this.state.urls) {
        url = this.state.urls[path];
      } else {
        // Build url with defaults
        url = generatePath(path, defaultParams);
        this.setState(state => ({ urls: { ...state.urls, [path]: url } }));
      }
    } else {
      url = path;
    }
    this.historyGoTo(url);
    // titleElement.style = `opacity: 1`;
    // Call the onChangeIndex if it's set
    if (typeof this.props.onChangeIndex === "function") {
      this.props.onChangeIndex(index, type);
    }
  };
  threshold = false;
  swipeLeftHandler() {
    console.log("swiping left", this.threshold);
    if (this.threshold) {
      this.threshold = false;
    } else {
      var j = 0;
      const self = this;
      var intervalId = setInterval(function() {
        if (j >= 100) {
          clearInterval(intervalId);
        }
        self.swipeLeft(1 - j / 100);
        j += 3;
      }, 1);
    }
  }

  swipeLeft(progress) {
    // const backButton = document.querySelector(".navbar-ios-button");
    // const firstPageTitle = document.querySelector(".title-red");
    // const firstPageTitleBlack = document.querySelector(".title-red-black");
    // const middleReference = document.querySelector(".middle");
    // const secondPageTitle = document.querySelector(".title-blue");
    // const elWidth = firstPageTitle.getBoundingClientRect().width / 2;
    // const middleX = window.outerWidth / 2 - elWidth;

    // const normalizedValue = (1 - progress) / 2;
    // const output = normalizedValue * 2;
    // // console.log(value, progress);
    // // const percentWidth = (window.innerWidth / 8) * normalized - 8 * normalized;
    // const elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
    //   .width;
    // const initialPositionSecondPagef = window.outerWidth / 2 - elWidth;
    // const initialPositionSecondPage =
    //   window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;

    // const progressNormalized = 1 - progress;
    // const normalized = progressNormalized * 2;
    // const translateFirstElementToCenter = output * middleX - 26 * output;
    // firstPageTitle.style = `transform: translateX(${translateFirstElementToCenter}px); opacity: ${progress}`;
    // firstPageTitleBlack.style = `transform: translateX(${translateFirstElementToCenter}px);opacity: ${progressNormalized}`;
    // backButton.style = `opacity: ${progress}`;

    // secondPageTitle.style = `transform: translateX( ${initialPositionSecondPage +
    //   (normalized * window.outerWidth) / 2}px);opacity: ${1 - normalized}`;

    const backButton = document.querySelector(".navbar-ios-button");
    const firstPageTitle = document.querySelector(".title-red");
    const firstPageTitleBlack = document.querySelector(".title-red-black");
    const secondPageTitle = document.querySelector(".title-blue");
    const elWidthFirstPageTitle = firstPageTitle.getBoundingClientRect().width;
    const middleX = window.outerWidth / 2 - elWidthFirstPageTitle;
    const center = 1 * middleX - 26 * 1;
    const elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
      .width;
    const initialPositionSecondPage =
      window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;
    const initialPositionFirstPage =
      window.outerWidth / 2 - 26 - elWidthFirstPageTitle / 2;

    secondPageTitle.style = `transform: translateX(${window.outerWidth}px);opacity: 0;`;
    firstPageTitle.style = `transform: translateX(${window.outerWidth}px);opacity: 0;`;

    firstPageTitleBlack.style = `transition: transform 200ms ease;transform: translateX(${initialPositionFirstPage}px); opacity: 1`;
    backButton.style = `opacity: 0;`;
  }

  swipeRight() {
    if (this.threshold) {
      this.threshold = false;
    } else {
      const backButton = document.querySelector(".navbar-ios-button");
      const firstPageTitle = document.querySelector(".title-red");
      const firstPageTitleBlack = document.querySelector(".title-red-black");
      const middleReference = document.querySelector(".middle");
      const secondPageTitle = document.querySelector(".title-blue");

      const elWidth = firstPageTitle.getBoundingClientRect().width / 2;
      const middleX = window.outerWidth / 2 - 26 - elWidth;

      const elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
        .width;
      const initialPositionSecondPage =
        window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;

      // alert(secondPageTitle.getBoundingClientRect().left)
      secondPageTitle.style = `transform: translateX(${window.outerWidth}px);`;
      secondPageTitle.style = `transition: transform 200ms ease;transform: translateX(${initialPositionSecondPage}px);`;
      firstPageTitle.style = `transition: transform 200ms ease;transform: translateX(${0}px);`;
      firstPageTitleBlack.style = `transition: transform 200ms ease;transform: translateX(${0}px);`;
      backButton.style = `transition: opacity 200ms ease;opacity: 1;`;
    }
  }
  triggerOnChangeIndex = location => {
    const { children } = this.props;
    React.Children.forEach(children, (element, index) => {
      const { path: pathProp, exact, strict, from } = element.props;
      const path = pathProp || from;
      if (matchPath(location.pathname, { path, exact, strict })) {
        if (index === 0) {
          this.swipeLeftHandler();
        } else {
          this.swipeRight();
        }

        if (typeof this.props.onChangeIndex === "function") {
          this.props.onChangeIndex(index);
        }
        this.setState(state => ({
          urls: { ...state.urls, [path]: location.pathname }
        }));
      }
    });
  };

  historyGoTo = path => {
    const { replace, history } = this.props;
    return replace ? history.replace(path) : history.push(path);
  };

  componentDidMount() {
    const { history } = this.props;
    this.triggerOnChangeIndex(history.location);
    this.unlistenHistory = history.listen(location => {
      // When the location changes, call onChangeIndex with the route index
      this.triggerOnChangeIndex(location);
    });

    console.log("cdm", this.matchedIndex);
    const backButton = document.querySelector(".navbar-ios-button");
    const firstPageTitle = document.querySelector(".title-red");
    const firstPageTitleBlack = document.querySelector(".title-red-black");
    const secondPageTitle = document.querySelector(".title-blue");
    const elWidthFirstPageTitle = firstPageTitle.getBoundingClientRect().width;
    const middleX = window.outerWidth / 2 - elWidthFirstPageTitle;
    const center = 1 * middleX - 26 * 1;
    const elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
      .width;
    const initialPositionSecondPage =
      window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;
    const initialPositionFirstPage =
      window.outerWidth / 2 - 26 - elWidthFirstPageTitle / 2;
    if (this.matchedIndex == 0) {
      console.log("entrou");
      secondPageTitle.style = `display: none`;
      backButton.style = "opacity: 0";
      firstPageTitle.style = `transform: translateX(${initialPositionFirstPage}px); opacity: 0; `;
      firstPageTitleBlack.style = `transform: translateX(${initialPositionFirstPage}px); opacity: 1; `;
      // firstPageTitle.style = `display: none`;
    } else {
      backButton.style = "opacity: 1";
      secondPageTitle.style = `transition: none; transform: translateX(${initialPositionSecondPage}px);opacity: 1`;
      // secondPageTitle.style = `;opacity: ${event * 0.25}`;
      firstPageTitleBlack.style = `left:26px; opacity: 0`;
      firstPageTitle.style = `left:26px;`;

      secondPageTitle.style = `transition: none;transform: translateX(${initialPositionSecondPage}px)`;
      document.querySelector(
        ".middle"
      ).style = `transform: translateX(${window.outerWidth / 2}px)`;

      document
        .querySelector(".page-red")
        .addEventListener("click", function(event) {
          // console.log(self.props);
          self.props.history.push("/blue");
        });
      document
        .querySelector(".title-red-black")
        .addEventListener("click", function(event) {
          // console.log(self.props);
          self.props.history.push("/red");
        });
    }
    let self = this;
    firstPageTitle.addEventListener("click", function(event) {
      // console.log(self.props);
      self.props.history.push("/red");
    });
  }

  componentWillUnmount() {
    this.unlistenHistory();
  }

  componentDidUpdate(prevProps) {
    // If index prop changed, change the location to the path of that route
    if (prevProps.index !== this.props.index) {
      const paths = React.Children.map(
        this.props.children,
        element => element.props.path
      );
      this.historyGoTo(paths[this.props.index]);
    }
  }

  onSwipeHandler = (progress, type) => {
    const backButton = document.querySelector(".navbar-ios-button");
    const firstPageTitle = document.querySelector(".title-red");
    const firstPageTitleBlack = document.querySelector(".title-red-black");
    const middleReference = document.querySelector(".middle");
    const secondPageTitle = document.querySelector(".title-blue");
    const elWidth = firstPageTitle.getBoundingClientRect().width / 2;
    const middleX = window.outerWidth / 2 - elWidth;

    const normalizedValue = (1 - progress) / 2;
    const output = normalizedValue * 2;
    // console.log(value, progress);
    // const percentWidth = (window.innerWidth / 8) * normalized - 8 * normalized;
    const elWidthSecondPageTitle = secondPageTitle.getBoundingClientRect()
      .width;
    const initialPositionSecondPage =
      window.outerWidth / 2 - 26 - elWidthSecondPageTitle / 2;
    // middleReference.style = `left: ${middleX}px`;
    if (type != "end") {
      const progressNormalized = 1 - progress;
      const normalized = progressNormalized * 2;
      const translateFirstElementToCenter = output * middleX - 26 * output;
      firstPageTitle.style = `transition: none;transform: translateX(${translateFirstElementToCenter}px); opacity: ${progress}`;
      firstPageTitleBlack.style = `transition: none;transform: translateX(${translateFirstElementToCenter}px);opacity: ${progressNormalized}`;
      backButton.style = `opacity: ${progress}`;

      secondPageTitle.style = `transition: none;transform: translateX( ${initialPositionSecondPage +
        (normalized * window.outerWidth) / 2}px);opacity: ${1 - normalized}`;
    } else {
      // console.log(progress, type);
      const center = 1 * middleX - 26 * 1;

      if (progress == 0) {
        // this.threshold = true;
        // secondPageTitle.style = `display: none`;
        // backButton.style = "opacity: 0";
        // firstPageTitle.style = `transform: translateX(${center}px); opacity: 0; `;
        // firstPageTitleBlack.style = `transform: translateX(${center}px); opacity: 1; `;

        this.swipeLeft();

        // firstPageTitle.style = `display: none`;
      } else {
        // backButton.style = "opacity: 1";
        // secondPageTitle.style = `transform: translateX(${initialPositionSecondPage}px);opacity: 1`;
        // // secondPageTitle.style = `;opacity: ${event * 0.25}`;
        // firstPageTitleBlack.style = `left:26px; opacity: 0`;
        // firstPageTitle.style = `left:26px;`;
        this.swipeRight();
      }
    }
  };
  matchedIndex = 0;
  render() {
    const {
      children,
      index,
      replace,
      innerRef,
      location,
      history,
      staticContext,
      match: routeMatch,
      ...rest
    } = this.props;

    // If there's no match, render the first route with no params

    let match;
    if (index) {
      this.matchedIndex = index;
    } else {
      React.Children.forEach(children, (element, index) => {
        const { path: pathProp, exact, strict, from } = element.props;
        const path = pathProp || from;

        match = matchPath(location.pathname, { path, exact, strict });
        if (match) {
          this.matchedIndex = index;
        }
      });
    }

    const renderableRoutes = React.Children.toArray(children).filter(
      (element, index) =>
        !element.props.path.includes(":") ||
        Boolean(element.props.defaultParams) ||
        element.props.path in this.state.urls
    );

    return (
      <SwipeableViews
        {...rest}
        index={this.matchedIndex}
        onChangeIndex={this.handleIndexChange}
        ref={innerRef}
        onSwitching={this.onSwipeHandler}
        enableMouseEvents={true}
        axis="x"
      >
        {renderableRoutes.map((element, index) => {
          const { path, component, render, children } = element.props;
          const props = { location, history, staticContext };

          let match = matchPath(location.pathname, element.props);
          if (match) {
            match.type = "full";
          } else if (path in this.state.urls) {
            match = matchPath(this.state.urls[path], element.props);
            match.type = "outOfView";
          } else {
            match = matchPath(
              generatePath(path, element.props.defaultParams),
              element.props
            );
            match.type = "none";
          }
          props.match = match;
          props.key = path;

          // A lot of this code is borrowed from the render method of
          // Route. Why can't I just render the Route then?
          // Because Route only renders the component|render|children
          // if there's a match with the location, while here I render
          // regardless of the location.
          return component
            ? React.createElement(component, props)
            : render
            ? render(props)
            : children
            ? typeof children === "function"
              ? children(props)
              : !Array.isArray(children) || children.length // Preact defaults to empty children array
              ? React.Children.only(children)
              : null
            : null;
        })}
      </SwipeableViews>
    );
  }
}

export default withRouter(SwipeableNavigation);
