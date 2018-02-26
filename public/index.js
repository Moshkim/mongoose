

$(document).ready(function(){
  
  $.getJSON("/articles", function(data) {

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
              .addClass('card-action center grey darken-3')
              .append($('<div>')
                .addClass('row')
                .attr('style', 'margin-bottom:0')
                .append($('<div>')
                .addClass('col s6 center')
                .append($('<button>')
                  .addClass('btn waves-effect waves-light red darken-4')
                  .attr('data-id-save', data[i]._id)
                  .addClass('button_save')
                  .attr('type', 'submit')
                  .text('Save')))
                .append($('<div>')
                .addClass('col s6')
                .append($('<button>')
                  .addClass('btn waves-effect waves-light red darken-4')
                  .addClass('button_note')
                  .attr('data-id-note', data[i]._id)
                  .text('Note'))))
              .append($('<div>')
                .attr('id', data[i]._id+"_note")))))
      }
  });


  $(document).on("click", ".button_note", function(event){
    console.log(this)  
    let noteId = $(this).attr('data-id-note')
    $(`#${noteId}_note`)
      .addClass('row')
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
    let articleNoteId = $(this).attr('data-id-note-save')
    let articleTitle = $(`#${articleNoteId}_title`).val()
    let articleContent = $(`#${articleNoteId}_contents`).val()


    $.ajax({
      method: "POST",
      url: "/articles/note/" + articleNoteId,
      data: {
        title: articleTitle,
        content: articleContent
      }
    }).then(function(data) {

      Materialize.toast(`New note of ${articleTitle} is saved!`)

      console.log(data)
      $(`#${articleNoteId}_note`).empty()
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


  $(document).on("click", ".button_save", function(event){
    console.log(this)  
    let articleId = $(this).attr('data-id-save')
    console.log("This is actual ID: " + articleId)
    
    $.ajax({
      method: "PUT",
      url: "/articles/saved/" + articleId
    }).then(function(data) {
        console.log(data);
        $(`#${articleId}_article`).empty()
        $(`#${articleId}_article`).text("Saved!")
    });

  
  })

})



