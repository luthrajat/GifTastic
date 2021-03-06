/**
Copyright (c) 2011-2017 GitHub Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


This application bundles the following third-party packages in accordance
with the following licenses:


Package: *
License: BSD
License Source: LICENSE
Source Text:

Copyright (c) Rajat Luthra (rajatluthra@gmail.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

-->
<!--
  Author: Rajat Luthra
  Date:   May 28th, 2017.

  Purpose: GIPHY Search using API.
-->
**/
var preDefinedButtons = ['dog','cat','rabbit','hamster','skunk','goldfish','bird','ferret','turtle','sugar glider','chinchilla','hedgehog','hermit crab','gerbil','pygmy goat','chicken','capybara','teacup plg', 'serval', 'salamander', 'frog'];

function populateShortcutButton(index, shortCutName) {
  var quickButtons = $("#quickButtons");
  var button = $("<button>");
  button.attr("id", shortCutName.replace(/ /g, ''));
  button.addClass("shortcut");
  button.text(shortCutName);
  quickButtons.append(button);
}

function callGiphy(title) {
  var thubnailsObj = $("#thumbnails");
  thubnailsObj.empty();

   if (title.length<1) {
     thubnailsObj.html(createNewTextDisplay("Please provide a word to search."));
     return;
   }
   var queryURL = "https://api.giphy.com/v1/gifs/search?q="+title+"&api_key=dc6zaTOxFJmzC";
   $.ajax({
     url: queryURL,
     method: 'GET'
   }).done(function(response) {
     if (response.data.length>0) {
       var id = $("#"+title.replace(/ /g,''));
       if (id.length==0) {
         preDefinedButtons.push(title);
         populateShortcutButton(preDefinedButtons.length, title);
       }
       printGrid(response, thubnailsObj);
     } else {
        thubnailsObj.html(createNewTextDisplay("No result found for <strong>" + title + "</strong>."));
     }
   });
 }

$(document).on("click", ".grid", function() {
  var img = $(this);

  var isStill = img.data("isStill");
  var src = "";
  if (isStill == "1") {
      isStill = "0";
      src = img.data("animated");
  } else {
    isStill = "1";
    src = img.data("still");
  }
  img.attr("src", src);
  img.data("isStill", isStill);
});

function printGrid(response, thubnailsObj) {
  $.each(response.data, function(index, item) {
    var rating = getRatingPanel(thubnailsObj.children().length, item.rating, thubnailsObj);
    rating.append(createNewThumbnail(item, "grid"));
  });
}

function createNewTextDisplay(displayString) {
  var displayDiv = $("<div>");
  displayDiv.addClass("displayText");
  displayDiv.css("clear","both");
  displayDiv.html(displayString);
  displayDiv.css("text-align", "left");
  return displayDiv;
}

function createNewThumbnail(item, className) {
  var displayThumbnail = $("<img>");
  if(className) {
    displayThumbnail.addClass(className);
  }
  displayThumbnail.data("isStill", "1");
  displayThumbnail.data("animated", item.images.fixed_height.url);
  displayThumbnail.data("still", item.images.fixed_height_still.url);
  displayThumbnail.attr("src",item.images.fixed_height_still.url);
  return displayThumbnail;
}

function getRatingPanel(index, ratingString, thubnailsObj) {
  var panelBody = $("#"+ratingString);
  if(panelBody.length==1) return panelBody;

  var ahref = $("<a>");
  ahref.data("toggle", "collapse");
  ahref.data("parent", "#thumbnails");
  ahref.attr("href", "#collapse"+index);
  ahref.text("Rating: " + ratingString);

  panelBody = $("<div>")
  panelBody.addClass("panel-body");
  panelBody.attr("id", ratingString);

  var h4 = $("<h4>");
  h4.addClass("panel-title");
  h4.append(ahref);

  var panelHeading = $("<div>");
  panelHeading.addClass("panel-heading");
  panelHeading.append(h4);

  var panelDefault = $("<div>");
  panelDefault.addClass("panel panel-default");
  panelDefault.append(panelHeading);

  var collapse = $("<div>");
  collapse.addClass("panel-collapse collapse in");
  collapse.append(panelBody);

  panelDefault.append(collapse);
  thubnailsObj.append(panelDefault);

  return panelBody;
}
