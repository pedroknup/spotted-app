/* Usage examples:
import DeviceInfo from "react-native-device-info";
WebViewBridge.addSyncFunction("getUniqueId", DeviceInfo.getUniqueId);
const customAsyncFunction = (arg1, arg2, callback) => {
  callback(null, "success");
});
WebViewBridge.addAsyncFunction("myFunctionName", asyncFunction);
*/
export default {
    // Prepare an empty functions object
    functions: {},

    // Accepts a name and a function which accepts two arguments:
    // an array of args and callback with signature (err, res)
    addFunction(name, normalizedFunc) {
        if (this.functions[name]) {
            console.warn(`Overwriting WebViewBridge function ${name}!`);
        }

        this.functions[name] = normalizedFunc;
    },

    // Accepts an asynchronous function which accepts any number of
    // arguments, followed by a callback with signature (err, res)
    addAsyncFunction(name, func) {
        this.addFunction(name, function (args, callback) {
            func(...args, callback);
        });
    },

    // Accepts a promise-based function which accepts any number of
    // arguments, followed by a callback with signature (err, res)
    addPromiseFunction(name, func) {
        this.addFunction(name, function (args, callback) {
            func(...args).then((res) => {
                callback(null, res);
            }).catch((err) => {
                callback(err);
            });
        });
    },

    // Accepts a synchronous function which accepts any number of
    // arguments and returns any value
    addSyncFunction(name, func) {
        this.addFunction(name, function (args, callback) {
            try {
                callback(null, func(...args));
            } catch (err) {
                callback(err);
            }
        });
    }
};