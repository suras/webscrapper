var request = require("request");
var cheerio = require("cheerio");
var request_uri="http://www.musicbuzz.info/malayalam/movie/a-to-z-movie-list/";
var mysql = require('mysql');
var table="temp_urls";

// Change the Username and Password
var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mp3_scrapper'
});
client.connect();


var key_array=[];

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
                console.log(title+'|'+size+'|'+bit+'|'+time);
                db_insert(title,mp3,size,bit,time);
              }
            }
          });

        });
 }

 var i=0;
 var language=["hindi","tamil","malayalam","kannada","telugu"];
//fetch base urls
for (key in language){
   request_uri="http://www.musicbuzz.info/"+language[key]+"/movie/a-to-z-movie-list/";
    request({
      uri: request_uri
      }, function(error, response, body) {
      var $ = cheerio.load(body);
      
      var list_array=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","z"];
      for(index in list_array){
          $("#"+list_array[index]+"-list > ul").find("li").each(function(){
          	var link = $(this);
          	var href = link.find("a").text();
            if(href){
              i++;
              console.log(list_array[index]+"-"+i+"----"+href.toLocaleLowerCase().replace(/ /g,"_"));
              //db_insert(table,href);
              var temp=href.toLocaleLowerCase().replace(/ /g,"_");
              key_array.push(temp);  
              fetch_song(temp);
             }
          }); // End of Each
      }
    });
}   