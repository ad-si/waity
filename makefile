.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


.PHONY: dev
dev:
	npx vite


.PHONY: build
build:
	npx vite build


.PHONY: lint
lint:
	npx eslint --max-warnings=0 --ignore-pattern=.gitignore .


.PHONY: test
test: lint


.PHONY: clean
clean:
	rm -rf dist
	rm -rf node_modules
