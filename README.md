FNM Renderer
============

This is a custom render function for node.js for Markdown with Nunjucks.  
FNM stands for the FrontMatter + Nunjucks + Markdown, the order in which the renderer processes views.

The code is a sample express.js app, with default view related code removed in `app.js`. Instead, `renderer.register(app)` is used where the renderer sets up Nunjucks and Markdown render functions.

Some notes:
- Default view type is Markdown.
- FNM Rule: Parse Front Matter, Nunjucks and then Markdown
- Front Matter and View Context are merged. View Context takes precedence during conflict.
- Layout files can be Nunjucks only.
- When `layout` is present in Front Matter, if Markdown, the content of the markdown file is passed as the content section for the layout.
- When `layout` is present in Front Matter, if Nunjucks,
the layout is added as an `extends` tag to the Nunjucks view before processing.

LICENSE: MIT