/**
this script export all the grafna folder/dashboard/panel titles, then you can import to MongoDB, Splunk, ElasticSearch for full text search.
run this script on chrome console after you open and login to your grafana.
change the baseUrl before you run it. 
**/
let baseUrl = "https://grafana.tianxiaohui.com";

let allDash = [];

/** a queued executor due to 6 sockets per domain **/
class QueuedAjaxGetTaskExecutor {

    constructor() {
        this.tasks = [];
        this.running = 0;
        this.processed = 0;
        this.startTime = Date.now();
    }

    runTask() {
        if (this.running < 6) {
            let task = this.tasks.pop();
            if (task) {
                this.running++;
                console.log(`processed: ${this.processed++}, running: ${this.running}, queued: ${this.tasks.length}, time used: ${(Date.now() - this.startTime) / 1000}s`);
                let self = this;
                $.ajax({
                    url: task.url
                }).then(function (rsps) {
                    task.callback(rsps);
                }).always(function () {
                    self.running--;
                    //console.log(`now running : ${self.running}`);
                    self.runTask();
                });
            }
        }
    }

    addTask(url, callback) {
        this.tasks.push({ url: url, callback: callback });
        this.runTask();
    }
}

let executor = new QueuedAjaxGetTaskExecutor();

// fetch a single dashboard data
function fetchDashDetail(dashUid) {
    let dashDetailApiUrl = `${baseUrl}/api/dashboards/uid/${dashUid}`;
    executor.addTask(dashDetailApiUrl, function (rsps) {
        let panels = [];
        if (rsps.dashboard.panels) {
            rsps.dashboard.panels.forEach(function (ele) {
                if (null != ele.title) {
                    panels.push(ele.title);
                }
            });
        }
        let record = {};
        record["title"] = rsps.dashboard.title;
        record["url"] = rsps.meta.url;
        record["folder"] = rsps.meta.folderTitle;
        record["panels"] = panels;
        if (panels.length > 0) {
            //console.log(JSON.stringify(record));
            allDash.push(record);
        }
    });
}

//fetch all dashboard metadata for a folder
function fetchAllDashs(folderId, pageId) {
    let allDashByFolderIdApi = `${baseUrl}/api/search?folderIds=${folderId}&type=dash-db&query=&page=${pageId}&limit=5000`;
    executor.addTask(allDashByFolderIdApi, function (rsps) {
        rsps.forEach(function (ele) {
            fetchDashDetail(ele.uid);
        });
        if (4998 < rsps.length) {
            fetchAllDashs(folderId, 1 + pageId);
        }
    });
}

//fetch all folders
function fetchAllFolders() {
    let allFolderApiUrl = `${baseUrl}/api/folders?limit=10000`;
    executor.addTask(allFolderApiUrl, function (rsps) {
        rsps.forEach(function (ele) {
            fetchAllDashs(ele.id, 1);
        });
    });
}

// start to run
fetchAllFolders();

/**
// run below script and copy the output to text editor
let allDashStr = "";
allDash.forEach(function(ele){
    allDashStr += JSON.stringify(ele).replaceAll("\\'", "") + '\n';
});
console.log(allDashStr);
**/
