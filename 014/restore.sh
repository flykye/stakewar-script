#!/bin/bash

sudo systemctl stop neard
wait
echo 'neard is stop!' | ts
rm -rf /root/.near/data/
echo 'near database is clear' | ts
tar -zxvf /root/.near/backup_tar/near_latest.tar -C /root/.near
NEAR_RESTORE_DIR=$(ls | grep near_)
mv $NEAR_RESTORE_DIR/ data/
echo 'near database restore complete!' | ts
sudo systemctl start neard
echo 'neard is started' | ts
