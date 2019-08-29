/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, Fragment } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { WebView } from "react-native-webview";
import DeviceInfo from "react-native-device-info";

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      text: "ReactNative WebView Sample",
      battery: "",
      text2: ""
    };

    this.onWebViewMessage = this.onWebViewMessage.bind(this);
  }

  handleDataReceived(msgData) {
    this.setState({
      text2: `Message from web view ${msgData.data}`
    });
    msgData.isSuccessfull = true;
    msgData.args = [msgData.data % 2 ? "green" : "red"];
    this.myWebView.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }
  getDeviceBattery(msgData) {
    msgData.isSuccessfull = true;
    const batteryLevel = DeviceInfo.getDeviceId();
    msgData.args = [batteryLevel];
    this.myWebView.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }

  onWebViewMessage(event) {
    console.log("Message received from webview");

    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
    } catch (err) {
      console.warn(err);
      return;
    }

    switch (msgData.targetFunc) {
      case "handleDataReceived":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
      case "getDeviceBattery":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
    }
  }

  render() {
    return (
      <Fragment>
        <WebView
          ref={webview => {
            this.myWebView = webview;
          }}
          tyle={styles.container}
          scrollEnabled={false}
          source={{ uri: "http://192.168.1.104:3000" }}
          onMessage={this.onWebViewMessage}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  welcome: {
    flex: 1,
    paddingTop: 40,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "skyblue"
  },
  webViewContainer: {
    flex: 4,
    marginBottom: 0
  }
});
