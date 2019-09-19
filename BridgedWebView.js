import React, { Component } from "react";
import { WebView } from "react-native-webview";
import ReactNativeBridge from "./ReactNativeBridge";
import WebViewBridge from "./WebViewBridge";
import DeviceInfo from "react-native-device-info";

WebViewBridge.addPromiseFunction("getUniqueId", DeviceInfo.getUniqueId);

export default class BridgedWebView extends Component {
    constructor(props) {
        super(props);

        const { reference } = props;

        this.WebView = reference || React.createRef();
    }

    injectReactNativeBridge = () => {
        // Inject the ReactNativeBridge into the WebView
        this.WebView.current.injectJavaScript(
            "(" + ReactNativeBridge.toString() + "())"
        );
    };

    // Handles incoming messages from the WebView and calls a function
    // which should have been defined using one of the addFunction methods
    handle = message => {
        try {
            const { id, functionName, args } = JSON.parse(message);

            if (functionName && WebViewBridge.functions[functionName]) {
                // Call the function and pass the result to the callback
                WebViewBridge.functions[functionName](args, (err, res) => {
                    this.respond({
                        id,
                        err,
                        res
                    });
                });
            }
        } catch (err) {
            this.respond({
                err
            });
        }
    };

    respond = message => {
        // After processing the requested function, WebViewBridge responds to the WebView
        this.WebView.current.injectJavaScript(`
            ReactNativeBridge.response(${JSON.stringify(message)});
        `);
    };

    render() {
        const { onMessage, onLoad, ...props } = this.props;

        return (
            <WebView
                ref={this.WebView}
                // When ReactNativeBridge calls a function we handle it here
                // ReactNativeBridge.call => window.ReactNativeWebView.postMessage => onMessage => WebViewBridge.handle
                onLoad={event => {
                    this.injectReactNativeBridge();

                    if (onLoad) {
                        onLoad(event);
                    }
                }}
                onMessage={event => {
                    this.handle(event.nativeEvent.data);

                    if (onMessage) {
                        onMessage(event);
                    }
                }}
                {...props}
            />
        );
    }
}