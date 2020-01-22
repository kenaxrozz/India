window.addEventListener('DOMContentLoaded', function () {

    'use strict';

    //Tabs ==================================================
    let info = document.querySelector('.info-header');
    let tab = document.querySelectorAll('.info-header-tab');
    let tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }
    // Цикл начинается с 1
    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // timer ============================================

    // пишем deadline
    let deadline = '2020-02-15';
    // промежуток времени между сейчас и deadline
    function getTimeRemaining(endtime) {
        // тех. пер. t время переводим в милисекунды 
        // parse превращает дату в милисек 
        // Date.parse(new Date()) конструкция время сейчас
        // когда польз-ль заходит на сайт
        let t = Date.parse(endtime) - Date.parse(new Date());

        // считаю кол-во секунд
        // Часовой пояс Москва let a = (t-(3*60*60*1000));
        // применяю .toFixed() а не Math.floor() (с ним не работает ноль)
        let seconds = ((t / 1000) % 60).toFixed();
        // кол-во целых минут
        let minutes = (((t - 30000) / 1000 / 60) % 60).toFixed();
        // или 
        let hours = ((((t - 1000 * 30) / 1000 / 60 / 60) % 24)).toFixed();
        // если нужны дни
        let days = Math.floor((t / 1000 / 60 / 60 / 24) % 365);
        // несколько переменных экспортировать не можем
        // поэтому эспортируем весь объект, т.к. в {}
        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
            'days': days
        };
    }

    // function превращает статичную верстку в динамичную
    // id div ; endtime примит значение deadline
    function setClock(id, endtime) {
        // function выставляет и запускает часы
        let timer = document.getElementById(id);
        let days = timer.querySelector('.days');
        let hours = timer.querySelector('.hours');
        let minutes = timer.querySelector('.minutes');
        let seconds = timer.querySelector('.seconds');

        let timeInterval = setInterval(updateClock, 1000);

        // function обновляет часы и записывает в верстку
        function updateClock() {
            let t = getTimeRemaining(endtime);
            days.textContent = t.days;

            if (hours.textContent <= 10 && hours.textContent >= 1) {
                hours.textContent = '0' + t.hours;
            } else if (hours.textContent >= 10 || hours.textContent <= 24) {
                hours.textContent = t.hours;
            }

            if (minutes.textContent <= 9 && minutes.textContent >= 0) {
                minutes.textContent = '0' + t.minutes;
            } else if (minutes.textContent >= 10 || minutes.textContent <= 59) {
                minutes.textContent = t.minutes;
            }

            if (seconds.textContent <= 10 && seconds.textContent >= 1) {
                seconds.textContent = '0' + t.seconds;
            } else if (seconds.textContent >= 10 || seconds.textContent <= 58) {
                seconds.textContent = t.seconds;
            }

            // остановка часов
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('timer', deadline);

    // Modal (Модальное окно) ===================================

    let more = document.querySelector('.more');
    let overlay = document.querySelector('.overlay');
    let close = document.querySelector('.popup-close');

    // открытие мод.окна
    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('btn-modal')) {
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    // закрытие мод.окна
    close.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Form =============================================

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form');
    let input = form.getElementsByTagName('input');
    // создаем элемент для message
    let statusMessege = document.createElement('div');

    statusMessege.classList.add('status');
    // добавляем обработчик события
    // устанавливается на форму, а не на кнопку
    form.addEventListener('submit', function (event) {
        // отменяем обновление страницы при отправке
        event.preventDefault();
        // выводим div в форму
        // оповещаем пользователя как прошел запрос
        form.appendChild(statusMessege);

        // создаем запрос, чтобы отправить данные на сервер
        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');

        // чтобы был JSON пишем
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        // получение данных отправленных пользователем
        // здесь данные от пользователя
        let formData = new FormData(form);

        // данные с формы преобразуем в JSON
        // для этого создаем промежуточный объект
        let obj = {};
        formData.forEach(function (value, key) {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        request.send(json);

        // чтобы пользователь видил результат запроса
        request.addEventListener('readystatechange', function () {
            if (request.readyState < 4) {
                statusMessege.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                // можно поставить анимацию с завершением
                // или прогресбар
                statusMessege.innerHTML = message.success;
            } else {
                statusMessege.innerHTML = message.failure;
            }
        });
        // очищаем форму
        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    });

    // button form ===========================================


    let buttonForm = document.querySelector('form');
    buttonForm.addEventListener('submit', function (event) {

        event.preventDefault();

        buttonForm.appendChild(statusMessege);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');

        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        let formData = new FormData(form);

        let obj = {};
        formData.forEach(function (value, key) {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        request.send(json);

        request.addEventListener('readystatechange', function () {
            if (request.readyState < 4) {
                statusMessege.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessege.innerHTML = message.success;
            } else {
                statusMessege.innerHTML = message.failure;
            }
        });
        // очищаем форму
        buttonForm.reset();
    });

    // slider ===============================================

    let slideIndex = 1;
    let slides = document.querySelectorAll('.slider-item');
    let prev = document.querySelector('.prev');
    let next = document.querySelector('.next');
    let dotsWrap = document.querySelector('.slider-dots');
    let dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);

    function showSlides(n) {

        // slider переключался по кругу
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        // сначала скрываем лишние слайды
        slides.forEach((item) => item.style.display = 'none');

        // убираем активную dots
        dots.forEach((item) => item.classList.remove('dot-active'));
        // показываем нужный слайд
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }
    // увеличивает параметр slideIndex
    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    // определяет текущий слайд и устанавливает его
    // при клике на dot 
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function () {
        plusSlides(-1);
    });

    next.addEventListener('click', function () {
        plusSlides(1);
    });

    //реализуем dots через делегирование
    // обязательно (event), т.к. делегирование
    dotsWrap.addEventListener('click', function (event) {
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i - 1]) {
                currentSlide(i);
            }
        }
    });

    // Calc ==========================================================

    let persons = document.querySelectorAll('.counter-block-input')[0];
    let restDays = document.querySelectorAll('.counter-block-input')[1];
    let place = document.getElementById('select');
    let totalValue = document.getElementById('total');
    // переменные куда будут вносится данные пользователя
    let personsSum = 0;
    let daysSum = 0;
    let total = 0;

    totalValue.innerHTML = 0;
    // нельзя использовать => тк есть контекст
    persons.addEventListener('change', function () {
        personsSum = +this.value;
        total = (daysSum + personsSum) * 4000;

        if (restDays.value == '' || persons.value == '' ||
            restDays.value == 0 || persons.value == 0) {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    restDays.addEventListener('change', function () {
        daysSum = +this.value;
        total = (daysSum + personsSum) * 4000;

        if (persons.value == '' || restDays.value == '' ||
            persons.value == 0 || restDays.value == 0) {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    place.addEventListener('change', function () {
        if (restDays.value == '' || persons.value == '' ||
            restDays.value == 0 || persons.value == 0) {
            totalValue.innerHTML = 0;
        } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });


});