(function() {


    const links = document.querySelectorAll('.aside .nav a');
    // console.log(links);

    function handleScroll(e) {
        let fromTop = e.currentTarget.scrollY
        // console.log(fromTop);
        links.forEach( link => {
            let section = document.querySelector(link.hash);
            // console.log(section.offsetTop);
            // console.log(section.offsetHeight);
            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        })
    }

    window.addEventListener('scroll', handleScroll);

    //animate
    let main =  document.querySelector('.main')
    main.classList.add('animated', 'bounceInLeft');

    main.addEventListener('animationend', function() {
        main.classList.remove('animated', 'bounceInLeft');
    });





})();