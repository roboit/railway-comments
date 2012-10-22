## About
Comments Spam Blocker plugin for RailwayJS MVC framework.

## Usage

`npmfile.js`
    require('railway-comments');

`posts_controller.js`

   action(function show() {
      Comment.all({where: {postId: params.id}, order: 'created_at'}, function(err, comments) 		{
        	render({ comments: comments });
      	});
   });
                     
`comments_controller.js`
   action(function index() {
       Comment.commentSave({limit: 10, page: page}, function (err, posts) {
           if (err) render({comments: comments});
       });
   });
   
`app/views/posts/show.ejs`:
  <%- view_comments(comments) %>	                        
	<% form_for(comment, {action: path_to.comments, method: 'POST'}, function (form) { %>
		<legend>Scrivi i tuoi commenti</legend>
    <%- errorMessagesFor(comment) %>
    <%- form.input("postId", {type: "hidden", value: post.id}) %>
    <%- form.label("Body", false) %>
    <%- form.textarea("content") %>
    <%- form.label("Nome visualizzato", false) %>
    <%- form.input("userName") %>
		<%- form.submit('Post Comment') %> 
	<% }); %> 
	

## License
MIT
