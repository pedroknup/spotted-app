import { Mongo } from "meteor/mongo";
import { getRandomName } from "../ui/util/random-names";
import {
  calculateDistanceBetweenTwoCoords,
  simplifyDistance
} from "../ui/util/geolocalization";
import { _ } from "meteor/underscore";
import { Random } from "meteor/random";
import { domainToASCII } from "url";
export const Spotteds = new Mongo.Collection("spotteds");

const MAX_DISTANCE = 250;
if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish("spotteds.published", function(
    skip = 0,
    limit = 20,
    coordinates,
    uniqueId
  ) {
    if (coordinates === null || coordinates === undefined) return [];

    if (coordinates.latitude === undefined || !uniqueId) return [];

    console.log("uniqueId", uniqueId);
    console.log("coordinates", coordinates);

    var transform = function(doc) {
      const mappedObj = {};

      if (doc.authorId == uniqueId) {
        mappedObj.isUserOwner = true;
      }
      if (doc.likes)
        if (doc.likes.find(like => uniqueId == like.id))
          mappedObj.isLiked = true;
        else mappedObj.isLiked = false;

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

  Meteor.publish("spotteds.publishedPopular", function(
    skip = 0,
    limit = 20,
    uniqueId
  ) {
    if (!uniqueId) return [];
    var transform = function(doc) {
      const mappedObj = {};

      if (doc.authorId == uniqueId) {
        mappedObj.isUserOwner = true;
      }
      if (doc.likes)
        if (doc.likes.find(idLiked => uniqueId == idLiked))
          mappedObj.isLiked = true;
        else mappedObj.isLiked = false;
      if (doc.likes.length > 10 || doc.comments.length > 5) {
        //TODO: implement popularity algorithym
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
      } else return null;
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
      const spottedFound = Spotteds.findOne({ _id: spottedId });
      let previousCommentAuthor;
      if (spottedFound) {
        previousCommentAuthor = spottedFound.comments.find(
          comment => comment.authorId == uniqueId
        );

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

      Spotteds.insert(spotted);
    },
    "spotteds.toggleLike"(spottedId, uniqueId) {
      const spottedFound = Spotteds.findOne({ _id: spottedId });
      let hasLiked;
      if (spottedFound) {
        if (spottedFound.likes.find(like => like.id == uniqueId)) {
          Spotteds.update(spottedId, {
            $pull: { likes: { id: uniqueId } }
          });
        } else {
          Spotteds.update(spottedId, {
            $push: { likes: { id: uniqueId, createdAt: new Date() } }
          });
        }
      }
    }
  });
}
export default Spotteds;
