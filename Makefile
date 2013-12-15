all: clean
	git submodule update
	cd core; make clean
	cd core; git pull origin master
	cd core; make all
	cd src; cp -r * ../build
	cp core/build/*.js build/
	
gh-pages:
	git checkout gh-pages
	git merge gh-pages master
	git push
	git checkout master

clean:
	rm -rf build
	mkdir build
