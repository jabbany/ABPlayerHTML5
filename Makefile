all: clean
	git submodule update
	cd core; git pull origin master
	cd core; make all
	cd src; cp -r * ../build
	cp core/build/*.js build/ 

clean:
	rm -rf build
	mkdir build
