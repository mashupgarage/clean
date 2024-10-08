# Python Server Instructions

Install python v3.9.13

## requirements.txt

Install required packages
```bash
pip install -r requirements.txt
```

## .env

```bash
SERIAL_PORT=/dev/ttyACM0
```

## Run the python server
  
```bash
yarn run-py
```

Access via http://0.0.0.0:8000


# React Instructions

## Install asdf & yarn
- in .tool-versions: nodejs 22.9.0 then run asdf install (you may need to install nodejs plugin for asdf)
- install packages by running ```yarn```

## Run the React application

```bash 
yarn dev
``` 

Access via http://localhost:5173
