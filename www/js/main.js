/**
 * Главный файл JavaScript для сайта Игоря Унгурянова
 * Содержит всю логику работы сайта: переключение темы, переключение языка,
 * мобильное меню и фильтрацию портфолио
 */

document.addEventListener('DOMContentLoaded', function() {
    // ==================
    // Мобильное меню
    // ==================
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Открытие/закрытие мобильного меню
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        // Изменение иконки меню
        const icon = menuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Закрытие меню при клике на пункт меню
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Закрытие меню при клике вне меню
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // ==================
    // Переключение темы
    // ==================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'dark'; // По умолчанию темная тема
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Устанавливаем новую тему
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Меняем иконку
        if (newTheme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // ==================
    // Переключение языков
    // ==================
    const languageSelect = document.getElementById('languageSelect');

    // Проверяем сохраненный язык
    const savedLanguage = localStorage.getItem('language') || 'ru';
    setLanguage(savedLanguage);
    languageSelect.value = savedLanguage;

    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        setLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);

        // Обновляем тексты на странице в соответствии с выбранным языком
        updatePageTexts(selectedLanguage);
    });

    function setLanguage(language) {
        // Скрываем все языковые варианты меню
        document.querySelectorAll('[class^="lang-"]').forEach(el => {
            el.style.display = 'none';
        });

        // Показываем меню на выбранном языке
        document.querySelectorAll('.lang-' + language).forEach(el => {
            el.style.display = '';
        });
    }

    function updatePageTexts(language) {
        // Объект с текстами на разных языках
        const texts = {
            'hero': {
                'ru': {
                    'title': 'Игорь Унгурянов',
                    'subtitle': '3D Environment Artist',
                    'button': 'Смотреть работы'
                },
                'en': {
                    'title': 'Igor Unguryanov',
                    'subtitle': '3D Environment Artist',
                    'button': 'View Works'
                },
                'zh': {
                    'title': '伊戈尔·温古里亚诺夫',
                    'subtitle': '3D环境艺术家',
                    'button': '查看作品'
                }
            },
            'about': {
                'ru': {
                    'title': 'Обо мне',
                    'subtitle': '3D Environment Artist с опытом работы в игровой индустрии',
                    'text1': 'Я специализируюсь на создании реалистичных и стилизованных окружений для игр и визуализаций. Мой опыт включает работу с различными 3D-пакетами и игровыми движками, что позволяет мне создавать высококачественные ассеты и окружения для различных проектов.',
                    'text2': 'Я стремлюсь постоянно совершенствовать свои навыки и следить за последними тенденциями в индустрии, чтобы создавать впечатляющие и технически оптимизированные работы.'
                },
                'en': {
                    'title': 'About Me',
                    'subtitle': '3D Environment Artist with experience in the gaming industry',
                    'text1': 'I specialize in creating realistic and stylized environments for games and visualizations. My experience includes working with various 3D packages and game engines, allowing me to create high-quality assets and environments for various projects.',
                    'text2': 'I strive to constantly improve my skills and keep up with the latest industry trends to create impressive and technically optimized works.'
                },
                'zh': {
                    'title': '关于我',
                    'subtitle': '拥有游戏行业经验的3D环境艺术家',
                    'text1': '我专注于为游戏和可视化创建逼真和风格化的环境。我的经验包括使用各种3D软件包和游戏引擎，使我能够为各种项目创建高质量的资产和环境。',
                    'text2': '我努力不断提高自己的技能并跟上行业最新趋势，以创建令人印象深刻且技术上优化的作品。'
                }
            },
            'portfolio': {
                'ru': {
                    'title': 'Портфолио',
                    'all': 'Все',
                    'environments': 'Окружения',
                    'props': 'Пропсы',
                    'concepts': 'Концепты'
                },
                'en': {
                    'title': 'Portfolio',
                    'all': 'All',
                    'environments': 'Environments',
                    'props': 'Props',
                    'concepts': 'Concepts'
                },
                'zh': {
                    'title': '作品集',
                    'all': '全部',
                    'environments': '环境',
                    'props': '道具',
                    'concepts': '概念'
                }
            },
            'blog': {
                'ru': {
                    'title': 'Блог',
                    'readmore': 'Читать далее'
                },
                'en': {
                    'title': 'Blog',
                    'readmore': 'Read More'
                },
                'zh': {
                    'title': '博客',
                    'readmore': '阅读更多'
                }
            },
            'contact': {
                'ru': {
                    'title': 'Контакты',
                    'subtitle': 'Свяжитесь со мной',
                    'text': 'Если вы заинтересованы в сотрудничестве или у вас есть вопросы - не стесняйтесь обращаться.',
                    'email': 'Email',
                    'phone': 'Телефон',
                    'location': 'Локация'
                },
                'en': {
                    'title': 'Contact',
                    'subtitle': 'Get In Touch',
                    'text': 'If you are interested in collaboration or have questions - feel free to contact me.',
                    'email': 'Email',
                    'phone': 'Phone',
                    'location': 'Location'
                },
                'zh': {
                    'title': '联系方式',
                    'subtitle': '联系我',
                    'text': '如果您对合作感兴趣或有任何问题 - 请随时与我联系。',
                    'email': '电子邮件',
                    'phone': '电话',
                    'location': '位置'
                }
            },
            'footer': {
                'ru': {
                    'copyright': '© 2025 Игорь Унгурянов. Все права защищены.'
                },
                'en': {
                    'copyright': '© 2025 Igor Unguryanov. All rights reserved.'
                },
                'zh': {
                    'copyright': '© 2025 伊戈尔·温古里亚诺夫。保留所有权利。'
                }
            }
        };

        // Обновляем тексты для героя
        document.querySelector('.hero h1').textContent = texts.hero[language].title;
        document.querySelector('.hero p').textContent = texts.hero[language].subtitle;
        document.querySelector('.hero .btn').textContent = texts.hero[language].button;

        // Обновляем заголовки секций
        document.querySelector('#about .section-title h2').textContent = texts.about[language].title;
        document.querySelector('#portfolio .section-title h2').textContent = texts.portfolio[language].title;
        document.querySelector('#blog .section-title h2').textContent = texts.blog[language].title;
        document.querySelector('#contact .section-title h2').textContent = texts.contact[language].title;

        // Обновляем секцию Обо мне
        document.querySelector('.about-text h3').textContent = texts.about[language].subtitle;
        const aboutParagraphs = document.querySelectorAll('.about-text p');
        aboutParagraphs[0].textContent = texts.about[language].text1;
        aboutParagraphs[1].textContent = texts.about[language].text2;

        // Обновляем секцию блога
        const readMoreLinks = document.querySelectorAll('.read-more');
        readMoreLinks.forEach(link => {
            link.textContent = texts.blog[language].readmore;
        });

        // Обновляем секцию контактов
        document.querySelector('.contact-info h3').textContent = texts.contact[language].subtitle;
        document.querySelector('.contact-info p').textContent = texts.contact[language].text;
        document.querySelectorAll('.contact-item h4')[0].textContent = texts.contact[language].email;
        document.querySelectorAll('.contact-item h4')[1].textContent = texts.contact[language].phone;
        document.querySelectorAll('.contact-item h4')[2].textContent = texts.contact[language].location;

        // Обновляем футер
        document.querySelector('footer p').textContent = texts.footer[language].copyright;

        // Обновляем форму в зависимости от языка
        const form = document.getElementById('contactForm');
        if (form) {
            const formInputs = form.querySelectorAll('input, textarea');
            if (language === 'ru') {
                formInputs[0].placeholder = 'Ваше имя';
                formInputs[1].placeholder = 'Ваш Email';
                formInputs[2].placeholder = 'Тема';
                formInputs[3].placeholder = 'Ваше сообщение';
                form.querySelector('button').textContent = 'Отправить сообщение';
            } else if (language === 'en') {
                formInputs[0].placeholder = 'Your Name';
                formInputs[1].placeholder = 'Your Email';
                formInputs[2].placeholder = 'Subject';
                formInputs[3].placeholder = 'Your Message';
                form.querySelector('button').textContent = 'Send Message';
            } else if (language === 'zh') {
                formInputs[0].placeholder = '您的姓名';
                formInputs[1].placeholder = '您的电子邮件';
                formInputs[2].placeholder = '主题';
                formInputs[3].placeholder = '您的留言';
                form.querySelector('button').textContent = '发送消息';
            }
        }
    }

    // ==================
    // Портфолио фильтр
    // ==================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаление активного класса со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавление активного класса нажатой кнопке
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ==================
    // Плавная прокрутка к секциям
    // ==================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================
    // Анимация при скролле
    // ==================
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.portfolio-item, .blog-card, .skill-item');
        const windowHeight = window.innerHeight;

        animatedElements.forEach(el => {
            const elPosition = el.getBoundingClientRect().top;

            if (elPosition < windowHeight - 100) {
                el.classList.add('animate');
            }
        });
    }

    // Первоначальная проверка при загрузке страницы
    animateOnScroll();

    // Проверка при скролле
    window.addEventListener('scroll', animateOnScroll);

    // Инициализация - загружаем тексты для текущего языка
    updatePageTexts(savedLanguage);

    // ==================
    // Обработка формы контактов
    // ==================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Здесь может быть код для отправки формы на сервер
            // Например, с использованием fetch API или XMLHttpRequest

            // Временная имитация отправки
            const submitButton = contactForm.querySelector('button');
            const originalText = submitButton.textContent;

            submitButton.disabled = true;

            // Текст в зависимости от языка
            const lang = localStorage.getItem('language') || 'ru';
            if (lang === 'ru') {
                submitButton.textContent = 'Отправка...';
            } else if (lang === 'en') {
                submitButton.textContent = 'Sending...';
            } else if (lang === 'zh') {
                submitButton.textContent = '发送中...';
            }

            setTimeout(() => {
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                // Показываем сообщение об успешной отправке
                alert(lang === 'ru' ? 'Сообщение отправлено!' :
                    (lang === 'en' ? 'Message sent!' : '消息已发送！'));
            }, 1500);
        });
    }
});