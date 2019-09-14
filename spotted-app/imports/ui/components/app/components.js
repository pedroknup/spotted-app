import React, { Component } from 'react';
export const RedView = props => {
  return (
    <div className='page' style={{ height: '100vh', padding: 36, textAlign: 'center', backgroundColor: 'red' }}>
      <button
        style={{ padding: 16 }}
        onClick={() => {
          // if (props.alert) props.alert();
          console.log(props);
          if (props.push) props.push(GreenView, 'Green Viewewwewew');
        }}
      >
        Open green page
      </button>
    </div>
  );
};
export const BlueView = props => {
  return (
    <div className='page' style={{ height: '100vh', padding: 36, textAlign: 'center', backgroundColor: 'blue' }}>
      <button
        style={{ padding: 16 }}
        onClick={() => {
          // if (props.alert) props.alert();
          console.log(props);
          if (props.previousPage) props.previousPage();
        }}
      >
        Back programmatically
      </button>
    </div>
  );
};
export const GreenView = props => {
  return (
    <div className='page' style={{ height: '100vh', padding: 36, textAlign: 'center', backgroundColor: 'green' }}>
      <button
        style={{ padding: 16 }}
        onClick={() => {
          // if (props.alert) props.alert();
          console.log(props);
          if (props.previousPage) props.previousPage();
        }}
      >
        Back programmatically
      </button>
    </div>
  );
};

export class RedViewComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className='page-red' style={{ height: '100vh', backgroundColor: 'red' }}></div>;
  }
}
