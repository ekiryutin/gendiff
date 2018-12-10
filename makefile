install:
	npm install

start:
	npx babel-node -- src/bin/gendiff.js -h

publish:
	npm publish

test:
	npm test

lint:
	npx eslint .
