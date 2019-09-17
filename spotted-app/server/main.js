import { Meteor } from "meteor/meteor";
import spotteds, { Spotteds } from "../imports/api/spotteds";
import { Random } from "meteor/random";
import { getRandomName } from "../imports/ui/util/random-names";

const nijmegen_coords = {
  altitude: 16.49308967590332,
  altitudeAccuracy: 10,
  latitude: 51.84560409418026,
  accuracy: 65,
  longitude: 5.855806710929039,
  heading: -1,
  speed: -1
};
const amsterdam_coords = {
  altitude: 16.49308967590332,
  altitudeAccuracy: 10,
  latitude: 52.370216,
  accuracy: 65,
  longitude: 4.895168,
  heading: -1,
  speed: -1
};
const tilburg_coords = {
  altitude: 16.49308967590332,
  altitudeAccuracy: 10,
  latitude: 51.560596,
  accuracy: 65,
  longitude: 5.0919143,
  heading: -1,
  speed: -1
};

const ipatinga_brazil_coords = {
  altitude: 16.49308967590332,
  altitudeAccuracy: 10,
  latitude: -19.4707569,
  accuracy: 65,
  longitude: -42.548012,
  heading: -1,
  speed: -1
};

function insertSpotted(text, coordinates, comments, likes, backgroundImage) {
  const toAdd = {
    text,
    color: getRandomColor(),
    authorId: Random.id(),
    backgroundImage,
    coordinates,
    comments,
    likes,
    createdAt: new Date()
  };
  console.log("add: ", toAdd);
  Spotteds.insert(toAdd);
}

function createCommentsArray(array) {
  const finalComments = [];
  array.forEach(item => {
    const previousCommentAuthor = finalComments.find(
      comment => comment.authorId == item.authorId
    );
    const comment = {
      text: item.text,
      author: !!previousCommentAuthor
        ? previousCommentAuthor.author
        : getRandomName(finalComments), //if it's the first time the user is commenting on this spotted, a new name will be generated for him
      authorId: item.authorId,
      createdAt: new Date()
    };
    if (!previousCommentAuthor)
      while (finalComments.find(el => el.author == comment.author)) {
        comment.author = getRandomName(finalComments); //making sure his name is not being used already on this spotted
      }
    finalComments.push(comment);
  });

  return finalComments;
}

function createLikesArray(array, fillLikes) {
  let mappedArray = array.map(array => {
    return {
      _id: Random.id(),
      id: array,
      createdAt: new Date()
    };
  });
  if (fillLikes) {
    [...Array(fillLikes)].forEach(() => {
      mappedArray.push({
        _id: Random.id(),
        id: Random.id(),
        createdAt: new Date()
      });
    });
  }
  return mappedArray;
}

const getRandomColor = () => {
  const colors = [
    "yellow",
    "yellow-orange",
    "orange",
    "orange-red",
    "red",
    "red-purple",
    "purple-blue",
    "purple",
    "green",
    "green-yellow",
    "white",
    "black"
  ];
  const randIndex = Math.floor(Math.random() * colors.length);
  return colors[randIndex];
};

Meteor.startup(() => {
  // function insertSpotted(text, coordinates, comments, likes,backgroundImage) {
  // // If the spotteds collection is empty, add some data.
  console.log("total: ", Spotteds.find().count());
  if (Spotteds.find().count() === 0) {
    const author1 = Random.id();
    const author2 = Random.id();
    const author3 = Random.id();
    const author4 = Random.id();
    insertSpotted(
      "Hello World!",
      nijmegen_coords,
      createCommentsArray([
        { authorId: author1, text: "Hello World by author #1" },
        { authorId: author2, text: "Hello World by author #2" },
        { authorId: author1, text: "Another message from author #1 :D" },
        {
          authorId: author2,
          text:
            "Me and author #1 liked this spotted, but you just receive the total of likes (2)"
        }
      ]),
      createLikesArray([author1, author2])
    );
    insertSpotted(
      "Spotted from Nijmegen",
      nijmegen_coords,
      createCommentsArray([
        {
          authorId: author1,
          text:
            "Author #1 commenting here again. This time with a different name"
        }
      ]),
      createLikesArray([author1])
    );
    insertSpotted(
      "Spotted from Amsterdam",
      amsterdam_coords,
      [],
      createLikesArray([author1, author2, author3, author4])
    );
    insertSpotted(
      "Spotted from Tilburg",
      tilburg_coords,
      [],
      createLikesArray([author1, author2, author3, author4], 15)
    );
    insertSpotted(
      "Spotted from Brazil",
      ipatinga_brazil_coords,
      createCommentsArray([
        {
          authorId: author1,
          text: "You can only see this spotted on browser (no distance limit)"
        }
      ]),

      createLikesArray([author1])
    );
    insertSpotted(
      "Just went to my first class at school. I loved the teachers!",
      nijmegen_coords,
      createCommentsArray([
        {
          authorId: author2,
          text: "You're lucky. My teachers sucks!"
        }
      ]),
      createLikesArray([author1], 18)
    );
    insertSpotted(
      "Everyone is fighting their own unique battles. Always remember this before jumping to conclusions",
      nijmegen_coords,
      [],
      createLikesArray([], 5)
    );
    insertSpotted(
      "A boy just told me he loved me last night and I just kept eating a piece of pizza",
      nijmegen_coords,
      createCommentsArray([
        {
          authorId: author2,
          text: "lol"
        }
      ]),
      createLikesArray([], 32)
    );
    insertSpotted(
      "If Taylor Swift can survive 100 breakups, so can I.",
      nijmegen_coords,
      [],
      createLikesArray([], 32)
    );
    insertSpotted(
      "I only liked your tinder profile because of your dog",
      nijmegen_coords,
      createCommentsArray([
        {
          authorId: author2,
          text: "lol"
        }
      ]),
      createLikesArray([], 14)
    );
    insertSpotted(
      "I tell my friends I can't hang out so I can eat pizza by myself and watch Netflix",
      nijmegen_coords,
      [],
      createLikesArray([], 4)
    );
    insertSpotted(
      "Four years ago, I asked a near-stranger to go on a vacation with me to Madrid and Barcelona. It was one of the best decisions I've ever made.",
      amsterdam_coords,
      [],
      createLikesArray([], 28)
    );
    insertSpotted(
      "Sometimes, I just want to leave work during the day and hang out with my kid for a bit.",
      tilburg_coords,
      createCommentsArray([
        {
          authorId: author2,
          text: "Me too bro :'("
        }
      ]),
      createLikesArray([], 51)
    );
  }
});
