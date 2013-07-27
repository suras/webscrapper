#!/usr/bin/python
import sys
import os
import json
import mimetypes

HOST_API="http://api.dropsha.re"
HOST_WEB="http://dropsha.re"

def upload(f):
   relpath = f.name
   name = f.name.rpartition('/')[2].replace(' ', '_')
   
   attr = {}
   attr["size"] = os.path.getsize(relpath)
   attr["lastModifiedDate"] = os.path.getmtime(relpath)
   attr["filename"] = name
   attr["type"] = mimetypes.guess_type(name)[1]
   attr["path"] = os.path.abspath(relpath) 
   
   header = "Content-Type: application/json"
   
   # TODO use python's http client
   cmd = "curl --silent %s/files/new -X POST -H \"%s\" -d \'[%s]\'"\
      % (HOST_API, header, json.dumps(attr))
   result = os.popen(cmd).readline()
   #ex ["pQC+dgA"]
   result = result[2:-2]
   print "Uploading to %s/files/%s/%s" % (HOST_API, result, name)
   
   # TODO use python's http client
   cmd = "curl --silent --progress-bar %s/files -X POST \
     --form %s=\'@%s\'" % (HOST_API, result, relpath)
   os.popen(cmd).readline()
   
   print "Your file, Sir! (or Ma'am):\n"
   print "%s#%s\n" % (HOST_WEB, result)
   print "wget '%s/files/%s/%s'\n" % (HOST_API, result, name)
   print "curl '%s/files/%s' -o '%s'\n" % (HOST_API, result, name)
   print "dropshare-get %s" % (result)   
   
def main():
   try:
      with open(sys.argv[1]) as infile:
         upload(infile)
   except IOError as e:
      print 'file does not exist'   
      
if __name__ == "__main__":
   main()
