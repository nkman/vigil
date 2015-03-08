var shortName = 'VIGIL';
var version = '1.0';
var displayName = 'VIGIL Database';
var maxSize = 5*1024*1024;

VIGIL = openDatabase(shortName, version, displayName, maxSize);
VIGIL.transaction(function (transaction) {
        var sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil(id INTEGER NOT NULL PRIMARY KEY, url TEXT NOT NULL, count INTEGER, UNIQUE(url));';
        transaction.executeSql(sqlCommand);
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
    VIGIL.transaction(function (transaction) {
        var url = tab.url;
        var proto = url.split("/");
        if(proto[0] == "http:" || proto[0] == "https:"){
            var sqlCommand = 'INSERT INTO vigil (url, count) VALUES ("'+proto[0]+'//'+proto[2]+'", 1);';
            transaction.executeSql(sqlCommand);
        } else {
            ///NO
        }
    }, function(err){
        var url = tab.url;
        var proto = url.split("/");
        VIGIL.transaction(function(transaction){
            var sqlCommand = 'UPDATE vigil SET count=count+1 WHERE url="'+proto[0]+'//'+proto[2]+'";';
            transaction.executeSql(sqlCommand);
        });
    });
});
