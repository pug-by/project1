$(document).ready(function() {

    $('.open-slider').click(function(){
        $('.slider-body').toggleClass('open');
    })
    $('.slider-close').click(function(){
        $('.slider-body').toggleClass('open');
    })
    $('.selected').click(function(){
        $(this).closest('.tab-on-map').addClass('open');
    })
    $('.hide-tab').click(function(){
        $(this).closest('.open').removeClass('open');
    })

    // tabs
    $(document).on('click', 'ul#object-detail li a', function(event) {
        var idContent = $(this).data("linked"),
            tabContent = $('.tab-on-map');



        $("ul#object-detail li").removeClass("selected");
        $(this).parent().addClass("selected");
        $('.tab-for-detail').hide();
        $(idContent).show();
        return false;
    });
    // hide tabs

}); 