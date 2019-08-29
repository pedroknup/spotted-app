import {Template} from 'meteor/templating';
import './task.js';
import {Tasks} from '../api/tasks.js';

import './body.html';

const testFunction = () => {
  alert('testFunction');
  Tasks.insert({
    text: 'foi3',
    createdAt: new Date(), // current time
  });
};

Template.body.helpers({
  tasks() {
    return Tasks.find({}, {sort: {createdAt: -1}});
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  },

  'click .buttonDeviceId'() {
    window.document.getElementById('deviceId').innerHTML =
    window.webViewBridge.send() ? "Success" :  "App not running under React Native!";
    try {
      window.webViewBridge.send(
        'getDeviceBattery',
        '',
        function(res) {
          window.document.getElementById('deviceId').innerHTML =
            'Device Id (From RN): ' + JSON.stringify(res);
        },
        function(err) {
          window.document.getElementById('deviceId').innerHTML =
            'error: ' + JSON.stringify(err);
        },
      );
    } catch (error) {
        window.document.getElementById('deviceId').innerHTML =
         "App not running under React Native!"
      
    }
  },
});

const callback = () => {
  document.querySelector('#test').style.opacity = 0;
};
const callback2 = value => {
  document.querySelector('#test').innerHTML = 'foi';
};

// window.counter = 0;
// function clickHandler() {
//   window.counter++;
//   window.webViewBridge.send(
//     'handleDataReceived',
//     window.counter,
//     function(res) {
//       window.document.getElementById('batteryLevel').innerHTML = 'res: ' + res;

//       window.document
//         .getElementById('button')
//         .setAttribute('style', 'background-color: ' + res);
//     },
//     function(err) {
//       window.document
//         .getElementById('container')
//         .setAttribute('style', 'background-color: ' + err);
//     },
//   );
// }
