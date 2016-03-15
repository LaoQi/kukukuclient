/**
 * KKK common
 */

HOSTROOT = "http://kukuku.cc";
HOSTTHREADROOT = "http://kukuku.cc/t/";
HOSTFORMREF = "http://kukuku.cc/homepage/ref";
HOSTSTATIC = "http://static.koukuko.com/h"

var KKK = {
    //threads
    page: 1,
    pagemax: 1,
    address: "",
    threads: [],
    //replys
    tpage: 1,
    tpagemax: 1,
    threadno: -1,
    replys: [],
    // state
    canback: false,
    scrollY: 0,

    GetCategory : function(){
    },
    ConvertData: function (data) {
        for (var i in data.threads) {
            data.threads[i]["last"] = [];
            if (data.threads[i]["recentReply"].length > 0) {
                var tmp = data.threads[i]["recentReply"];
                for (var j in tmp.sort()) {
                    var key = "t" + tmp[j];
                    if (data.replys[key]) {
                        data.threads[i]["last"].push(data.replys[key]);
                    }
                }
            }
        }
        return data.threads;
    },
    clear: function(){
        ReactDOM.render();
    },
    nextPagehandler: function () {
        this.page += 1;
        this.GetData()
    },
    TnextPagehandler: function () {
        if (this.threadno < 0) {
            return;
        }
        this.tpage += 1;
        this.GetThread();
    },
    DetailPagehandler: function(no) {
        this.OpenThread(no);
    },
    Refresh: function () {
        this.threads = [];
        this.page = 1;
        this.GetData();
        window.scrollTo(0, 0);
    },
    Render: function () {
        ReactDOM.render(
            React.createElement(
                Threads,
                {
                    threads: this.threads,
                    nextpage: (this.page < this.pagemax),
                    nextPagehandler: this.nextPagehandler.bind(this),
                    handleClickDetail: this.DetailPagehandler.bind(this)
                }),
            document.getElementById('main_container')
        );
    },
    TRender: function () {
        ReactDOM.render(
            React.createElement(ThreadReplys, { replys: this.replys, nextpage: (this.tpage < this.tpagemax), nextPagehandler: this.TnextPagehandler.bind(this) }),
            document.getElementById('thread_container')
        );
    },
    RefRender: function(tdata) {
        ReactDOM.render(
            React.createElement(ThreadReply, { data: tdata }),
            document.getElementById('thread_ref')
        );
    },
    TReset: function() {
        this.threadno = -1;
        this.tpage = 1;
        this.tpagemax = 1;
        this.replys = [];
    },
    OpenForm: function (ad) {
        this.threads = [];
        this.page = 1;
        this.Render();
        window.scrollTo(0, 0);
        this.address = ad;
        this.Refresh();
    },
    OpenThread: function (no) {
        this.scrollY = window.scrollY || window.pageYOffset;
        this.canback = true;
        window.scrollTo(0, 0);
        this.threadno = no;
        $("#main_container").hide();
        this.GetThread();
        $("#thread_container").show();
    },
    Backup: function () {
        if (this.canback) {
            this.TReset();
            $("#thread_container").hide();
            $("#main_container").show();
            this.canback = false;
            window.scrollTo(0, this.scrollY);
        }
    },
    GetData: function () {
        var url = HOSTROOT + '/' + this.address + ".json?page=" + this.page;
        $.ajax({
            url: url,
            dataType: "json",
            success: function (data) {
                if (data["success"] && data.data) {
                    KKK.threads = KKK.threads.concat(KKK.ConvertData(data.data));
                    KKK.pagemax = data.page.size;
                    KKK.Render();
                }
            },
            error: function(data) {
                console.log(data);
            }
        });
    },
    GetThread: function () {
        var url = HOSTTHREADROOT + this.threadno + ".json?page=" + this.tpage;
        $.ajax({
            url: url,
            dataType: "json",
            success: function (data) {
                if (data["success"]) {
                    if (data.page.page == 1) {
                        KKK.replys.push(data.threads);
                    }
                    KKK.replys = KKK.replys.concat(data.replys);
                    KKK.tpagemax = data.page.size;
                    KKK.TRender();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },
    GetRef: function (e) {
        $("#mask_div").show();
        $("#thread_ref").show();
        var tid = /\d+/.exec($(e).text())[0];
        if (tid) {
            var tdata = null;
            for (var i in this.threads) {
                if (this.threads[i]["id"] == tid) {
                    tdata = this.threads[i];
                    break;
                }
                if (this.threads[i]["last"].length > 0) {
                    for (var j in this.threads[i]["last"]) {
                        if (this.threads[i]["last"][j]["id"] == tid) {
                            tdata = this.threads[i]["last"][j];
                            break;
                        }
                    }
                }
                if (tdata != null) {
                    break;
                }
            }
            if (tdata == null) {
                for (var i in this.replys) {
                    if (this.replys[i]["id"] == tid) {
                        tdata = this.replys[i];
                        break;
                    }
                }
            }
            if (tdata != null) {
                KKK.RefRender(tdata);
            } else {
                var url = HOSTFORMREF + ".json?tid=" + tid;
                $.ajax({
                    url: url,
                    dataType: "json",
                    success: function (data) {
                        if (data["success"]) {
                            KKK.RefRender(data.data);
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }
        }
    }
};