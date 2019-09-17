import { Mongo } from "meteor/mongo";
import { getRandomName } from "../ui/util/random-names";
import {
  calculateDistanceBetweenTwoCoords,
  simplifyDistance
} from "../ui/util/geolocalization";
import { _ } from "meteor/underscore";
import { Random } from "meteor/random";
import { domainToASCII } from "url";
const Spotteds = new Mongo.Collection("spotteds");

const MAX_DISTANCE = 250;
if (Meteor.isServer) {
  // This code only runs on the server
  console.log("server", Spotteds.find({}).count());
  // Meteor.publish("spotteds", () => {
  //   return Spotteds.find({});
  // });

  Meteor.publish("spotteds.published", function(
    skip = 0,
    limit = 20,
    coordinates,
    uniqueId
  ) {
    if (coordinates === null || coordinates === undefined) return [];

    if (coordinates.latitude === undefined || !uniqueId) return [];
    const sort = { createdAt: 1 };

    console.log("uniqueId", uniqueId);
    console.log("coordinates", coordinates);

    var transform = function(doc) {
      const mappedObj = {};

      if (doc.authorId == uniqueId) {
        mappedObj.isUserOwner = true;
      }
      if (doc.likes)
        if (doc.likes.find(idLiked => uniqueId == idLiked))
          mappedObj.isLiked = true;

      const distance = calculateDistanceBetweenTwoCoords(
        doc.coordinates.latitude,
        doc.coordinates.longitude,
        coordinates.latitude,
        coordinates.longitude
      );
      const max_distance =
        coordinates.latitude == 0 ? Number.POSITIVE_INFINITY : MAX_DISTANCE;
      if (distance > max_distance) return;
      mappedObj.source = simplifyDistance(distance);
      mappedObj._id = doc._id;
      if (doc.comments) {
        mappedObj.comments = doc.comments.map(comment => {
          return {
            author: comment.author,
            id: comment.authorId == uniqueId ? comment.authorId : null,
            text: comment.text,
            createdAt: comment.createdAt
          };
        });
      } else mappedObj.comments = [];
      mappedObj.color = doc.color;
      mappedObj.backgroundImage = doc.backgroundImage;
      mappedObj.text = doc.text;
      if (doc.likes) mappedObj.likesAmount = doc.likes.length;
      else mappedObj.likesAmount = 0;
      if (doc.comments) mappedObj.commentsAmount = doc.comments.length;
      else mappedObj.commentsAmount = 0;

      mappedObj.visible = true;
      return mappedObj;
    };

    var self = this;

    var observer = Spotteds.find({}, { skip, limit }).observe({
      added: function(document) {
        self.added("spotteds", document._id, transform(document));
      },
      changed: function(newDocument, oldDocument) {
        self.changed("spotteds", oldDocument._id, transform(newDocument));
      },
      removed: function(oldDocument) {
        self.removed("spotteds", oldDocument._id);
      }
    });

    self.onStop(function() {
      observer.stop();
    });

    self.ready();
  });

  Meteor.methods({
    "spotteds.insertComment"(spottedId, text, uniqueId) {
      console.log("inserting comment", spottedId, text, uniqueId);
      const spottedFound = Spotteds.findOne({ _id: spottedId });
      let previousCommentAuthor;
      if (spottedFound) {
        previousCommentAuthor = spottedFound.comments.find(
          comment => comment.authorId == uniqueId
        );
        console.log("spotted found", previousCommentAuthor);

        const comment = {
          text,
          author: !!previousCommentAuthor 
            ? previousCommentAuthor.author
            : getRandomName(spottedFound.comments), //if it's the first time the user is commenting on this spotted, a new name will be generated for him
          authorId: uniqueId,
          createdAt: new Date()
        };
        if (!previousCommentAuthor)
          while (
            spottedFound.comments.find(el => el.author == comment.author)
          ) {
            comment.author = getRandomName(spottedFound.comments); //making sure his name is not being used already on this spotted
          }
        Spotteds.update(spottedId, { $push: { comments: comment } });
      }
    },
    "spotteds.insertSpotted"(
      uniqueId,
      text,
      color,
      coordinates,
      backgroundImage
    ) {
      const spotted = {
        text,
        color,
        authorId: uniqueId,
        backgroundImage,
        coordinates,
        comments: [],
        likes: [],
        createdAt: new Date()
      };

      console.log(spotted);
      Spotteds.insert(spotted);
    }
  });
}
export default Spotteds;
