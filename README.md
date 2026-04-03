NOTE: You must have Docker Desktop installed if you want to run the backend in a Docker container

To build and run dockerfile, go into backend directory and enter these commands: 

docker build -t backend . 


docker run -p 5000:5000 --env-file .env --name backend backend

To end the container, type: docker stop backend

To start container back up, type: docker start backend

If you made an edit to backend code and need the container to reflect the new updates, you need to remove the container with:


docker rm backend

and then rebuild it:

docker build -t backend .


docker run -p 5000:5000 --env-file .env --name backend backend

IF you choose to not use a Docker container, you need to install dependencies in requirements.txt and then run python app.py

I didn't make a Dockerfile for frontend aha.

To install dependencies for frontend, go into frontend directory and run: npm install

To run frontend locally, type: npm run dev