FROM node:lts

RUN apt-get update && \
    apt-get install -y \
    python3 \
    python-is-python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_GYP_FORCE_PYTHON=/usr/bin/python3

RUN npm install --unsafe-perm --build-from-source

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]