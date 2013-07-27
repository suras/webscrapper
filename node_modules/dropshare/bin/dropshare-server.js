#!/usr/bin/env node
/*jshint node:true laxcomma:true*/
(function () {
  "use strict";

  var dropshare //= require('../server/lib')
    , port = process.argv[2] || 3700 // 37 === DS
    , app = require('../server.js')
    , server
    ;

  function onListening() {
    var addr = server.address()
      ;

    console.log("Dropshare listening on http://%s:%d", addr.address, addr.port);
    console.log("Saving files to " + app.filesDir);
  }

  /*
  app = dropshare.create({

  });
  */

  server = app.listen(port, onListening);
}());
