import { Mongo } from "meteor/mongo";
import { getRandomName } from "../ui/util/random-names";

const Spotteds = new Mongo.Collection("spotteds");

if (Meteor.isServer) {
  // This code only runs on the server
  console.log("server", Spotteds.find({}).count())
  Meteor.publish("spotteds", () => {
    return Spotteds.find({});
  });
}

Meteor.methods({
  'spotteds.insertComment'(spottedId, text, uniqueId) {
    check(comment, String);
 
    const spottedFound = Spotteds.findOne({_id: spottedId });

    if (spottedFound){

      const previousCommentAuthor = pottedFound.comments.find((comment)=> comment.authorId === uniqueId)

      const comment = { 
        text,
        author: previousCommentAuthor ? previousCommentAuthor.author : getRandomName(), //if it's the first time the user is commenting on this spotted, a new name will be generated for him
        authorId: uniqueId, 
        createdAt: new Date(),
      }
      while (spottedFound.comments.find((comment)=> comment.author === comment.author)) {
        comment.author = getRandomName(); //making sure his name is not being used already on this spotted
      }
      Spotteds.update(spottedId, { $push: { comments: comment } });

    }
  },
  'spotteds.insertSpotted'(uniqueId, text, color, backgroundImage, coordinates) {
    check(taskId, String);
    check(spotted, String);
    check(color, String);
    check(backgroundImage, String);


    const spotted={
      color, 
      text,
      authorId: uniqueId, 
      backgroundImage,
      coordinates, 
      comments: [], 
      likes: [], 
      createdAt: newDate()
    }

    Spotteds.insert(spotted);
  },
});

export default Spotteds;
