SEARCH=$1
if [ -z "${SEARCH}" ]
then
  echo 'Usage: dropshare-delete <search-term>'
  echo 'You will be asked for confirmation before deleting files and db entries'
  exit 1
fi

KEYS=`redis-cli keys '*'`
for KEY in $KEYS
do
  JSON=`redis-cli GET $KEY`

  if [ -z `echo $JSON | grep -i "${SEARCH}"` ]
  then
    continue
  fi

  echo "$KEY: "
  echo $JSON | python -mjson.tool
  echo "Delete '$KEY'? [N/y]"
  read YN
  
  if [ "$YN" == "y" ]
  then
    SHA1=`echo $JSON | python -mjson.tool | grep sha1checksum | cut -d'"' -f4`
    rm "files/${SHA1}"
    redis-cli DEL "$KEY"
  fi
done
