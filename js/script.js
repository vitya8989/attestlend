// окрашиваем хедер при скролле
const header = document.querySelector('.header');

if (header) {
    if (window.pageYOffset > 0) {
        header.classList.add('scroll');
    } else {
        header.classList.remove('scroll');
    }
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 0) {
            header.classList.add('scroll');
        } else {
            header.classList.remove('scroll');
        }
    });
}

// маска телефона
$('.js_input_tel').inputmask('+7 (999) 999-99-99');

// счетчик дней
const count = document.querySelector('.js_count');

function num_word(value, words){
    value = Math.abs(value) % 100;
    var num = value % 10;
    if(value > 10 && value < 20) return words[2];
    if(num > 1 && num < 5) return words[1];
    if(num == 1) return words[0];
    return words[2];
}

if (count) {
    const date1 = new Date("10/10/2010");
    const date2 = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay);
    const daysWord = num_word(diffInDays, ['день', 'дня', 'дней']);

    diffInDaysArr = diffInDays.toString().split('');
    diffInDaysArr.forEach((num) => {
        count.insertAdjacentHTML('beforeend', `<span>${num}</span>`)
    });
    count.insertAdjacentHTML('afterend', ` ${daysWord}`);
}

//Валидация и отправка форм
const phoneInputs = document.querySelectorAll('.js_input_tel');

if (phoneInputs.length > 0) {
    phoneInputs.forEach((phone) => {
        phone.addEventListener('focus', () => {
            if (phone.classList.contains('error')) {
                phone.classList.remove('error');
            }
        })
    });
}

function validatePhone (form) {
    const phone = form.querySelector('.js_input_tel');
    if (phone.value.indexOf('_') !== -1 || phone.value === '') {
        phone.classList.add('error');
        return false;
    } else {
        return true;
    }
}


Fancybox.bind("a[data-fancybox]", {});

if (document.querySelector('.certificate__slider')) {
    new Swiper('.certificate__slider', {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 20,
        lazy: true,
        navigation: {
            nextEl: ".certificate_slider__next",
            prevEl: ".certificate_slider__prev",
        },
        pagination: {
            el: '.certificate_slider__pagination',
            type: 'bullets',
            clickable: true,
        },
        breakpoints: {
            768: {
                spaceBetween: 40,
                slidesPerView: 2,
            },
            1024: {
                spaceBetween: 40,
                slidesPerView: 3,
            },
            1400: {
                spaceBetween: 40,
                slidesPerView: 4,
            },
        },
    });
}

if (document.querySelector('.partners__slider')) {
    new Swiper('.partners__slider', {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 64,
        navigation: {
            nextEl: ".partners_slider__next",
            prevEl: ".partners_slider__prev",
        },
        pagination: {
            el: '.partners_slider__pagination',
            type: 'bullets',
            clickable: true,
        },
    });
}

if (document.querySelector('.reviews__slider')) {
    new Swiper('.reviews__slider', {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 20,
        lazy: true,
        navigation: {
            nextEl: ".reviews_slider__next",
            prevEl: ".reviews_slider__prev",
        },
        pagination: {
            el: '.reviews_slider__pagination',
            type: 'bullets',
            clickable: true,
        },
        breakpoints: {
            768: {
                spaceBetween: 40,
                slidesPerView: 2,
            },
            1024: {
                spaceBetween: 40,
                slidesPerView: 3,
            },
            1400: {
                spaceBetween: 40,
                slidesPerView: 4,
            },
        },
    });
}

const openPopupBtns = document.querySelectorAll('.js_open_callback');

if (openPopupBtns.length > 0) {
    const callbackPopup = document.querySelector('.callback');
    const callbackClose = callbackPopup.querySelectorAll('.js_callback_close');
    const callbackContents = callbackPopup.querySelectorAll('.callback__content');

    openPopupBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            callbackPopup.classList.add('show');
            document.body.style.overflow = 'hidden';
            callbackContents.forEach((content) => {
                if (content.dataset.content === 'form') {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        })
    })
    callbackClose.forEach((close) => {
        close.addEventListener('click', () => {
            callbackPopup.classList.remove('show');
            document.body.style.overflow = 'visible';
        });
    });
    callbackPopup.addEventListener('click', (e) => {
        if (!e.target.closest('.callback__body')) {
            callbackPopup.classList.remove('show');
            document.body.style.overflow = 'visible';
        }
    });

    const forms = document.querySelectorAll('.js_form');

    if (forms.length > 0) {
        forms.forEach((form) => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                let valid = validatePhone(form);

                if (valid) {
                    form.reset();
                    if (!callbackPopup.classList.contains('show')) {
                        callbackPopup.classList.add('show');
                        document.body.style.overflow = 'hidden';
                    }
                    callbackContents.forEach((content) => {
                        if (content.dataset.content === 'thanks') {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });

                    // let response = await fetch('form-action.php', {
                    //     method: 'POST',
                    //     body: new FormData(form)
                    // });
                    // if (response.ok) {
                    //     form.reset();
                    //     if (!callbackPopup.classList.contains('show')) {
                    //         callbackPopup.classList.add('show');
                    //         document.body.style.overflow = 'hidden';
                    //     }
                    //     callbackContents.forEach((content) => {
                    //         if (content.dataset.content === 'thanks') {
                    //             content.classList.add('active');
                    //         } else {
                    //             content.classList.remove('active');
                    //         }
                    //     });
                    // } else {
                    //     alert('Произошла ошибка отправки, попробуйте еще раз!');
                    // }
                }
            });
        });
    }
}