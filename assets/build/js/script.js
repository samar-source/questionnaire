$(document).ready(function() {


    // $('.body').mCustomScrollbar({
        // scrollEasing:"easeOut",
        // mouseWheel: { scrollAmount: '300' },
        // autoDraggerLength: false
    // });


  // $(function(){
    $(".menu__link").click(function() {
      var target = $(this).attr("href");
      var navHeight = $("#menu").outerHeight();
      $("html, body").animate({
        scrollTop: $(target).offset().top - navHeight + 5}, 600);
      if (window.innerWidth < 768) {
        $(".menu__list").slideToggle(500);
        $(".menu__list").toggleClass('open-menu');
        $('.menu__mobile-icon').toggleClass('open-menu');
      }
      return false;
    });
    //--Burger mobile icon
    $('.menu__mobile-icon').click(function(){
      // changing the status of the menu icon
      $('.menu__mobile-icon').toggleClass('open-menu');
      // show / hide the mobile menu
      $('.menu__list').toggleClass('open-menu');

      
    });
  // }


    

// 
//--Select field
    //--Get the years function
  // $(function(){
    function getYears() {
        const select = document.querySelector('select');
        let inner = ''
        for (let i = 2020; i >= 1920; i--) {
            inner += `<option>${i}</option>`;
        }
        select.innerHTML = inner;
    }

    //--Creating a custom select
    $('.select').each(function() {
        //--Get the years
        getYears();

        //--Setting the values of variables
        var $this = $(this),
          selectOption = $this.find('option'),
          selectOptionLength = selectOption.length,
          selectedOption = selectOption.filter(':selected'),
          dur = 500;
      
        $this.hide();
        $this.wrap('<div class="select"></div>');

        //--Creating a 'placeholder' with the text 'Год рождения' and we give him a class '.select__gap'
        $('<div>', {
          class: 'select__gap',
          text: 'Год рождения'
        }).insertAfter($this);
        var selectGap = $this.next('.select__gap'),
          caret = selectGap.find('.caret');

        //--Creating a list for the options items and we give him a class '.select__list'
        $('<ul>', {
          class: 'select__list'
        }).insertAfter(selectGap);
        var selectList = selectGap.next('.select__list');

        //--Creating option items and we give him a class '.select__item'
        for (var i = 0; i < selectOptionLength; i++) {
          $('<li>', {
              class: 'select__item',
              html: $('<span>', {
                text: selectOption.eq(i).text()
              })
            })
            .attr('data-value', selectOption.eq(i).val())
            .appendTo(selectList);
        }
        var selectItem = selectList.find('li');
      
        //--A list opens with the ability to select its element
        selectList.slideUp(0);
        selectGap.on('click', function() {
          if (!$(this).hasClass('on')) {
            $(this).addClass('on');
            selectList.slideDown(dur);
            //--By clicking on an item in the list, send it to its place 'placeholder'
            selectItem.on('click', function() {
              var chooseItem = $(this).data('value');
              $('select').val(chooseItem).attr('selected', 'selected');
              selectGap.text($(this).find('span').text());
              selectGap.addClass('choose');
              selectList.slideUp(dur);
              selectGap.removeClass('on');
            });
          } else {
            $(this).removeClass('on');
            selectList.slideUp(dur);
          }
        });
        
    });

    //--Connecting the scroll styling plugin 'malihu-custom-scrollbar-plugin' for custom select
    $('.select__list').mCustomScrollbar();
  // }
    


// ---------------------ПЕРЕДЕЛАТЬ!!!!!!!!!!!!!!!!!!!!
// 
//--JS level. Range Slider

let sheet = document.createElement('style');
let $rangeInput = $('#range');

document.body.appendChild(sheet);


var curValPrev = 50;
function getRange (el) {  
  let curVal = el.value;
  let val = 0;
  console.log(curVal + " /////");

  if (curVal == 75) {
    curVal = 100;
    document.getElementById("range").step = 50;
  } 
  // else if (curVal == 75) {
  //   curVal = 50;
  //   document.getElementById("range").step = 50;
  // }
  document.getElementById("range").step = 25;

  // if (curVal == 75 && curValPrev == 50) {
  //   curVal = 100;
  //   document.getElementById("range").step = 50;
  // } 
  // else if (curVal == 75 && curValPrev == 100) {
  //   curVal = 50;
  //   document.getElementById("range").step = 50;
  // }
  // document.getElementById("range").step = 25;

  if (curVal == 0) {
    val = 1;
    console.log(val);
  } else if (curVal == 25) {
    val = 2;
    console.log(val);
  } else if (curVal == 50) {
    val = 3;
    console.log(val);
  } else if (curVal == 100) {
    val = 4;
    console.log(val);
  }
  
  // Set active label
  $('.range-labels li').removeClass('active selected');
  
  let curLabel = $('.range-labels').find('li:nth-child(' + val + ')');
  // console.log("===" + curLabel);
  
  curLabel.addClass('active selected');
  curLabel.prevAll().addClass('selected');

  curValPrev = curVal;

  return curVal;
}


$rangeInput.on('input', function () {
  let rule = getRange(this) + "%";
  // console.log(this.value + " /////");
  console.log(rule + " %%%");

  let stopsCount = $("#range-triangle-mask linearGradient stop").length;

  for (var i = 0; i < stopsCount; i++) {
    $("#range-triangle-mask linearGradient stop").eq([i]).attr({offset: rule});
  }
});



// -----------------^^^^^^ПЕРЕДЕЛАТЬ!!!!!!!!!!!!!!!!!!!!
// -----------------------------------------------------
 
// 
//--Textarea. Auto Resize
  $('.desc').on('input', function(){
    this.style.height = '180px';
    this.style.height = (this.scrollHeight + 6) + 'px'; 
  });
})