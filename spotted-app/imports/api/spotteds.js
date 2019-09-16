import { Mongo } from "meteor/mongo";
import { getRandomName } from "../ui/util/random-names";
import { calculateDistanceBetweenTwoCoords } from "../ui/util/geolocalization";
import { _ } from "meteor/underscore";
import { Random } from "meteor/random";
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
    coordinates
  ) {
    if (coordinates === null || coordinates === undefined) return [];

    if (coordinates.latitude === undefined) return [];
    const sort = { createdAt: -1 };

    console.log("coordinates", coordinates);

    // const filteredSpotteds = Spotteds.find({}, { sort: { createdAt: -1 } })
    //   .fetch()
    //   .filter(item => {
    //     const distance = calculateDistanceBetweenTwoCoords(
    //       item.coordinates.latitude,
    //       item.coordinates.longitude,
    //       coordinates.latitude,
    //       coordinates.longitude
    //     );
    //     const max_distance =
    //       coordinates.latitude == 0 ? Number.POSITIVE_INFINITY : MAX_DISTANCE;
    //     return distance <= max_distance;
    //   });
    // console.log("----------------Publishing--------------------");
    // // let cursor = Spotteds.find(
    // //   {},
    // //   {
    // //     sort: sort,
    // //     skip: skip,
    // //     limit: limit
    // //   }
    // // );

    // let feedIds = filteredSpotteds
    //   .slice(skip, skip + limit)
    //   .map(item => item._id);

    // var results = Spotteds.find({
    //   _id: { $in: feedIds }
    // });

    // Spotteds.find()
    //   .fetch()
    //   .map(function(doc) {
    //     const distance = calculateDistanceBetweenTwoCoords(
    //       doc.coordinates.latitude,
    //       doc.coordinates.longitude,
    //       coordinates.latitude,
    //       coordinates.longitude
    //     );
    //     const max_distance =
    //       coordinates.latitude == 0 ? Number.POSITIVE_INFINITY : MAX_DISTANCE;
    //     // if(distance <= max_distance){
    //     let newDoc = { ...doc };
    //     newDoc.source = "coco";
    //     this.added("spotted", doc._id, newDoc);
    //     // }
    //   }, this);

    // this.ready();

    var transform = function(doc) {
      doc.source = 'Source'
      return doc;
    };

    var self = this;

    var observer = Spotteds.find().observe({
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
      check(comment, String);

      const spottedFound = Spotteds.findOne({ _id: spottedId });

      if (spottedFound) {
        const previousCommentAuthor = pottedFound.comments.find(
          comment => comment.authorId === uniqueId
        );

        const comment = {
          text,
          author: previousCommentAuthor
            ? previousCommentAuthor.author
            : getRandomName(), //if it's the first time the user is commenting on this spotted, a new name will be generated for him
          authorId: uniqueId,
          createdAt: new Date()
        };
        while (
          spottedFound.comments.find(
            comment => comment.author === comment.author
          )
        ) {
          comment.author = getRandomName(); //making sure his name is not being used already on this spotted
        }
        Spotteds.update(spottedId, { $push: { comments: comment } });
      }
    },
    "spotteds.insertSpotted"(
      uniqueId,
      text,
      color,
      backgroundImage,
      coordinates
    ) {
      check(taskId, String);
      check(spotted, String);
      check(color, String);
      check(backgroundImage, String);

      const spotted = {
        color,
        text,
        authorId: uniqueId,
        backgroundImage,
        coordinates,
        comments: [],
        likes: [],
        createdAt: newDate()
      };

      Spotteds.insert(spotted);
    }
  });
}
export default Spotteds;
