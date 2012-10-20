## About
Comments Spam Blocker plugin for RailwayJS MVC framework.

## Usage

`npmfile.js`

    require('railway-comments');

`posts_controller.js`

   action(function show() {
      Comment.all({where: {postId: params.id}, order: 'created_at'}, function(err, comments) {
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

   comments(posts);

## License

MIT
