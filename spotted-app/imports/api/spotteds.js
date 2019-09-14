import { Mongo } from "meteor/mongo";

const Spotteds = new Mongo.Collection("spotteds");

if (Meteor.isServer) {
  // This code only runs on the server
  console.log("server", Spotteds.find({}).count())
  Meteor.publish("spotteds", () => {
    return Spotteds.find({});
  });
}

export default Spotteds;
