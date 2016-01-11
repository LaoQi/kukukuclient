HOSTROOT = "http://kukuku.cc";
HOSTSTATIC = "http://static.koukuko.com/h"

var zeroize = function (value, length) {
    if (!length) length = 2;
    value = String(value);
    for (var i = 0, zeros = ''; i < (length - value.length) ; i++) {
        zeros += '0';
    }
    return zeros + value;
};

var ThreadThumb = React.createClass({
    render: function() {
        var thumb = this.props.thumb || this.props.image;
        if (thumb){
            return (
                React.createElement(
                    "img",
                    {
                        className: "ThreadThumb",
                        src: HOSTSTATIC + thumb
                    }
                )
            );
        }
        return false;
    }
});

var Thread = React.createClass({
    rawContent: function() {
        var rawstr = this.props.data.content;
        return { __html: rawstr };
    },
    formatDate: function () {
        var d = new Date(this.props.data.updatedAt);
        var formatstr = d.getFullYear() + "/" + zeroize(d.getMonth()+1) + "/" + zeroize(d.getDate()) + " " + zeroize(d.getHours()) + ":" + zeroize(d.getMinutes());
        return formatstr;
    },
    render: function() {
        return (
            React.createElement(
                "div",
                { className: "Thread" },
                [
                    // thread panel
                    React.createElement('div', 
                        {className: "ThreadPanel"}, 
                        [
                            React.createElement('span', null, this.props.data.uid), 
                            React.createElement('span', { className: "FloatRight" }, this.formatDate()),
                            React.createElement('hr', null)
                        ]
                    ),
                    // thread content
                    React.createElement("div",
                        { 
                            className: "ThreadContent",
                            dangerouslySetInnerHTML: this.rawContent()
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

var Threads = React.createClass({
    render: function() {
        return (
            React.createElement(
                "div",
                { className: "Threads" },
                this.props.data.map(function(item, i){
                    return React.createElement(
                        Thread, 
                        {data: item}
                    );
                })
            )
        );
    }
});