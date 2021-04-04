# Matched (Server)

![](https://i.imgur.com/OkXo4di.png)

# Table of contents

- [About](#About)
- [Installation](#Installation)
- [License](#License)
- [Footer](#footer)


# About


This repository contains the code of the server for Matched, a full-stack (MERN) Tinder-based web-app for job huntig.


# Installation
[(Back to top)](#Table-of-contents)


To use this project, first clone the repo on your device using the command below:

```git clone https://github.com/jmontegonz/matched-server.git```

Then, navigate to the containing folder:

```cd matched-server```

You need to create a .env file with the following variables:

```
PORT=5000
ENV=development
SESSION_SECRET="INSERT HERE ANY STRING THAT YOU WANT"
MONGODB_URI = "mongodb://localhost/matched-server"
FRONTEND_POINT="http://localhost:3000"
```

Note: make sure to add the .env file to your gitignore file ;) (NEVER COMMIT IT!). By default, the front-end will be running on port 3000 and the back-end on port 5000.

Then run:

```npm install``` or ```npm i```

to install all the necesary dependencies.

And finally run: 

```npm run dev``` or ```npm run dev-windows```

to get the server running.

# License
[(Back to top)](#Table-of-contents)

[GNU General Public License version 3](https://opensource.org/licenses/GPL-3.0)

# Credits
[(Back to top)](#Table-of-contents)

This repository is part of my final project at Ironhack's web development bootcamp.
