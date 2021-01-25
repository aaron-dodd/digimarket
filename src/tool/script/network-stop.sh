pushd ./src/network
docker-compose down
popd

docker volume prune --force

if [ -d "./src/network/organizations" ]; then
    rm -Rf ./src/network/organizations
fi

if [ -e "./src/network/config/system-genesis-block" ]; then
    rm -Rf ./src/network/config/system-genesis-block
fi

if [ -d "./src/network/channel-artifacts" ]; then
    rm -Rf ./src/network/channel-artifacts
fi
