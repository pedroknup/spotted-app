import React, { Component } from "react";
import "./tab-android.component.css";

export default TabAndroid = ({}) => {
  return (
    <div className={`tab-android`}>
      <div>
        <div className="tab-android-item tab-android-item__selected">
          <span>Feed</span>
        </div>
        <div className="tab-android-item">
          <span>Nearby</span>
        </div>
      </div>
    </div>
  );
};
