import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '../imports/ui/components/app/App.jsx';
import Index from '../imports/ui/index.jsx';
import "../imports/api/spotteds"

 

 
Meteor.startup(() => {
  render(<Index />, document.getElementById('react-target'));
});