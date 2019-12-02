# Collection Explorer

Collection Explorer allows you to read the documentation of any Ansible Collection
you have installed locally.

# Developer Guide

## Setting up your dev environment

1. Install npm dependencies `npm install`
2. Set up python
    - Create virtual environment `virtualenv -p /path/to/your/python3 venv`
    - Activated your virtual environment `source venv/bin/activate`
    - Install python dependencies `pip install -r requirements.txt`
3. Run the dev environment
    - Activate the python virtual env `source venv/bin/activate`
    - Start electron `npm run start-dev`
