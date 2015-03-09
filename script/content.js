var shortName = 'VIGIL';
var version = '1.0';
var displayName = 'VIGIL Database';
var maxSize = 5*1024*1024;

VIGIL = openDatabase(shortName, version, displayName, maxSize);
all();

function all(){
	VIGIL.transaction(function(transaction){
		var t = '';
		var command = 'SELECT * FROM vigil ORDER BY count DESC;'
		transaction.executeSql(command, [], function (transaction, results) {
			var len = results.rows.length, i;
			for (i = 0; i < len; i++){
				var url = results.rows.item(i).url;
				var count = results.rows.item(i).count;
				if(url != 'chrome://newtab/')
				t += '<div id="url-name"><span><a href='+url+'>'+url+'</a></span></div><div id="url-count"><span>'+count+'</span></div>';
			}
			$(".details").append(t);
		});
	});
}