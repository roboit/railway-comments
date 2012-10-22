var email = require("mailer");

exports.init = function () {
    // add view helper
    railway.helpers.HelperSet.prototype.view_comments = commentsHelper;
    // add orm method
    railway.orm.AbstractClass.comments = commentsCollection;
};

// global view helper
function commentsHelper(comments) {

    var html = '<div class="comments">';
    html += '<h2>Comments</h2>';
    if (comments.length > 0) {
		    comments.forEach(function (comment) {                   
          html += '<p><span class="text-info">'+comment.userName+'</span> ha scritto <span class="pull-right">'+comment.created_at+'</span></p>';
          html += '<blockquote>';                        
          html += comment.content;
          html += '</blockquote>';
				
        });
    } else {
			 html += '<p class="alert alert-block alert-info"><button type="button" class="close" data-dismiss="alert">x</button><strong>Diventa il primo a commentare!</strong></p>';
    }

    html += '</div>';
    return html;
};

// orm method
function commentsCollection(data, callback) {
    
    var Model = this;

      
    Model.all({where: {userId: data.userId}, limit: 1, order: 'created_at'}, function (err, lastcomment) {
      if (err) {                                               
        callback(err);            
      }                                               
                                                    
      if(lastcomment.spam){
        data.spam=1;
      }else{
        data.active=1;
        data.score=valida_punteggio(data);                                               
      }                       
      
      if(data.score==0) {data.active=0;data.spam=1;} // se score è = 0 setto come spam 
      else if(data.score <= 25) {data.active=0;} // comunque lo creo ma non lo attivo subito 
      
      console.log(JSON.stringify("Punteggione: "+data.score));
      
      // invio notifica all'autore
      sendapp(data, "tuamail@gmail.com");
      
      Model.create(data, function (err, comment) {
        if (err) {
          flash('error', 'comment can not be created');
          render('new', {
            comment: comment,
            title: 'New comment'
          });
        } else {               
            callback(null, comment);
        }
      });
      
    });    

}
                                              
function valida_punteggio(data) {       
                                                  
    var punteggio = 0,
        lunghezzaTotale=data.content.length;
        
    var blackListWords=["questo non posso scriverlo","anche questo non posso","e anche questo"];
    for(i=0;i <blackListWords.length;i++){    
      var n=data.content.indexOf(" "+blackListWords[i]+" ");
      if(n > 0) return 0;

    }  
 
    if(lunghezzaTotale > 20) punteggio = punteggio + 5;
    if(lunghezzaTotale > 60) punteggio = punteggio + 10;
       

    var consonant=new String(data.content).match(/[^aAeEiIoOuU\s]{5,}/i);    
    if(consonant){      
       punteggio = punteggio - (consonant.length*3);
       console.log("Punteggione consonanti: -"+(consonant.length*3)); 
    }else{                                                           
       punteggio = punteggio + 10;
    
    }                     
    
    var links=new String(data.content).match(/<\s*a.*href="(.*?)".*>(.*?)<\/a>/gi);    
    if(links){      
       punteggio = punteggio - (links.length*10); 
    }else{                                                           
       punteggio = punteggio + 10;
    
    }  
   
   return punteggio+1;
   
}

function sendapp(data,sendto) {                       
    
    
    var sgusername = 'tuamail@gmail.com';
    var sgpassword = 'password';
    var status="";
    
    if(data.score == 0) {
       status=" cancellato (SPAM)";
    }else if(data.score <= 25) {
       status=" in attesa di essere pubblicato";
    }else{
       status=" pubblicato";
    }
    
    
    email.send({
        host : "smtp.gmail.com",
        port : "465",
        ssl : true,
        domain : "domain.com",
        to : sendto,
        from : "tuamail@gmail.com",
        subject : "Nuovo commento"+status,
        body: data.content+'<a href="/posts/'+data.postId+'>Associato a questo articolo</a>',
        authentication : "login",
        username : sgusername,
        password : sgpassword
        },
        function(err, result){
          if(err){ self.now.error(err); console.log(err); return;}
          else console.log('looks good')
    });
}