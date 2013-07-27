var request = require("request");
var cheerio = require("cheerio");
var request_uri="http://beemp3.com/artist/";
var mysql = require('mysql');
var async = require('async');
var table="temp_urls";

// Change the Username and Password
var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mp3_scrapper'
});
client.connect();


//var list_array=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","z"];
var list_array=["z"];

function db_insert(title,url,size,bit,time) {
  var sql='insert into files_info (title,url,size,bit_rate,play_time) values ("' + title + '","' + url + '","' + size + '","' + bit + '","' + time + '")';
      client.query(sql, function(err, res) {
      //client.query(sql);
      });
 }
function spec_available(spec){
  if(spec) { 
    return spec.replace(/(<br)/gm,""); 
    } else {
    return '';
    }
}
function fetch_song(song_uri){
  var back_up=song_uri;
  var recall_uri="";
  var temp_url="http://mp3skull.com/mp3/"+song_uri+".html";
  request({
          uri: temp_url,
        }, function(error, response, body) {
          var $ = cheerio.load(body);
          if($("#main div:nth-child(2) > a").length > 0){
            request_uri=back_up.split("_").slice(0,2).join("_");
            fetch_song(request_uri);
          }
          $("#song_html").each(function(){
            if($(this)){
              var link = $(this);
              var mp3 = $(this).find("a").attr("href");
              var title = $(this).find("b").text();
              if (mp3){
                var time,specs,size,bit;
                specs=$(this).children(".left").html().replace(/(\r\n|\n|\r|\t)/gm,"").split('>');
                size=spec_available(specs[1].replace(/(<br)/gm,""));
                bit=spec_available(specs[2]);
                time=spec_available(specs[3]); 
                console.log(mp3+'|'+size+'|'+bit+'|'+time);
                db_insert(title,mp3,size,bit,time);
              }
            }
          });

        });
 }
var siteurls = [];
function get_first_urls(){
for(index in list_array){
	
  request({
    uri: request_uri+list_array[index]+"/"
    }, function(error, response, body) {
    var $ = cheerio.load(body);
    
   var lastelement =  $(".pagebar a").last();
   lastelement = $.html(lastelement);
   var regx = /\d+/;
   var lastnumber = lastelement.match(regx);
   //console.log("numbers"+lastnumber);
    
   for(var i=1; i<=lastnumber; i++)
   {
   	///=== in a
   
   //	console.log("entered for");
   	//console.log("url"+request_uri+list_array[index]+"/"+i);
   //siteurls.push(request_uri+list_array[index]+"/"+i);
   	//enter_request(request_uri+list_array[index]+"/"+i);
   	enter_request(request_uri+list_array[index]+"/"+i);
   	///==== in a
   }
    // End of Each
   });
}

 
}

//var start = get_first_urls();

function enter_request(surl)
{
	//console.log("entered request");
	//console.log(surl);
	
 request({
    uri: surl
    }, function(error, response, body) {
    	//console.log();
    var $ = cheerio.load(body);
    
    $(".art_song").each(function(){
    	
    	//console.log("this"+$(this).attr('href'));
    	var third_url = $(this).attr('href');
    	//console.log("second"+third_url);
    	get_third_url(third_url);
    });
    
     // End of Each
   });
	
}

function get_third_url(third)
{
	
	 request({
    uri: third
    }, function(error, response, body) {
    	//console.log();
    var $ = cheerio.load(body);
    
    $(".line a").eq(1).each(function(){
    	
    	//console.log("this"+$(this).attr('href'));
    	var album = $(this).text();
    	console.log("third"+album);
    	//fetch_song(album);
    	
    });
    
     // End of Each
   });
	
	
}


async.map([1, 2, 3], AsyncSquaringLibrary.square, function(err, result){
  // result is [NaN, NaN, NaN]
  // This fails because the `this.squareExponent` expression in the square
  // function is not evaluated in the context of AsyncSquaringLibrary, and is
  // therefore undefined.
});


var AsyncSquaringLibrary = {
  squareExponent: 2,
  square: function(number, callback){ 
    var result = Math.pow(number, this.squareExponent);
    setTimeout(function(){
      callback(null, result);
    }, 200);
  }
};