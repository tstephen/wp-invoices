WP-Invoices
===========

A simple demo app exploring the WordPress WP-API. I prepared this to accompany
a recent talk at [Bristol Open Source Meetup](http://www.meetup.com/bristol-open-source-user-group/).

Find the slides [here](http://www.slideshare.net/TimStephenson/wordpress-as-a-platform-talk-to-bristol-open-source-meetup-20141208)

Install
-------

 - I used WordPress 4.1 beta but I don't expect problems with any recent version.
 - Install the [WP-API plugin](http://wp-api.org) because although it is
   'aiming' to become part of core in 4.1 I could not find any sign of it.
 - Also install [HTTP Basic authentication plugin](https://github.com/WP-API/Basic-Auth)
   At the top of js/app.js you can see the HTTP Basic credentials for my dev
   server, which you should replace for the demo to work (unless you can also
   login as admin/admin!).
 - Make sure you have pretty permalinks enabled. 
 - Copy the project files into the web server root.
 - Open http://localhost/index.html in your browser.  

What does the demo consist of?
------------------------------

1. A single page app that allows the user to enter a timesheet entry with some  
   associated details and then to search for entries to compose an invoice.

   In fact the search is not implemented. An exercise for the reader :-)

1. This uses ractive.js data model binding and templating for display and the
   WP-API plugin to push data to and pull from the WordPress server.
