/*
 * grunt-jscomments
 * https://github.com/alexcoady/grunt-jscomments
 *
 * Copyright (c) 2013 Alex Coady
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('jscomments', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });


    grunt.log.write(this.files);
    grunt.log.write(this.filesSrc);

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));






      var Comment = function (title, author, date, param, return_prop) {
    
          this.title = title;
          this.author = author;
          this.date = date;
          this.param = param;
          this.return_prop = return_prop;
        };

      Comment.prototype = {

        title: undefined,
        author: undefined,
        date: undefined,
        param: undefined,
        return_prop: undefined,

        set: function setFn (property, value) {

          this[property] = value;
        },

        get: function (property) {

          return this[property];
        },

        isValid: function isValidFn () {

          if (this.title || 
            this.author || 
            this.date || 
            this.param || 
            this.return_prop) {

            return true;
          }
          return;
        },

        getTitle: function getTitleFn () {

          return this.title;
        },

        logOut: function printOutFn () {

          console.log(this);
        },

        getMarkdown: function getMarkdown () {

          return "##" + this.get("title") + "\n" +
          "*\tAuthor: " + this.get("author") + "\n" +
          "*\tDate: " + this.get("date") + "\n" +
          "*\tParam: `" + this.get("param") + "`\n" +
          "*\tReturn: `" + this.get("return_prop") + "`\n\n";
        }
      };

      var string = src,
        char_count = src.length,
        char_i = 0,
        comment_started = false,
        comment_entered = false,
        started_i = 0,
        finished_i = 0,
        comments_string_array = [];

      for (char_i; char_i < char_count; char_i += 1) {

        if ( (char_i + 1) < char_count &&
          string.charAt(char_i) === "/" &&
          string.charAt(char_i + 1) === "*") {

          comment_started = true;
          started_i = char_i;

          char_i += 1;
          continue;

        } else if ( (char_i + 1) < char_count &&
          string.charAt(char_i) === "*" &&
          string.charAt(char_i + 1) === "/") {

          comment_started = false;
          char_i += 1;
          finished_i = char_i;

          comments_string_array.push( string.substring(started_i, finished_i + 1) );
          continue;   
        } 
      }

      var comments_count = comments_string_array.length,
        comments_i = 0,
        comment_string,
        lines,
        line_count,
        line_i,
        line,
        kw_index = {},
        comments = [];

      for (comments_i; comments_i < comments_count; comments_i += 1) {

        comment_string = comments_string_array[comments_i];
        // Split lines in the comment into seperate array items
        lines = comment_string.match(/[^\r\n]+/g);
        line_count = lines.length;
        line_i = 0;

        var comment = new Comment();

        for (line_i; line_i < line_count; line_i += 1) {

          line = lines[line_i].trim();

          if ( line.charAt(0) === "*" ) {

            line = line.substring(1).trim();
          }

          kw_index.title = line.indexOf("@title");
          kw_index.author = line.indexOf("@author");
          kw_index.date = line.indexOf("@date");
          kw_index.param = line.indexOf("@param");
          kw_index.return_prop = line.indexOf("@return");

          if ( kw_index.title !== -1 ) {

            comment.set("title", line.substring(kw_index.title + 7));

          } else if ( kw_index.author !== -1 ) {

            comment.set("author", line.substring(kw_index.author + 8));
          
          } else if ( kw_index.date !== -1 ) {

            comment.set("date", line.substring(kw_index.date + 6));
          
          } else if ( kw_index.param !== -1 ) {

            comment.set("param", line.substring(kw_index.param + 7));

          } else if ( kw_index.return_prop !== -1 ) {

            comment.set("return_prop", line.substring(kw_index.return_prop + 8));
          }
        }

        if (comment.isValid()) {

          comments.push(comment);
        }
      }

      if (comments.length > 0) {

        console.log(comments.length);

        var markdown = "";

        for (var i = 0; i < comments.length; i +=1) {

          markdown += comments[i].getMarkdown();
        }

        grunt.file.write('comments/comment.md', markdown);
      }







      // Write the destination file.
      // grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
