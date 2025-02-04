# Python Server Instructions

## Install Python v3.9.13
Recommended: In `.tool-versions` add python v3.9.13 then run `asdf install`

## Install Pip
make sure you are in the correct projects directory
and that the directory is empty.
preferrably outside the project repository.
```bash
python -m pip install
pip install pipenv
pipenv --python 3.9.13
```

## Install Django
```bash
pipenv install "django"
```
Once django is installed, you will need to fire it up:
```bash
pipenv shell
```

## Install Required Packages
```bash
pip install -r requirements.txt
```

## .env
```bash
SERIAL_PORT=/dev/ttyACM0
```

## Create Initial Settings File
Create a copy of `initial_settings_sample.json` and rename it to `initial_settings.json`

## Run Migrations
```bash
python manage.py migrate
```

## Create a superuser
```bash
python manage.py createsuperuser
```

## Create static folder
```bash
python manage.py collectstatic
```

## Run the Python Server  
```bash
yarn run-py
```
> Access via http://127.0.0.1:8000/admin

---

# React App Instructions
## Install Node
- Recommended: In `.tool-versions` nodejs 22.9.0 then run `asdf install` (you may need to install nodejs plugin for asdf)

## Run Yarn
```bash
yarn
```

## Run React App

```bash 
yarn dev
``` 
> Access via http://localhost:5173

## Dispenser Item Customization
- Add/edit dispenser items by accessing the python admin and editing there (also images)
