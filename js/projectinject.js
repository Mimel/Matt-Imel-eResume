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
var projectTemplate = function (name, desc, img, dwds, exts, gallery) {
    "use strict";
    
    //Name of the project.
    var n = name,

    //The description of the project. Will be put underneath the title.
    de = desc,

    //Image to be used as the background image of the project.
    i = img,

    //Whether or not the project in the website is expanded (200px height, full suite) or
    //retracted (50px height, just title)
    expanded = true,

    //The position of this element in the webpage, 0 being at the top.
    instance = projectTemplate.instances;

    //Increments the number of projects; used in id-ing various blocks.
    projectTemplate.instances += 1;

    //Accessors
    this.Name = function () { return n; };
    this.Desc = function () { return de; };
    this.ImgPath = function () { return i; };

    this.isExpanded = function () {
        return expanded;
    };
    this.toggleExpanded = function () {
        expanded = !expanded;
    };

    //Creates HTML blocks where a variable number must be inserted;
    //HTML blocks are based on parameters given about the current object.
    //Returns a complete HTML block of the project.
    function prepHTMLInjection() {
        //Create variable number of download links based on size of download array.
        var downloadStack = "";
        for (var x = 0; x < dwds.length; x++) {
            downloadStack += "<a target=\"_blank\" href=" + dwds[x][1] + " class=\"proj_link_disablable\"><div class=\"proj_downloadInst\"><img class=\"proj_downloadImg\" src=\"img/_icons/dwdIcon.png\" />" + dwds[x][0] + "<br /><h6>File Size</h6></div></a>"
        }

        var externalStack = "";
        for(var x = 0; x < exts.length; x++) {
            externalStack += "<a target=\"_blank\" href=\"" + exts[x][1] + "\" class=\"proj_link_disablable\"><div class=\"proj_extInst\">" + exts[x][0] + "</div></a>";
        }

        var galleryStack = "";
        for (var x = 1; x <= 1; x++) { //TEMP: Change 6 to adaptable max
            galleryStack += "<div class=\"proj_galleryImage\"><img src=\"img/" + gallery + "/img_" + x + ".png\" /></div>";
        }

        return "<div class=\"proj_item_wrapper\" id=\"p_iw_" + projectTemplate.instances + "\">    \
            <div class=\"proj_upborder\"></div>                 \
            <div class=\"proj_bkgd\" style=\"background-image:url(" + img + ")\">                           \
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
    
    //Adds a project to the list. Is only called once, from the main method.
    this.printAsHTML = function () {
        document.getElementById("projects_list").insertAdjacentHTML("beforeend",
            prepHTMLInjection()
                                                                   );
    };
}

projectTemplate.instances = 0;

//This works with all functions tied to the project list, including adding projects to
//the list, varying the sizes of the said projects via clicking, and managing the gallery
//modals upon clicking an image.
$(function() {
    //$(".proj_downloadInst").fitText();
    
    //List of projects.
    new projectTemplate("Asphodel Sky", "A very simple roguelike game with 2D graphics. Made in Java.", "img/asphodelsky/Background.png", [
        ["Download .jar", "PLACEHOLDER"],
        ["Download .zip", "downloads/AsphodelSky.zip"]
    ], [["Github", "https://github.com/Mimel/AsphodelSky"]], "asphodelsky").printAsHTML();
    new projectTemplate("CoffeeChat", "Server and client software allowing versatile chat between multiple users. Comes with a set of user and admin commands. Made in Java.", "img/coffeechat/Background.png", [
        ["Download .jar", "PLACEHOLDER"],
        ["Download .zip", "downloads/CoffeeChat.zip"]
    ], [["Github", "https://github.com/CoffeeChat"]], "coffeechat").printAsHTML();
    new projectTemplate("This Website", "An intuitive, easy-to-navigate compilation of all my projects, including this one.", "../img/whatever.png", [
        ["Download .zip", "downloads/Matt-Imel-ePortfolio.zip"]
    ], [["Github", "https://github.com/Mimel/Matt-Imel-eResume"]], null).printAsHTML();
    
    //END INIT

    //Expands and collapses each project.
    //TODO double clicking on project is problematic.
    $(".proj_bkgd").click(function(e) {
        //Do not reanimate while block is animating.
        if($(this).hasClass("velocity-animating")) { console.log("Ayy..."); return false; }

        if (!$(e.target).hasClass("proj_galleryImage") &&
            !$(e.target).hasClass("proj_downloadInst") &&
            !$(e.target).parent().hasClass("proj_galleryImage") && //Don't retract if image/download is clicked
            !$(e.target).parent().hasClass("proj_downloadInst") || //Don't retract if image/download is clicked
            $(this).css("height") == "50px") { //Ignore when expanding
            
            if ($(this).css("height") == "50px") { //Opens
                
                if($(window).width() > 1320) {
                    $(this).find(".proj_title").velocity({
                        fontSize: "60px"
                    }, "slow");
                }

                if ($(window).width() <= 815) {
                    $(this).velocity({
                        height: $(this).get(0).scrollHeight,
                        paddingTop: "20px"
                    }, 500);
                    
                } else {
                    $(this).velocity({
                        height: "300px",
                        paddingTop: "20px"
                    }, 500);
                }
                $(this).find(".proj_show_expanded").velocity({
                    "opacity": "1"
                }, "slow");
                
                //Enable links.
                $(this).find(".proj_link_disablable").css({
                    "display": "inline"
                });

            } else { //Closes
                
                $(this).velocity({
                    height: "50px",
                    paddingTop: "0px"
                }, 500, function() {
                    $(this).find(".proj_link_disablable").css({
                        "display": "none"
                    });
                });

                $(this).find(".proj_show_expanded").velocity({
                    opacity: "0"
                }, "slow");
                $(this).find(".proj_title").velocity({
                    fontSize: "40px"
                }, "slow");
            }

        }
    });

    ///MODAL///
    var currentImage;

    function displayImageModal(element) {
        var verticalAllowance = $(window).height() * 0.7;
        var horizontalAllowance = $(window).width() * 0.7;

        var verticalSize = $(element).find("img").get(0).naturalHeight;
        var horizontalSize = $(element).find("img").get(0).naturalWidth;

        var reductionFactor;

        if(verticalSize <= verticalAllowance && horizontalSize <= horizontalAllowance) {
            reductionFactor = 1;
        } else {
            reductionFactor = Math.max(verticalSize/verticalAllowance, horizontalSize/horizontalAllowance);
        }

        var verticalCorrected = verticalSize/reductionFactor;
        var horizontalCorrected = horizontalSize/reductionFactor;

        $("#modal_picture").css({
            "height": verticalCorrected,
            "width": horizontalCorrected,
            "margin-top": (($(window).height() - verticalCorrected)/2),
            "margin-left": (($(window).width() - horizontalCorrected)/2),
            "background-image": "url(" + $(element).find("img").attr("src") + ")",
            "background-size": (horizontalCorrected + "px " + verticalCorrected + "px"),
            "background-repeat": "no-repeat",
            "background-attachment": "fixed",
            "background-position": "center center"
        });

        $("#modal_wrapper").css("display", "block"); //Display modal
    }

    $(".proj_galleryImage").click(function() { //On gallery icon click
        //A little convoluted; This if-statement makes sure that the modal doesn't
        //open when the project tab is retracted; otherwise, the modal would still
        //open if the user clicked where the icon would be.
        if($(this).parent().parent().parent().height() > 50) {

            currentImage = this;
            displayImageModal(this);

            if(currentImage.previousSibling && currentImage.previousSibling.nodeType != 1) {
                $("#modal_left").css("display", "none");
            }
            if(currentImage.nextSibling && currentImage.nextSibling.nodeType != 1) {
                $("#modal_right").css("display", "none");
            }
        }
    });

    $("#modal_left").click(function() {
        currentImage = currentImage.previousSibling;
        displayImageModal(currentImage);

        if(currentImage.previousSibling && currentImage.previousSibling.nodeType != 1) {
            $("#modal_left").css("display", "none");
        }
        if(currentImage.nextSibling && currentImage.nextSibling.nodeType == 1) {
            $("#modal_right").css("display", "block");
        }
    });

    $("#modal_right").click(function() {
        currentImage = currentImage.nextSibling;
        displayImageModal(currentImage);

        if(currentImage.nextSibling && currentImage.nextSibling.nodeType != 1) {
            $("#modal_right").css("display", "none");
        }
        if(currentImage.previousSibling && currentImage.previousSibling.nodeType == 1) {
            $("#modal_left").css("display", "block");
        }
    });

    //Closes the modal if the outer region (i.e. not the picture or description)
    //is clicked.
    $("#modal_wrapper").click(function() {
        $("#modal_wrapper").css("display", "none");

        $("#modal_left").css("display", "block");
        $("#modal_right").css("display", "block");
    }).children().click(function(e) {
        return false;
    });
});
