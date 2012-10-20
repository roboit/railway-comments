<<<<<<< HEAD
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
=======
railway-comments
================

Comments Spam Blocker plugin for RailwayJS MVC framework
>>>>>>> d036c22e91db7c534c842ed05d5e9aa1a5cb00fc
