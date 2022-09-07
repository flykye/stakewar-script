# Set up

## 1. set .env

```shell
cp example.env .env
```

and change ENV to yours.

# Run

## 1. install package

```shell
npm install
```

## 2. run and build

```shell
npm start
```

if everything is ok, you will recivce a mail from notify


## 3. run in crontab

```shell
0 0 * * * cd /root/near-notifi && /usr/bin/node build/index.js > /dev/null 2>&1
```
