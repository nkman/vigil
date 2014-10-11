var shortName = 'VIGIL';
var version = '1.0';
var displayName = 'VIGIL Database';
var maxSize = 100000;

VIGIL = openDatabase(shortName, version, displayName, maxSize);
createTables();

chrome.tabs.onCreated.addListener(function(tab){
	checkDb(tab.url);
    console.log("opened this : "+ tab.url.toString())
});

/*
function prepareDatabase(ready, error) {
    var dbName = 'vigil';
    var dbVersion = '1.0';
    var displayName = 'url counter';
    var dbSize = 5*1024*1024;
    return openDatabase(dbName, dbVersion, displayName, dbSize, function (db) {
        db.changeVersion('', '1.0', function (t) {
            t.executeSql('CREATE TABLE docids (id, name)');
        }, error);
    });
}
*/

function createTables(){
    VIGIL.transaction(
        function (transaction) {
            var sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil(id INTEGER NOT NULL PRIMARY KEY, url TEXT NOT NULL, count INTEGER);';
            transaction.executeSql(sqlCommand);

            sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil_created(id INTEGER NOT NULL PRIMARY KEY, date INTEGER NOT NULL);';
            transaction.executeSql(sqlCommand);
            console.log("Created Tables.")
        }
    );
    prePopulate();
}

function prePopulate(){
    VIGIL.transaction(
        function (transaction) {
            var date = new Date();
            date = date.getDate();
            var id = 1;
        transaction.executeSql("INSERT INTO vigil_created(id, date) VALUES (?, ?)", [id, date]);
        }
    );
}

function selectAll(){
    VIGIL.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM vigil;", [],
                dataSelectHandler, errorHandler);
        }
    );
}

function checkDb(url){
    query = "SELECT * FROM vigil WHERE url = \""+url.toString()+"\"";
    VIGIL.transaction(function(transaction){
        transaction.executeSql(query, [], function(transaction, result){
            console.log(result.rows);
            insertInDb(result.rows, url);
        }, null);
    });
}

function insertInDb(result, url){
    if(result.length == 1){
        id = parseInt(result.item(0).log);
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
