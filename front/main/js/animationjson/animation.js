let animationDigital = document.querySelector('#animationDigital')
let animationWide = document.querySelector('#animationWide')
let animationPhoto = document.querySelector('#animationPhoto')
let animationCup = document.querySelector('#animationCup')
let animationPost = document.querySelector('#animationPost')

let animation1 = bodymovin.loadAnimation({
    container: animationDigital,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../files/data/animations/color_print.json' // путь к вашему JSON-файлу
});
let animation2 = bodymovin.loadAnimation({
    container: animationWide,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../files/data/animations/big_print.json' // путь к вашему JSON-файлу
});
let animation3 = bodymovin.loadAnimation({
    container: animationPhoto,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../files/data/animations/photo_print.json' // путь к вашему JSON-файлу
});
let animation4 = bodymovin.loadAnimation({
    container: animationCup,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../files/data/animations/cup_print.json' // путь к вашему JSON-файлу
});
let animation5 = bodymovin.loadAnimation({
    container: animationPost,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../files/data/animations/post_press.json' // путь к вашему JSON-файлу
});