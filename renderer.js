var nunjucks = require('nunjucks');
var graymatter = require('gray-matter');
var marked = require('marked');

// Use md by default
// FNM rule : Front-Matter, Nunjucks, Markdown
// When using NJK: content is under {% block content %} of layout
// When using MD: layouts is not supported right now...

var getType = function(path) {
    if (path.endsWith('.md')) {
        return 'md'
    }
    if (path.endsWith('njk')) {
        return 'njk'
    }

    return undefined;
};

// This should be two separate operations ideally
// - check if we can use layout
// - sanitize layout path
var getLayout = function(layout) {
    if (layout.endsWith('.md')) {
        throw "Cannot use Markdown for layouts";
    }

    if (!layout.endsWith('.njk')) {
        return layout + '.njk';
    }
};

var getContent = function(matter, context, type) {
    var content = '';
    switch (type) {
    case 'njk':
        content = matter.content;
        if (context.layout) {
            content = '{% extends "' + getLayout(context.layout) + '" %}' + content;
        }
        break;
    case 'md':
    default:
        // default for content is markdown
        content = '{% block content %}' + matter.content + '{% endblock %}'
        if (context.layout) {
            content = '{% extends "' + getLayout(context.layout) + '" %}' + content;
        }
        break;
    }
    return content;
};

var getHtml = function(content, context, type) {
    var html = '';
    switch (type) {
    case 'njk':
        html = renderNjk(content, context);
        break;
    case 'md':
    default:
        // default rendering is markdown
        html = renderMd(content, context);
        break;
    }
    return html;
};

var getContext = function(matter, options) {
    return Object.assign(options, matter.data);
};

var renderNjk = function(content, context) {
    return nunjucks.renderString(content, context);
};

var renderMd = function(content, context) {
    return marked(renderNjk(content, context));
};

var render = function(path, options, callback) {
    const type = getType(path);
    try {
        const matter = graymatter.read(path);
        const context = getContext(matter, options);
        const content = getContent(matter, context, type);
        const html = getHtml(content, context, type);
        return callback(null, html);
    } catch(err) {
        console.log(err);
        return callback(err);
    }
};

module.exports = {
    register: function(app) {
        app.engine('md', render);
        app.engine('njk', render);

        nunjucks.configure('views');
        app.set('views', __dirname + '/views');
        app.set('view engine', 'md');
    }
};