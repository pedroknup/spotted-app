/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, Fragment } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { WebView } from "react-native-webview";
import DeviceInfo from "react-native-device-info";
import ImagePicker from "react-native-image-picker";

const SERVER_URL_WEBBIO = "http://192.168.177.141:3000"; // webbio
const SERVER_URL_KAMILE = 'http://192.168.1.13:3000 '// kamile
const SERVER_URL_HOME = 'http://192.168.1.23:3000 '// home


export default class App extends Component {
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
  getDeviceId(msgData) {
    msgData.isSuccessfull = true;
    const deviceBrand = DeviceInfo.getDeviceId();
    msgData.args = [deviceBrand];
    this.myWebView.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }
  getUniqueId(msgData) {
    msgData.isSuccessfull = true;
    const uniqueId = DeviceInfo.getUniqueID();
    msgData.args = [uniqueId];
    this.myWebView.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }

  requestLocationPermission() {
    geolocation.setRNConfiguration({ skipPermissionRequests: true });
    geolocation.requestAuthorization();
  }

  uploadPicture(msgData) {
    try {
      const options = {
        title: "Upload picture"
      };
 
      ImagePicker.showImagePicker(options, response => {
         console.warn(JSON.stringify(response));
        if (response.didCancel) {
          msgData.isSuccessfull = false;
        } else if (response.error) {
          msgData.isSuccessfull = false;
        } else {
          console.warn(JSON.stringify(response));
          msgData.isSuccessfull = true;
          const source = { uri: `data:image/jpeg;base64, ${response.data}` };
          msgData.args = [source];
        }
        this.myWebView.injectJavaScript(
          `window.postMessage('${JSON.stringify(msgData)}', '*');`
        );
      });
    } catch (e) {
      // alert(JSON.stringify(e));
      console.warn(e);
    }
  }

  getGeolocation(msgData) {
    const options = {
      enableHighAccuracy: false,
      timeout: 50000
    };
    // navigator.geolocation.setRNConfiguration(options);
    // navigator.geolocation.requestAuthorization();

    navigator.geolocation.getCurrentPosition(
      coordinates => {
        msgData.args = [coordinates];
        msgData.isSuccessfull = true;
        this.myWebView.injectJavaScript(
          `window.postMessage('${JSON.stringify(msgData)}', '*');`
        );
      },
      () => {
        msgData.isSuccessfull = false;
        this.myWebView.injectJavaScript(
          `window.postMessage('${JSON.stringify(msgData)}', '*');`
        );
      },
      options
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
      case "getDeviceId":
        this[msgData.targetFunc].apply(this, [msgData]);
      case "getUniqueId":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
      case "uploadPicture":
        this[msgData.targetFunc].apply(this, [msgData]);
        break;
      case "getGeolocation":
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
          // scrollEnabled={false}
          source={{ uri: SERVER_URL_HOME }}
          onMessage={this.onWebViewMessage}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: -5
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
