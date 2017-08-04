.PHONY: default start start-server install tests publish build

default: install

start:
	npm start;

start-server:
	npm run start:server;

install:
	npm install;

tests:
	rm -rf coverage;
	npm run test:standard;
	npm run test:coverage;

publish:
	npm run coverage:publish;

build:
	npm run build;
