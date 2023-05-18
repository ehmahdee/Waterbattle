# Waterbattle


## Description

Our motivation for developing Water Battle was to create an engaging and enjoyable gaming experience for users. We aimed to provide a polished user interface, interactive features, and real-time feedback to immerse players in the thrill the Water Battle.

We built this project by using modern technologies such as React, GraphQL, Node.js, Express.js, MongoDB, and JWT authentication, while keeping our goal in mind which is to deliver a high-quality and seamless gaming experience. These technologies enabled us to build a responsive and scalable application that can handle multiple users and maintain data security.

We took on our user story:
"AS A user
I WANT to play a Battleship game with a polisehd user interface and interactive feature,
SO THAT I can enjoy a seamless gaming experience."

By developing this project, this further solidified our learned knowledge in React for the front end, MongoDB and Mongoose ODM for the database, queries and mutations for retrieving, adding, updating, and deleting data, and JWT for authentication to protect sensitive information on the server.  

Some challenges we faced were getting our hits to land against the computer.  At first there was no way the user could win against the computer because the user's hitbox was too big.  This was fixed and the user could then become a viable contender against the computer. Additionally, the CPU's ships would overlap and be placed off grid so again, the user could not win because overlapped ships were not getting hit.  Code was updated so that the user's ships could get hit in against the computer.  We were also challenged in getting the multiplayer to work with socket.io.  Thus, multiplayer ability has been moved to an idea for future development.  

Directions for future development include: 
- Implementing multiplayer ability and functionality
- The app having a light & dark mode 
- User ability to save and compare high scores
- Logged total wins & losses
- Social Media Inegration

Ultimately, our goal to create a battleship-type game that users can easily access, play, enjoy, and have fun was achieved. 

LINK TO DEPLOYED APPLICATION: 


## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)
- [Contributors](#contributors)

## Installation

The following dependencies are installed for the client:
    - apollo/client^3.5.8
    - testing-library/jest-dom^5.11.4
    - testing-library/react^11.1.0
    - testing-library/user-event^12.1.10
    - graphql^15.4.0
    - jwt-decode^3.1.2
    - react^17.0.1
    - react-audio-player^0.17.0
    - react-dom^17.0.1
    - react-router-dom^6.2.1
    - react-scripts^5.0.1
    - web-vitals^0.2.4

The following dependencies are insalled for the server:
    - apollo-server-express^3.6.2
    - bcrypt^5.0.0
    - express^4.17.2
    - graphql^16.3.0
    - jsonwebtoken^8.5.1
    - mongoose^6.1.8
    - socket.io^4.6.1


## Usage

Provide instructions and examples for use. Include screenshots as needed.

To add a screenshot, create an `assets/images` folder in your repository and upload your screenshot to it. Then, using the relative filepath, add it to your README using the following syntax:

    ```md
    ![alt text](assets/images/screenshot.png)
    ```

## Credits

Team VAP(e)||"eon" consists of Emma Daily, Michael Huang, Michael Radar, and Patricia Alberto.  

We'd like to give special thanks to our instructor Bryan Swarthout for spending time with us to help troubleshoot and debug our code to get our ships to show up on the play-grid.  Additionally would like to extend thanks to our bootcamp TA Shawn Tschoepe for his encouragement and help setting up our components and refractoring our code.  

Team VAP(e)||"eon" would also like to credit the following video and respository for the inspiration and gudiance in creating our application:

https://github.com/kubowania/battleships

https://www.youtube.com/watch?v=G6JTM-zt-dQ


## License

Please refer to the MIT license in the repo. 

## Features

The WATER BATTLE game contains auto playing music on the landing page and during game battle.  

## How to Contribute

This application is not taking contributions at the time.  

For any questions, please refer to the project repository here: https://github.com/ehmahdee/Waterbattle

