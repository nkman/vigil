var shortName = 'VIGIL';
var version = '1.0';
var displayName = 'VIGIL Database';
var maxSize = 100000;

VIGIL = openDatabase(shortName, version, displayName, maxSize);
VIGIL.transaction(function (transaction) {
        var sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil(id INTEGER NOT NULL PRIMARY KEY, url TEXT NOT NULL, count INTEGER, UNIQUE(url));';
        transaction.executeSql(sqlCommand);
});

VIGIL.transaction(function (transaction) {
    var sqlCommand = 'INSERT INTO vigil (url, count) VALUES ("www.nairityal.in", 100)';
    transaction.executeSql(sqlCommand);
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
    console.log('tab updated with url '+tab.url+' !!');
});

function insertInDb(url){
    if(result.rows.length >= 1){
        id = parseInt(result.item(0).log);
        console.log(id);
        count = parseInt(result.item(1).log);
        count++;
        var query = "UPDATE vigil SET count="+count.toString()+" WHERE id="+id.toString();
        VIGIL.transaction(
            function(transaction){
                transaction.executeSql(query);
            }
        );
    }
    else{
        
        var query = "INSERT INTO vigil (url, count) VALUES (\""+url.toString()+"\", 1)";
        VIGIL.transaction(function(transaction){
            transaction.executeSql(query);
        });
    }

    // query = "SELECT * FROM vigil"
}