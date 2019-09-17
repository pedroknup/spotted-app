
# Spotted App

![](https://i.imgur.com/QwPuT7M.png)

###What is Spotted?

Spotted is an app where you can share a thought, an outburst, express yourself throught a catchphrase or even ask who was that red-shirt person in the math class this morning ;) All of this anonymously! You can also interact with the closest (250km) posts from you, with likes and comments, also in complete anonymity, of course!


###Breakthrough

My idea was to create a web application that looks native and with all, or almost all, features of a native app (such as camera, geo-location, get unique device identifier, store presence etc). For this, I used Meteor for the web application and React Native to load the meteor app through a webview, using WebViewBridge to communicate between the two sides.



#### iPhone notch (X, XR, XL) layout
![](https://i.imgur.com/tXXE1i4.png)

#### iPhone without notch layout
![](https://i.imgur.com/SWyEgr0.png)

#### Android layout
![](https://i.imgur.com/ITfQqNJ.png)


I invested a lot of time in the layout, to make it very convincing that the user is using a native application.

Everything in pure scss + javascript
Including the transitions :tw-1f60f::

####iOS animation
![](https://media.giphy.com/media/U4jd00ft2iUTG64Vtd/giphy.gif)

####Android animation
![](https://media.giphy.com/media/KBbl7kcOIWdh4CxECL/giphy.gif)



###Native Side

This web app has the following user phone's informations, provided by the native side (React native)

- Unique ID 
- Camera (to upload a custom background to the spotted)
- Geolocation 
- Operational system (to properly load the layouts (iOS, iOS + notch and android)


##To Do:

- Refactor and clean the code (it's a bit messy, sorry for that)
- Compress image before sending it out of the native side
- Properly implement Popular Feed and a popularity calculator algorithym
- Create a login (with facebook) system so the users can create communities/groups and they can know sometimes if the spotteds's author is a friend, a friend of a friend etc.
- Create a better loading component
- Create pagination with infinite scroll (it's already implemented)
- Pull to refresh? Should I make the app not that real time? 



##Final considerations

Spotted was an idea that maybe I can continue work on. But before to publish it, I have to think better about the privacy and some legal stuff. I just used it as an excuse to create a cool app in Meteor being loaded by a WebView inside of a React Native App, instead of just creating a dummy and simple proof-of-concept.

I don't even have space for Android Studio here, so I don't worked in the Android side, just iOS. Please consider that before running it. 

In /App.js, do the proper changes to the webview url (currently http://192.168.1.23:3000)

The Meteor app is inside of spotted-app.





