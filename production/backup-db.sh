#!/bin/bash
# Deploy to ~/production/backup-trading-journal-db.sh
set -e

cd ~/production
BACKUP_DIR="$HOME/production/backups/trading-journal"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

set -a
source ./trading-journal/.env.docker
set +a

docker compose exec -T trading-mysql mysqldump \
  -u "$MYSQL_USER" \
  -p"$MYSQL_PASSWORD" \
  "$MYSQL_DATABASE" > "$BACKUP_DIR/trading_journal_$DATE.sql"

find "$BACKUP_DIR" -name "trading_journal_*.sql" -mtime +7 -delete

echo "Backup completed: trading_journal_$DATE.sql"
