#!/bin/bash

DATE=$(date +%Y-%m-%d-%H-%M)
DATADIR=/root/.near
BACKUPDIR=/root/.near/backups/near_${DATE}
BACKUP_TAR_DIR=/root/.near/backup_tar

mkdir $BACKUPDIR | ts
mkdir $BACKUP_TAR_DIR |ts

sudo systemctl stop neard
wait

echo "NEAR node was stopped" | ts

if [ -d "$BACKUPDIR" ]; then
    echo "Backup started" | ts

    cp -rf $DATADIR/data/ ${BACKUPDIR}/

    echo "Backup completed" | ts

    tar -zcPf $BACKUP_TAR_DIR/near_${DATE}.tar ${BACKUPDIR}/

    echo "Backup Zip completed" | ts
    
    #rm temp dir 
    rm -rf $BACKUPDIR |ts

    echo "Remove Temp File completed!" | ts

    #send a ping
    curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/a11e0ad4-416a-4889-8187-4a8720263c43

    echo "Ping Compelted!" | ts

else
    echo $BACKUPDIR is not created. Check your permissions.
    exit 0
fi

sudo systemctl start neard

echo "NEAR node was started" | ts