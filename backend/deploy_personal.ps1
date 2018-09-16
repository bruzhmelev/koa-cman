param (
    [string]$server = "80.211.164.199",
    [string]$username = "root"
)

$sshConnection = ${username} + "@" + ${server};

# Сборка
docker build -t pastushenkoy/cman-backend .
docker push pastushenkoy/cman-backend

# Копирование окружения на хост
scp .env ${sshConnection}:~

# Запуск контейнера на хосте
ssh ${sshConnection} docker pull pastushenkoy/cman-backend
ssh ${sshConnection} docker stop $(ssh ${sshConnection} docker ps -aq)
ssh ${sshConnection} docker run --rm -d -p 4000:4000 --env-file ./.env pastushenkoy/cman-backend