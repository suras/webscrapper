#!/bin/bash

git pull
pushd public
  ./deploy.sh
popd
