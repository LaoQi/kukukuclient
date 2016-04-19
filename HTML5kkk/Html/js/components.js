var zeroize = function (value, length) {
    if (!length) length = 2;
    value = String(value);
    for (var i = 0, zeros = ''; i < (length - value.length) ; i++) {
        zeros += '0';
    }
    return zeros + value;
};
var formatDate = function (time) {
    var d = new Date(time);
    var formatstr = d.getFullYear() + "/" + zeroize(d.getMonth()+1) + "/" + zeroize(d.getDate()) + " " + zeroize(d.getHours()) + ":" + zeroize(d.getMinutes());
    return formatstr;
}

var refReg = /<font color="#789922">/g;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var ThreadThumb = React.createClass({
    handleClick: function() {
        var image = this.props.image || this.props.thumb;
        var cmd = "image#" + HOSTSTATIC + image;
        if (typeof (window.external.Notify) != "undefined") {
            window.external.Notify(cmd.toString());
        } else {
            console.log(cmd);
        }
    },
    render: function() {
        var thumb = this.props.thumb || this.props.image;
        if (thumb){
            return (
                React.createElement(
                    "div",
                    {
                        className: "ThreadThumb",
                        onClick: this.handleClick
                    },
                    [
                        React.createElement('img', {
                            src: HOSTSTATIC + thumb
                        })
                    ]
                )
            );
        }
        return false;
    }
});

var ThreadContent = React.createClass({
    rawContent: function (content) {
        var rawstr = content.replace(refReg, "<font color=\"#789922\" onclick=\"KKK.GetRef(this)\">");
        return { __html: rawstr };
    },
    render: function () {
        return (
            React.createElement("div",
                {
                    className: "ThreadContent",
                    dangerouslySetInnerHTML: this.rawContent(this.props.content)
                }
            )
        );
    }
});

var ThreadLast = React.createClass({
    render: function () {
        if (typeof (this.props.last) != "undefined" && this.props.last.length > 0) {
            return (
                React.createElement(
                    ReactCSSTransitionGroup,
                    {
                        //transitionName: "example",
                        //transitionEnterTimeout:300, 
                        //transitionLeaveTimeout: 300,
                        //transitionAppear:true,
                        //transitionAppearTimeout:500
                    },
                    [
                        React.createElement("div",
                            {
                                className: "ThreadLast",
                                key: this.props.tid,
                            },
                            this.props.last.map(function (item, i) {
                                return React.createElement(
                                    "div",
                                    {
                                        className: this.props.showitem ? "ThreadReply" : "Hide"
                                    },
                                    [
                                        //React.createElement("hr", { className: "HrLine_1px" }),
                                        // thread panel
                                        React.createElement('div',
                                            { className: "ThreadPanel" },
                                            [
                                                React.createElement('span', { className: "ThreadBarId" }, "No." + item.id),
                                                React.createElement('span', { dangerouslySetInnerHTML: { __html: item.uid } }),
                                                React.createElement('span', { className: "GreenPo" }, item.uid == this.props.po ? "PO" : null),
                                                React.createElement('span', { className: "FloatRight" }, formatDate(item.createdAt)),
                                                React.createElement('hr', { className: "HrLine" })
                                            ]
                                        ),
                                         // thread content
                                        React.createElement(ThreadContent,
                                            {
                                                content: item.content,
                                            }
                                        ),
                                        // thread thumb
                                        React.createElement(ThreadThumb,
                                            {
                                                thumb: item.thumb,
                                                image: item.image
                                            }
                                        )
                                    ]
                                );
                            },this)
                        )
                    ]
                )
            );
        }
        return false;
    }
});

