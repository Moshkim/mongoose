

$(document).ready(function(){
    
  
    $.getJSON("/articles/saved", function(data) {
        console.log(data)
  
        for (let i = 0; i < data.length; i++) {

            $("#articles")
            .append($('<div>')
                .addClass('col s12 m12')
                .append($('<div>')
                .addClass('card black')
                .attr('id', data[i]._id+'_article')
                .append($('<div>')
                    .addClass('card-content white-text')
                    .append($('<span>')
                    .addClass('card-title')
                    .text("Title: " + data[i].title))
                    .append($('<p>')
                    .text("Link -> " + data[i].link)))
                .append($('<div>')
                    .addClass('card-action grey darken-3')
                    .append($('<div>')
                    .addClass('row')
                    .attr('style', 'margin-bottom:0')
                    .append($('<div>')
                    .addClass('col s6 center')
                    .append($('<button>')
                        .addClass('btn waves-effect waves-light red darken-4')
                        .attr('data-id-save', data[i]._id)
                        .addClass('button_unsave')
                        .attr('type', 'submit')
                        .text('Unsave')))
                    .append($('<div>')
                    .addClass('col s6 center')
                    .append($('<button>')
                        .addClass('btn waves-effect waves-light red darken-4')
                        .addClass('button_note')
                        .attr('data-id-note', data[i]._id)
                        .text('Note'))))
                        .append($('<br>'))
                    .append($('<div>')
                        .addClass('row')
                        .attr('id', data[i]._id+'_note'))
                    .append($('<br>'))
                    .append($('<div>')
                        .attr('id', data[i]._id+'_newNote')))))
                
                if(data[i].notes.length > 0){
                    for(let j = 0; j < data[i].notes.length; j++){
                        $(`#${data[i]._id}_note`)
                        .append($('<div>')
                            .addClass('col s4')
                            .attr('id', data[i].notes[j]._id+'_note')
                            .append($('<div>')
                                .addClass('card')
                                //.addClass('col s12 m4')
                                .append($('<div>')
                                    .addClass('card-image')
                                    .append($('<img>')
                                        .attr('src', 'sample.jpg'))
                                    .append($('<span>')
                                        .addClass('card-title')
                                        .text(data[i].notes[j].title)))
                                .append($('<div>')
                                    .addClass('card-content')
                                    .append($('<p>')
                                        .text(data[i].notes[j].content))
                                    .append($('<a>')
                                        .addClass('btn-floating waves-effect waves-light red right')
                                        .addClass('delete-note-button')
                                        .attr('article-id', data[i]._id)
                                        .attr('note-id', data[i].notes[j]._id)
                                        .append($('<i>')
                                            .addClass('material-icons')
                                            .text('clear'))))))
            
                    }
                }
                
        }
        
    });
  
    $(document).on('click', '.delete-note-button', function(){
        //$('.collapsible').collapsible()
        console.log(this)
        let articleId = $(this).attr('article-id')
        let noteId = $(this).attr('note-id')

        $.ajax({
            method: "DELETE",
            url: "articles/note/delete/" + noteId,
            data: {
                articleId: articleId
            }
        }).then(function(data){
            console.log(data)
            $(`#${noteId}_note`).empty()
            
        })

    })

  
    $(document).on("click", ".button_note", function(event){
      console.log(this)  
      let noteId = $(this).attr('data-id-note')
      $(`#${noteId}_newNote`)
        .addClass('row center')
        .append($('<div>')
          .addClass('input-field col s12')
          .append($('<input>')
            .attr('placeholder', 'title')
            .attr('id', noteId + '_title')
            .attr('type', 'text')
            .addClass('validate')))
        .append($('<div>')
          .addClass('input-field col s12')
          .append($('<input>')
              .attr('placeholder', 'contents')
              .attr('id', noteId + '_contents')
              .attr('type', 'text')
              .addClass('validate')))
        .append($('<button>')
            .addClass('btn waves-effect waves-light')
            .addClass('note-save-button')
            .attr('data-id-note-save', noteId)
            .attr('type', 'submit')
            .text('Note Save'))
  
    })
  
    $(document).on('click', '.note-save-button', function(){
      let articleId = $(this).attr('data-id-note-save')
      let articleTitle = $(`#${articleId}_title`).val()
      let articleContent = $(`#${articleId}_contents`).val()
  
  
      $.ajax({
        method: "POST",
        url: "/articles/note/" + articleId,
        data: {
          title: articleTitle,
          content: articleContent
        }
      }).then(function(data) {
  
        Materialize.toast(`New note of ${articleTitle} is saved!`)
  
        console.log(data)
        $(`#${articleId}_newNote`).empty()

        window.location.reload()
      });
  
  
      console.log(articleTitle)
      console.log(articleContent)
    })
  
    $('#scrape').on('click', function(){
      $.get('/api/scrape/', function(data, status){
        if(data){
    
          Materialize.toast(`${data.length} is scrapped!`)
          setTimeout(function(){
            window.location.reload()
          }, 1000)
          
        }
      })
    })
  
  
    $(document).on("click", ".button_unsave", function(event){
      console.log(this)  
      let articleId = $(this).attr('data-id-save')
      console.log("This is actual ID: " + articleId)
      
      $.ajax({
        method: "PUT",
        url: "/articles/unsaved/" + articleId
      }).then(function(data) {
          console.log(data);
          $(`#${articleId}_article`).empty()
      });
  
    
    })
  
  })
  
  