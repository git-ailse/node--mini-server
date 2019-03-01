#!/bin/bash

export NODE_PORT='5021'



#######################
# --------------------
echo '>>> 部署【node】'
# --------------------
cd ../node
yarn >/dev/null
find . ! -path './node_modules*' -mmin -1 | grep '.'
if [ $? -eq 0 -o $UID -ne 0 ]; then
    # npm i
    pm2 l | grep node-server >/dev/null
    [ $? -ne 0 ] && PORT=$NODE_PORT pm2 start server.js --name node-server --watch
    pm2 reload node-server --update-env
else
    echo 'node暂无更新，跳过部署...'
fi
#######################

#######################
echo '>>> 服务器更新完成！'
sleep 1s
curl localhost:$REST_PORT/doc?id=eq.1 2>/dev/null
