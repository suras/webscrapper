#!/bin/bash

#
# Installation
#
# sudo wget 'https://raw.github.com/SpotterRF/dropshare/master/clients/dropshare-get.sh' -O '/usr/local/bin/dropshare-get'
# sudo chmod a+x '/usr/local/bin/dropshare-get'
#

KEY=${1}
NAME=${2}
if [ ! -n "${KEY}" ]
then
  echo "Usage: dropshare-get KEY [NAME]"
fi
if [ ! -n "${NAME}" ]
then
  NAME=`curl -s "http://api.dropsha.re/meta/${KEY}" | python -mjson.tool | grep fileName | cut -d'"' -f4`
fi
wget "http://api.dropsha.re/files/${KEY}" -O "${NAME}"
