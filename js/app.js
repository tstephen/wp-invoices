// TODO You can use this to adjust the path to your install of WordPress
// or even potentially remove the
var SRVR = 'http://localhost';
$.ajaxSetup({
  // TODO This is the HTTP Basic header for user 'admin' with password 'admin'
  // Clearly this is not a production setting!
  headers: { 'Authorization': "Basic YWRtaW46YWRtaW4=" }
});

/************************ Wrapper class for WP-API calls **********************/
App = function() {
  this.activate = function(navSelector, sectionSelector) {
    $('nav .active').removeClass('active');
    $('section').hide();
    $('.result').hide();
    $(navSelector).parent().addClass('active');
    $(sectionSelector).removeClass('hidden').show();
  }
  this.createTime = function(time) {
    if (time.complete) time.status = 'publish';
    $.ajax({
      type: 'POST',
      url: SRVR+"/wp-json/posts",
      data: JSON.stringify(time)
    })
    .done(function( data, textStatus, jqXHR ) {
      console.log('received: '+ textStatus);
      var msg = 'Successfully created post: <a href="'+data.link+'" target="_newtab">View</a>';
      console.log('  : '+msg);
      $( ".result" ).html( msg );
      $.ajax({
        type: 'POST',
        url: SRVR+"/wp-json/posts/"+data.ID+"/meta",
        data: JSON.stringify({key:'duration',value:time.duration})
      })
      .done(function( data2 ) {
        var msg = 'Successfully stored duration';
        console.log('  : '+data2);
      });
      $.ajax({
        type: 'POST',
        url: SRVR+"/wp-json/posts/"+data.ID+"/meta",
        data: JSON.stringify({key:'project',value:time.project})
      })
      .done(function( data2 ) {
        var msg = 'Successfully stored project';
        console.log('  : '+data2);
      });
      $.ajax({
        type: 'POST',
        url: SRVR+"/wp-json/posts/"+data.ID+"/meta",
        data: JSON.stringify({key:'startTime',value:time.startTime})
      })
      .done(function( data2 ) {
        var msg = 'Successfully stored startTime';
        console.log('  : '+data2);
      });
    });
  }
};
var app = new App();

/************************ NAVBAR ***** ****************************************/
var navbarCtrl = new Ractive({
  // The `el` option can be a node, an ID, or a CSS selector.
  el: 'nav',

  // We could pass in a string, but for the sake of convenience
  // we're passing the ID of the <script> tag above.
  template: '#navbar-template'

  // Here, we've no need to pass in some initial data
  //data: { name: 'world' }
});
navbarCtrl.on('activateTime', function ( event ) {
  console.info( 'Activating time section' );
  app.activate('nav a[href="#time"]', '#time');
});
navbarCtrl.on('activateInvoice', function ( event ) {
  console.info( 'Activating invoice section' );
  app.activate('nav a[href="#invoice"]', '#invoice');
});
navbarCtrl.on('activateAbout', function ( event ) {
  console.info( 'Activating about section' );
  app.createTime(navbarCtrl.data['time']);
});

/************************ TIME PAGE *******************************************/
var timeCtrl = new Ractive({
  // The `el` option can be a node, an ID, or a CSS selector.
  el: '#time',

  // We could pass in a string, but for the sake of convenience
  // we're passing the ID of the <script> tag above.
  template: '#time-template'
});
timeCtrl.on('createTime', function ( event ) {
  event.preventDefault;
  if (!document.forms['timeForm'].checkValidity()) {
    $('#timeForm .result').empty().append('<b class="text-danger">Please correct the form errors</b>').show();
    return ;
  }
  console.info( 'Saving time record...' );
  app.createTime(timeCtrl.data.time);
});

/************************ INVOICE PAGE ****************************************/
var invoiceCtrl = new Ractive({
  el: '#invoice',
  template: '#invoice-template'
});
invoiceCtrl.on('getInvoices', function( event ) {
  console.info( 'Fetching invoice records...');
  $.getJSON(SRVR+'/wp-json/posts', function(response) {
    //console.log();
    invoiceCtrl.set('invoiceEntries', response);
    $.each(invoiceCtrl.data.invoiceEntries, function(i,d) {
      $.getJSON(SRVR+'/wp-json/posts/'+d.ID+'/meta', function(meta) {
        //console.log('meta found: '+JSON.stringify(meta));
        $.each(meta, function(j,e) {
          //console.log(meta[j].key+'='+meta[j].value);
          if (meta[j].key=='duration') invoiceCtrl.set('invoiceEntries['+i+'].duration', meta[j].value);
        })
        if (invoiceCtrl.data.invoiceEntries[i].duration == undefined)
          invoiceCtrl.set('invoiceEntries['+i+'].duration', 0);
      });
    });
  });

  $('#invoice .result').removeClass('hidden').show();
  event.preventDefault;
});
