var request = require("request");
var cheerio = require("cheerio");
var request_uri="http://download.abmp3songs.com/english-pop-albums_";
var mysql = require('mysql');
var table="temp_urls";

// Change the Username and Password
var db_client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mp3songs_tracks'
});
db_client.connect();

var list_array=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","z"];

function db_insert(title,url,size,bit,time,current_id) {
  var sql='insert into files_info (title,url,size,bit_rate,play_time,song_id) values ("' + title + '","' + url + '","' + size + '","' + bit + '","' + time + '","' + current_id + '")';
      db_client.query(sql, function(err, res) {
      //client.query(sql);
      });
 }
 function change_status(current_id) {
  var sql="update song_list set status = 1 where song_id="+current_id;
      db_client.query(sql, function(err, res) {
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
count_current_id=0;
inserted_row=0;
all_inserted_row=0;
brach_rows = 50000;
function fetch_song(song_uri,current_id){
  var back_up=song_uri;
  var recall_uri="";
  var temp_url="http://mp3skull.com/mp3/"+song_uri+".html";
  request({
          uri: temp_url,
        }, function(error, response, body) {
          var $ = cheerio.load(body);
          // if($("#main div:nth-child(2) > a").length > 0){
          //   request_uri=back_up.split("_").slice(0,2).join("_");
          //   fetch_song(request_uri);
          // }
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
                console.log(size+'|'+bit+'|'+time+'|'+current_id);
                count_current_id++;
                if($("#song_html").length <= count_current_id)
                {
                	count_current_id=0;
                	change_status(current_id);
                }
                // console.log(mp3+'|'+size+'|'+bit+'|'+time);
                db_insert(title,mp3,size,bit,time,current_id);
              }
            }
          });

        });
 }

	db_client.query("SELECT song_id,song FROM song_list where status = 0 LIMIT 0,50000",
		function(err, results, fields) {
			if (err) throw err;
				// console.log(results.length);
			for (var index in results) {
				var song_name=results[index].song.replace(/\s/g,'_').replace(/^\s+|\s+$/g,'');
				console.log(song_name);
     		fetch_song(song_name,results[index].song_id);
     		if(results.length == index+1)
     		{
     			console.log("completed list");
     		}
			}
			
		}
	); 