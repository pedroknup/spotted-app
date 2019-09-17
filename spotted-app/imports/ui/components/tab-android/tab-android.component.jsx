import React, { Component } from "react";
import "./tab-android.component.css";

export default TabAndroid = props => {
  return (
    <div className={`tab-android`}>
      <div>
        <div
          onClick={() => {
            props.onNearbyTabClick();
          }}
          className={`tab-android-item ${props.selectedIndex === 0 &&
            "tab-android-item__selected"}`}
        >
          <span>Nearby</span>
        </div>
        <div
          onClick={() => {
            props.onPopularTabClick();
          }}
          className={`tab-android-item ${props.selectedIndex === 1 &&
            "tab-android-item__selected"}`}
        >
          <span>Popular</span>
        </div>
      </div>
    </div>
  );
};
