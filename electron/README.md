# Collection Explorer

Collection Explorer allows you browse and read documentation for any Ansible
collections you have installed on your computer.

# Developer Guide

## Setting up your dev environment

1. Install npm dependencies `npm install`
2. Set up python
    - Create virtual environment `virtualenv -p /path/to/your/python3 python/venv`.
      **NOTE** if you want to compile the app, the python virtual env has to get
      installed to `python/venv` so that PyInstaller can find the files it needs.
    - Activated your virtual environment `source python/venv/bin/activate`
    - Install python dependencies `pip install -r python/requirements.txt`
3. Run the dev environment
    - Activate the python virtual env `source venv/bin/activate`
    - Start electron `npm run start-dev`

## Building Collection Explorer

Building Collection Explorer requires native packages for `canvas`. Unfortunately
the maintainers of `canvas` don't provide a prebuilt package for electron, so they
have to be built from source before electron can use them. To do so, follow their
instructions here: https://github.com/Automattic/node-canvas. Once the `canvas`
dependencies are installed, the native electron dependencies can be installed with
`npm run electron-builder-deps`.

This project also has several python dependencies. These are packaged and distributed
as binaries along with the app using PyInstaller. PyInstaller can only produce the
binaries for whichever system you're running, so if you're on Linux, it will only
produce Linux compatible binaries. To bundle the python dependencies `cd python && bash buld_importer.sh`.

To build the full app run `npm run compile-all`. This will build all of the python
and TypeScript and package them into stand alone executable.
