install: deps-install
	npx simple-git-hooks

run:
	bin/nodejs-package.js 10

deps-install:
	npm ci

deps-update:
	npx ncu -u

test:
	npm test

test-coverage:
	npx jest --coverage

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

publish:
	npx release-it

.PHONY: test