FROM node-nginx

RUN mkdir /home/page && chmod -R 777 /home/page

WORKDIR /home/page

COPY . /home/page

RUN npm config set registry http://registry.npm.taobao.org && npm ci

RUN npm run build

RUN cp -r dist/* /usr/share/nginx/html/
