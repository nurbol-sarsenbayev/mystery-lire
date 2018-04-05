$(document).ready(function() {

    var $wnd = $(window);
    var $top = $(".page-top");
    var $html = $("html, body");
    var $header = $(".header");
    var $menu = $(".main-menu");
    var utms = parseGET();
    var headerHeight = 105;
    var $hamburger = $(".hamburger");

    if(utms && Object.keys(utms).length > 0) {
        window.sessionStorage.setItem('utms', JSON.stringify(utms));
    } else {
        utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
    }

    $wnd.scroll(function() { onscroll(); });

    var onscroll = function() {
        if($wnd.scrollTop() > $wnd.height()) {
            $top.addClass('active');
        } else {
            $top.removeClass('active');
        }

        if($wnd.scrollTop() > 0) {
            $header.addClass('scrolled');
        } else {
            $header.removeClass('scrolled');
        }

        var scrollPos = $wnd.scrollTop() + headerHeight;

        $menu.find(".link").each(function() {
            var link = $(this);
            var id = link.attr('href');
            
            if(id.length > 1 && id.charAt(0) == '#' && $(id).length > 0) {
                var section = $(id);
                var sectionTop = section.offset().top;

                if(sectionTop <= scrollPos && (sectionTop + section.height()) >= scrollPos) {
                    link.addClass('active');
                } else {
                    link.removeClass('active');
                }
            }
        });
    }

    onscroll();

    $(".main-menu .link").click(function(e) {
        var $href = $(this).attr('href');
        if($href.length > 1 && $href.charAt(0) == '#' && $($href).length > 0) {
            e.preventDefault();
            var top = $($href).offset().top - headerHeight;
            $html.stop().animate({ scrollTop: top }, "slow", "swing");
        }

        if($wnd.width() <= 991) {
            toggleHamburger();
        }
    });

    $top.click(function() {
        $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
    });

    $("input[type=tel]").mask("+7 (999) 999 99 99", {
        completed: function() {
            $(this).removeClass('error');
        }
    }); 

    $("input:required, textarea:required").keyup(function() {
        var $this = $(this);
        if($this.attr('type') != 'tel') {
            checkInput($this);
        }
    });

    $hamburger.click(function() {
        toggleHamburger();
        return false;
     });  
  
     function toggleHamburger() {
        $this = $hamburger;
        if(!$this.hasClass("is-active")) {
           $this.addClass('is-active');
           $menu.slideDown('700');
        } else {
           $this.removeClass('is-active');
           $menu.slideUp('700');
        }
     }

    $(document).on('closing', '.remodal', function (e) {
        $(".remodal .input").removeClass("error");
    });

    $(".ajax-submit").click(function(e) {
        e.preventDefault();
        
        var $form = $(this).closest('form');
        var $requireds = $form.find(':required');
        var formValid = true;

        $requireds.each(function() {
            $elem = $(this);

            if(!$elem.val() || !checkInput($elem)) {
                $elem.addClass('error');
                formValid = false;
            }
        });

        var data = $form.serialize();

        if(Object.keys(utms).length > 0) {
            for(var key in utms) {
                data += '&' + key + '=' + utms[key];
            }
        } else {
            data += '&utm=Прямой переход'
        } 

        if(formValid) {
            $.ajax({
                type: "POST",
                url: "/mail.php",
                data: data
            }).done(function() {                   
            });

            $requireds.removeClass('error');
            $form[0].reset();
            window.location = "./thanks.html";
        }
    });


});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkInput($input) {
    if($input.val()) {
        if($input.attr('type') != 'email' || validateEmail($input.val())) {
            $input.removeClass('error');
            return true;
        }
    }
    return false;
}
    
function parseGET(url){
    var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    if(!url || url == '') url = decodeURI(document.location.search);
     
    if(url.indexOf('?') < 0) return Array(); 
    url = url.split('?'); 
    url = url[1]; 
    var GET = {}, params = [], key = []; 
     
    if(url.indexOf('#')!=-1){ 
        url = url.substr(0,url.indexOf('#')); 
    } 
    
    if(url.indexOf('&') > -1){ 
        params = url.split('&');
    } else {
        params[0] = url; 
    }
    
    for (var r=0; r < params.length; r++){
        for (var z=0; z < namekey.length; z++){ 
            if(params[r].indexOf(namekey[z]+'=') > -1){
                if(params[r].indexOf('=') > -1) {
                    key = params[r].split('=');
                    GET[key[0]]=key[1];
                }
            }
        }
    }

    return (GET);    
};