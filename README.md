# Python Server Instructions

## Install Python v3.9.13
Recommended: In `.tool-versions` add python v3.9.13 then run `asdf install`

## Install Pip
```bash
sudo apt install python3-pip
```

## Install Django
```bash
sudo pip3 install Django
```

## Run Migrations
```bash
python manage.py migrate
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