var Thread = React.createClass({
    getInitialState: function () {
        return { showlast : false };
    },
    handleClickLast: function () {
        this.setState({ showlast : !this.state.showlast });
    },
    handleClickDetail: function () {
        this.props.handleClickDetail(this.props.data.id);
    },
    render: function () {
        return (
            React.createElement(
                "div",
                { className: "Thread" },
                [
                    // thread panel
                    React.createElement('div', 
                        {className: "ThreadPanel"}, 
                        [
                            React.createElement('span', { className: "ThreadBarId" }, "No." + this.props.data.id),
                            React.createElement('span', { dangerouslySetInnerHTML: { __html: this.props.data.uid } }),
                            React.createElement('span', { className: "FloatRight" }, formatDate(this.props.data.createdAt)),
                            React.createElement('hr', { className: "HrLine" })
                        ]
                    ),
                    // thread content
                    React.createElement(ThreadContent,
                        {
                            content: this.props.data.content,
                        }
                    ),
                    // thread thumb
                    React.createElement(ThreadThumb,
                        { 
                            thumb: this.props.data.thumb,
                            image: this.props.data.image
                        }
                    ),
                    // thread last reply
                    React.createElement(ThreadLast,
                        {
                            last: this.props.data.last,
                            tid: this.props.data.id,
                            po: this.props.data.uid,
                            showitem: this.state.showlast
                        }
                    ),
                    // thread bar
                    React.createElement(
                        "div",
                        {
                            className: "ThreadBar"
                        },
                        [
                            //React.createElement("hr", { className: "HrLine_1px" }),
                            React.createElement("hr", { className: "HrLine" }),
                            React.createElement(
                                "div",
                                {
                                    className: "BarButton"
                                },
                                "回串"
                            ),
                            React.createElement(
                                "div",
                                {
                                    className: "BarButton",
                                    onClick: this.props.data.replyCount > 0 ? this.handleClickDetail : null
                                },
                                "详情(" + this.props.data.replyCount + ")"
                            ),
                            React.createElement(
                                "div",
                                {
                                    className: "BarButton",
                                    onClick: this.props.data.recentReply.length > 0 ? this.handleClickLast : null
                                },
                                this.state.showlast ? "收起" : "最近回应(" + this.props.data.recentReply.length + ")"
                            )
                        ]
                    )
                ]
            )
        );
    }
});

var Threads = React.createClass({
    render: function() {
        return (
            React.createElement(
                "div",
                { className: "Threads" },
                this.props.threads.map(function (item, i) {
                    return React.createElement(
                        Thread, 
                        {
                            data: item,
                            handleClickDetail: this.props.handleClickDetail
                        }
                    );
                }, this).concat(
                    React.createElement(
                        "div",
                        {
                            className: "Thread",
                            onClick: this.props.nextpage ? this.props.nextPagehandler : null
                        },
                        this.props.nextpage ? "下一页" : "已经没有了(´・ω・`)"
                    )
                )
            )
        );
    }
});

var ThreadReply = React.createClass({
    render: function () {
        return (
            React.createElement(
                "div",
                { className: "Thread" },
                [
                    // thread panel
                    React.createElement('div',
                        { className: "ThreadPanel" },
                        [
                            React.createElement('span', { className: "ThreadBarId" }, "No." + this.props.data.id),
                            React.createElement('span', { dangerouslySetInnerHTML: { __html: this.props.data.uid } }),
                            React.createElement('span', { className: "GreenPo" }, this.props.data.uid == this.props.po ? "PO" : null),
                            React.createElement('span', { className: "FloatRight" }, formatDate(this.props.data.createdAt)),
                            React.createElement('hr', { className: "HrLine" })
                        ]
                    ),
                    // thread content
                    React.createElement(ThreadContent,
                        {
                            content: this.props.data.content,
                        }
                    ),
                    // thread thumb
                    React.createElement(ThreadThumb,
                        {
                            thumb: this.props.data.thumb,
                            image: this.props.data.image
                        }
                    )
                ]
            )
        );
    }
});

var ThreadReplys = React.createClass({
    render: function () {
        return (
            React.createElement(
                "div",
                { className: "Threads" },
                this.props.replys.map(function (item, i) {
                    return React.createElement(
                        ThreadReply,
                        {
                            data: item,
                            po: this.props.replys[0].uid
                        }
                    );
                }, this).concat(
                    React.createElement(
                        "div",
                        {
                            className: "Thread",
                            onClick: this.props.nextPagehandler
                        },
                        this.props.nextpage ? "下一页" : "已经没有了(´・ω・`)点击刷新"
                    )
                )
            )
        );
    }
});