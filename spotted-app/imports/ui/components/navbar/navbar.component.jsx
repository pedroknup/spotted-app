import React, { Component } from "react";
import "./navbar.component.css";

export default Navbar = ({
  backButtonCallback,
  title,
  backButton,
  goToNewSpottedPage,
  hasActionButton,
  os
}) => {
  return (
    <div className={`navbar-${os}`}>
      {os === "android" ? (
        backButton ? (
          <div
            onClick={() => {
              if (backButtonCallback) backButtonCallback();
            }}
            className={`navbar-${os}-button`}
          >
            <svg version="1.1" viewBox="0 0 31.494 31.494">
              <path
                d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554
	c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587
	c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"
              />
            </svg>
          </div>
        ) : (
          <div className={`navbar-android-menu`}>
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
            >
              <g>
                <g>
                  <path
                    d="M491.318,235.318H20.682C9.26,235.318,0,244.577,0,256s9.26,20.682,20.682,20.682h470.636
           c11.423,0,20.682-9.259,20.682-20.682C512,244.578,502.741,235.318,491.318,235.318z"
                  />
                </g>
              </g>
              <g>
                <g>
                  <path
                    d="M491.318,78.439H20.682C9.26,78.439,0,87.699,0,99.121c0,11.422,9.26,20.682,20.682,20.682h470.636
           c11.423,0,20.682-9.26,20.682-20.682C512,87.699,502.741,78.439,491.318,78.439z"
                  />
                </g>
              </g>
              <g>
                <g>
                  <path
                    d="M491.318,392.197H20.682C9.26,392.197,0,401.456,0,412.879s9.26,20.682,20.682,20.682h470.636
           c11.423,0,20.682-9.259,20.682-20.682S502.741,392.197,491.318,392.197z"
                  />
                </g>
              </g>
            </svg>
          </div>
        )
      ) : (
        backButton && (
          <div
            onClick={() => {
              if (backButtonCallback) backButtonCallback();
            }}
            className={`navbar-${os}-button`}
          >
            <svg
              className={`navbar-${os}-button-icon back`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" />
            </svg>
            <span>Back</span>
          </div>
        )
      )}
      <div />
      <div className={`navbar-${os}-title`}>{title}</div>
      {hasActionButton &&
        (os === "android" ? (
          <div
            onClick={() => {
              if (goToNewSpottedPage) goToNewSpottedPage();
            }}
            className={`navbar-android-create-post`}
          >
            <svg
              x="0px"
              y="0px"
              viewBox="0 0 491.86 491.86"
            >
              <g>
                <g>
                  <path
                    d="M465.167,211.614H280.245V26.691c0-8.424-11.439-26.69-34.316-26.69s-34.316,18.267-34.316,26.69v184.924H26.69
			C18.267,211.614,0,223.053,0,245.929s18.267,34.316,26.69,34.316h184.924v184.924c0,8.422,11.438,26.69,34.316,26.69
			s34.316-18.268,34.316-26.69V280.245H465.17c8.422,0,26.69-11.438,26.69-34.316S473.59,211.614,465.167,211.614z"
                  />
                </g>
              </g>
            </svg>
          </div>
        ) : (
          <div
            onClick={() => {
              if (goToNewSpottedPage) goToNewSpottedPage();
            }}
            className={`navbar-ios-create-post`}
          >
            <svg
              className={`navbar-ios-button-icon`}
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
        ))}
    </div>
  );
};
