/**
    Note: This code was run through a beautifier about midway through after
    I was unsatisfied with the tab length. Some of the programming here may
    not reflect my personal style.
**/

/* Represents one project in the project array. Contains information about said project,
   site/download links to said project, and images of the project.

   name(String):    The name of the project.
   desc(String):    The description of the project.
   img(String):     The background image shown behind the project details.
   dwds([[String, String]]):    A list of tuples, connecting a download text to a download link.
   exts([[String, String]]):    A list of external links to other sites relevant to the project, such as GitHub.
   gallery(String):             A folder path containing up to 6 images of the project.
*/
var projectTemplate = function(name, desc, img, dwds, exts, gallery) {

    //Name of the project.
    var n = name;

    //The description of the project. Will be put underneath the title.
    var de = desc;

    //Image to be used as the background image of the project.
    var i = img;

    //Whether or not the project in the website is expanded (200px height, full suite) or
    //retracted (50px height, just title)
    var expanded = true;

    //Increments the number of projects; used in id-ing various blocks.
    projectTemplate.instances++;

    //Accessors
    this.Name = function() { return n; };
    this.Desc = function() { return de; };
    this.ImgPath = function() { return i; };

    this.isExpanded = function() {
        return expanded;
    };
    this.toggleExpanded = function() {
        expanded = !expanded;
    };

    //Adds a project to the list. Is only called once, from the main method.
    this.printAsHTML = function() {
        document.getElementById("projects_list").insertAdjacentHTML("beforeend",
            prepHTMLInjection()
        );
    };

    //Creates HTML blocks where a variable number must be inserted;
    //HTML blocks are based on parameters given about the current object.
    //Returns a complete HTML block of the project.
    function prepHTMLInjection() {
        //Create variable number of download links based on size of download array.
        var downloadStack = "";
        for (var x = 0; x < dwds.length; x++) {
            downloadStack += "<div class=\"proj_downloadInst\"><img class=\"proj_downloadImg\" src=\"img/_icons/dwdIcon.png\" />" + dwds[x][0] + "<br /><h6>File Size</h6></div>"
        }

        var externalStack = "";
        for(var x = 0; x < exts.length; x++) {
            externalStack += "<div class=\"proj_extInst\">" + exts[x][0] + "</div>";
        }

        var galleryStack = "";
        for (var x = 1; x <= 6; x++) { //TEMP: Change 6 to adaptable max
            galleryStack += "<div class=\"proj_galleryImage\"><img src=\"img/" + gallery + "/img_" + x + ".png\" /></div>";
        }

        return "<div class=\"proj_item_wrapper\" id=\"p_iw_" + projectTemplate.instances + "\">    \
            <div class=\"proj_upborder\"></div>                 \
            <div class=\"proj_bkgd\">                           \
                <div class=\"proj_synopsis\">                   \
                    <h1 class=\"proj_title\">" + n + "</h1>     \
                    <h2 class=\"proj_desc\">" + de + "</h2>     \
                </div>                                          \
                <div class=\"proj_show_expanded\">              \
                    <div class=\"proj_vert_divide\"></div>      \
                    <div class=\"proj_links\">                  \
                    " + downloadStack + externalStack + "       \
                    </div>                                      \
                    <div class=\"proj_vert_divide\"></div>      \
                    <div class=\"proj_gallery\">                \
                    " + galleryStack + "                        \
                    </div>                                      \
                </div>                                          \
            </div>                                              \
         </div>";
    };
}

projectTemplate.instances = 0;

//This works with all functions tied to the project list, including adding projects to
//the list, varying the sizes of the said projects via clicking, and managing the gallery
//modals upon clicking an image.
$(function() {
    new projectTemplate("Asphodel Sky", "A very simple roguelike game with 2D graphics. Made in Java.", "../img/whatever.png", [
        ["Download .jar", "LINK"],
        ["Download .zip", "LINK"]
    ], [["Github", "LINK"]], null).printAsHTML();
    new projectTemplate("CoffeeChat", "Server and client software allowing versatile chat between multiple users. Comes with a set of user and admin commands. Made in Java.", "../img/whatever.png", [
        ["Download .jar", "LINK"],
        ["Download .zip", "LINK"]
    ], [], "coffeechat").printAsHTML();
    new projectTemplate("This Website", "An intuitive, easy-to-navigate compilation of all my projects, including this one.", "../img/whatever.png", [], [], null).printAsHTML();

    //Expands and collapses each project.
    $(".proj_bkgd").click(function(e) {
        if (!$(e.target).hasClass("proj_galleryImage") &&
            !$(e.target).hasClass("proj_downloadInst") &&
            !$(e.target).parent().hasClass("proj_galleryImage") && //Don't retract if image/download is clicked
            !$(e.target).parent().hasClass("proj_downloadInst") || //Don't retract if image/download is clicked
            $(this).css("height") == "50px") { //Ignore when expanding

            if ($(this).css("height") == "50px") { //Opens
                if($(window).width() > 1320) {
                    $(this).find(".proj_title").animate({
                        fontSize: "60px"
                    }, "slow");
                }

                if ($(window).width() <= 815) {
                    $(this).animate({
                        height: $(this).get(0).scrollHeight,
                        paddingTop: "20px"
                    }, 500);
                } else {
                    $(this).animate({
                        height: "300px",
                        paddingTop: "20px"
                    }, 500);
                }
                $(this).find(".proj_show_expanded").animate({
                    "opacity": "1"
                }, "slow");

            } else { //Closes
                $(this).animate({
                    height: "50px",
                    paddingTop: "0px"
                }, 500, function() {});
                $(this).find(".proj_show_expanded").animate({
                    opacity: "0"
                }, "slow");
                $(this).find(".proj_title").animate({
                    fontSize: "40px"
                }, "slow");
            }

        }
    });

/*    $(".proj_galleryImage").click(function() { //On gallery icon click

        var verticalBound = $(window).height() * 0.6;
        var horizontalBound = $(window).width() * 0.6;

        var aspectRatio = horizontalBound / verticalBound;

        //For the love of God, reorganize this mess
        $("#modal_picture").css("height", $(window).height() * 0.6);
        $("#modal_picture").css("width", $(window).width() * 0.6);
        $("#modal_picture").css("margin-top", $(window).height() * 0.2);
        $("#modal_picture").css("margin-left", $(window).width() * 0.2);
        $("#modal_picture").css({
            "background-image": "url(" + $(this).find("img").attr("src") + ")",
            "background-repeat": "no-repeat",
            "background-attachment": "fixed",
            "background-position": "center center"
        });

        $("#modal_wrapper").css("display", "block"); //Display modal
    });

    $("#modal_wrapper").click(function() { //Close modal
        $("#modal_wrapper").css("display", "none");
    }); */
});
