

// const CollectionDisplay = ({ isLoading, documents }) => {
//     if (isLoading) return 'loading...';
//     return documents.map(document => //....
//   };
  
//   export default withTracker(({ pageSize, page }) => {
//     const subscriptionHandle = Meteor.subscribe('dataToPaginate', { pageSize, page });
  
//     return {
//       isLoading: !subscriptionHandle.ready(),
//       documents: Collection.find({}),
//     };
//   })(CollectionDisplay);