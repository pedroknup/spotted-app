/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, Fragment } from "react";
import { StyleSheet, Text, View, Platform, PermissionsAndroid } from "react-native";
import BridgedWebView from "./BridgedWebView";
import DeviceInfo from "react-native-device-info";
import ImagePicker from "react-native-image-picker";
import Geolocation from '@react-native-community/geolocation';

const SERVER_URL_WEBBIO = "http://192.168.177.141:3000"; // webbio
const SERVER_URL_KAMILE = 'http://192.168.1.13:3000 '// kamile
const SERVER_URL_HOME = 'http://192.168.1.23:3000 '// home

async function requestLocationPermission(callback) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // {
      //   title: 'Cool Photo App Camera Permission',
      //   message:
      //     'Cool Photo App needs access to your camera ' +
      //     'so you can take awesome pictures.',
      //   buttonNeutral: 'Ask Me Later',
      //   buttonNegative: 'Cancel',
      //   buttonPositive: 'OK',
      // },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      callback(true);
    } else {
      callback(false);
    }
  } catch (err) {
    callback(false);
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "ReactNative WebView Sample",
      battery: "",
      text2: ""
    };

    this.myWebView = React.createRef();

    this.onWebViewMessage = this.onWebViewMessage.bind(this);
  }

  handleDataReceived(msgData) {
    this.setState({
      text2: `Message from web view ${msgData.data}`
    });
    msgData.isSuccessfull = true;
    msgData.args = [msgData.data % 2 ? "green" : "red"];
    this.myWebView.current.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }
  getDeviceBattery(msgData) {
    msgData.isSuccessfull = true;
    const batteryLevel = DeviceInfo.getDeviceId();
    console.log(this.myWebView);
    msgData.args = [batteryLevel];
    this.myWebView.current.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }
  getDeviceId(msgData) {
    msgData.isSuccessfull = true;
    const deviceBrand = DeviceInfo.getDeviceId();
    msgData.args = [deviceBrand];
    this.myWebView.current.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }
  getUniqueId(msgData) {
    msgData.isSuccessfull = true;
    const uniqueId = DeviceInfo.getUniqueId();
    msgData.args = [uniqueId];
    this.myWebView.current.injectJavaScript(
      `window.postMessage('${JSON.stringify(msgData)}', '*');`
    );
  }

  uploadPicture(msgData) {
    try {
      const options = {
        title: "Upload picture"
      };

      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          msgData.isSuccessfull = false;
        } else if (response.error) {
          msgData.isSuccessfull = false;
        } else {
          msgData.isSuccessfull = true;
          const source = { uri: `data:image/jpeg;base64, ${response.data}` }; //TODO: img compression
          msgData.args = [source];
        }
        this.myWebView.current.injectJavaScript(
          `window.postMessage('${JSON.stringify(msgData)}', '*');`
        );
      });
    } catch (e) {
    }
  }

  getGeolocation(msgData) {
    msgData.isSuccessfull = false;
    msgData.args = [];

    requestLocationPermission((granted) => {
      if (granted) {
        const options = {
          enableHighAccuracy: false,
          timeout: 50000
        };

        Geolocation.getCurrentPosition(
          coordinates => {
            msgData.args.push(coordinates);
            msgData.isSuccessfull = true;

            console.log(coordinates);

            this.myWebView.current.injectJavaScript(
              `window.postMessage('${JSON.stringify(msgData)}', '*');`
            );
          },
          (err) => {
            console.log(err);

            this.myWebView.current.injectJavaScript(
              `window.postMessage('${JSON.stringify(msgData)}', '*');`
            );
          },
          options
        );
      } else {
        this.myWebView.current.injectJavaScript(
          `window.postMessage('${JSON.stringify(msgData)}', '*');`
        );
      }
    });
  }

  onWebViewMessage(event) {
    let msgData;

    try {
      msgData = JSON.parse(event.nativeEvent.data);
    } catch (err) {
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
        <BridgedWebView
          reference={this.myWebView}
          style={styles.container}
          // scrollEnabled={false}
          source={{ uri: 'http://192.168.1.38:3000' }}
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
