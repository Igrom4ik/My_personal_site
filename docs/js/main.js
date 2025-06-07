document.addEventListener('DOMContentLoaded', function() {
    let textsData = {}; // Переменная для хранения данных из texts.json

    // Загружаем texts.json
    fetch('js/texts.json')
        .then(response => response.json())
        .then(data => {
            textsData = data;
            // После загрузки данных устанавливаем язык
            const savedLanguage = localStorage.getItem('language') || 'ru';
            setLanguage(savedLanguage);
            updatePageTexts(savedLanguage);
        })
        .catch(error => {
            console.error('Ошибка загрузки текстов:', error);
            // Если texts.json не загрузился, все равно устанавливаем язык
            const savedLanguage = localStorage.getItem('language') || 'ru';
            setLanguage(savedLanguage);
            updatePageTexts(savedLanguage);
        });

    // Мобильное меню
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

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
    }

    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle && themeIcon) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            if (newTheme === 'light') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
    }

    // Переключение языков
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        const savedLanguage = localStorage.getItem('language') || 'ru';
        languageSelect.value = savedLanguage;

        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            setLanguage(selectedLanguage);
            localStorage.setItem('language', selectedLanguage);
            updatePageTexts(selectedLanguage);
        });
    }

    function setLanguage(language) {
        const menuElements = document.querySelectorAll('[class^="lang-"]');
        menuElements.forEach(el => {
            el.style.display = 'none';
        });
        const activeMenu = document.querySelectorAll('.lang-' + language);
        activeMenu.forEach(el => {
            el.style.display = '';
        });
    }

    function updatePageTexts(language) {
        // Обновляем содержимое раздела "Обо мне" из texts.json
        const aboutTitle = document.getElementById('about-title');
        const aboutSubtitle = document.getElementById('about-subtitle');
        const aboutText1 = document.getElementById('about-text1');
        const aboutText2 = document.getElementById('about-text2');

        if (textsData.about && textsData.about[language] && aboutTitle && aboutSubtitle && aboutText1 && aboutText2) {
            aboutTitle.textContent = textsData.about[language].title;

            // Для subtitle
            const subtitleData = textsData.about[language].subtitle;
            aboutSubtitle.textContent = subtitleData.text;
            if (subtitleData.classes) {
                aboutSubtitle.classList.add(...subtitleData.classes);
            }

            // Для text1
            const text1Data = textsData.about[language].text1;
            aboutText1.textContent = text1Data.text;
            if (text1Data.classes) {
                aboutText1.classList.add(...text1Data.classes);
            }

            // Для text2
            const text2Data = textsData.about[language].text2;
            aboutText2.textContent = text2Data.text;
            if (text2Data.classes) {
                aboutText2.classList.add(...text2Data.classes);
            }

            // Применяем шрифт из texts.json
            const aboutText = document.querySelector('.about-text');
            const font = textsData.about[language].font || 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
            aboutText.style.fontFamily = font;
            aboutSubtitle.style.fontFamily = font;
            aboutText1.style.fontFamily = font;
            aboutText2.style.fontFamily = font;
        }

        // Обновляем остальные тексты
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
            },
            'admin': {
                'ru': {
                    'loginTitle': 'Вход в админ-панель',
                    'loginUser': 'Имя пользователя:',
                    'loginPass': 'Пароль:',
                    'loginBtn': 'Войти',
                    'credTitle': 'Новые логин и пароль',
                    'credUser': 'Новый логин:',
                    'credPass': 'Новый пароль:',
                    'credBtn': 'Сохранить',
                    'dashTitle': 'Админ-панель',
                    'dashWelcome': 'Добро пожаловать!',
                    'dashInstr': 'Выберите действие в меню.',
                    'dashBlog': 'Редактор блога',
                    'dashPortfolio': 'Управление портфолио',
                    'dashSettings': 'Настройки сайта'
                },
                'en': {
                    'loginTitle': 'Admin Login',
                    'loginUser': 'Username:',
                    'loginPass': 'Password:',
                    'loginBtn': 'Login',
                    'credTitle': 'Change Credentials',
                    'credUser': 'New Username:',
                    'credPass': 'New Password:',
                    'credBtn': 'Save',
                    'dashTitle': 'Admin Panel',
                    'dashWelcome': 'Welcome!',
                    'dashInstr': 'Choose an action from the menu.',
                    'dashBlog': 'Blog Editor',
                    'dashPortfolio': 'Manage Portfolio',
                    'dashSettings': 'Site Settings'
                },
                'zh': {
                    'loginTitle': '登陆后台',
                    'loginUser': '用户名:',
                    'loginPass': '密码:',
                    'loginBtn': '登陆',
                    'credTitle': '新的登录名和密码',
                    'credUser': '新登录名:',
                    'credPass': '新密码:',
                    'credBtn': '保存',
                    'dashTitle': '管理面板',
                    'dashWelcome': '欢迎!',
                    'dashInstr': '在菜单中选择操作。',
                    'dashBlog': '博客编辑器',
                    'dashPortfolio': '管理作品集',
                    'dashSettings': '站点设置'
                }
            }
        };

        const heroTitle = document.querySelector('.hero h1');
        const heroSubtitle = document.querySelector('.hero p');
        const heroButton = document.querySelector('.hero .btn');
        if (heroTitle && heroSubtitle && heroButton) {
            heroTitle.textContent = texts.hero[language].title;
            heroSubtitle.textContent = texts.hero[language].subtitle;
            heroButton.textContent = texts.hero[language].button;
        }

        const portfolioTitle = document.querySelector('#portfolio .section-title h2');
        const blogTitle = document.querySelector('#blog .section-title h2');
        const contactTitle = document.querySelector('#contact .section-title h2');
        if (portfolioTitle) portfolioTitle.textContent = texts.portfolio[language].title;
        if (blogTitle) blogTitle.textContent = texts.blog[language].title;
        if (contactTitle) contactTitle.textContent = texts.contact[language].title;

        const readMoreLinks = document.querySelectorAll('.read-more');
        readMoreLinks.forEach(link => {
            link.textContent = texts.blog[language].readmore;
        });

        const contactInfoSubtitle = document.querySelector('.contact-info h3');
        const contactInfoText = document.querySelector('.contact-info p');
        const contactItems = document.querySelectorAll('.contact-item h4');
        if (contactInfoSubtitle && contactInfoText && contactItems.length >= 3) {
            contactInfoSubtitle.textContent = texts.contact[language].subtitle;
            contactInfoText.textContent = texts.contact[language].text;
            contactItems[0].textContent = texts.contact[language].email;
            contactItems[1].textContent = texts.contact[language].phone;
            contactItems[2].textContent = texts.contact[language].location;
        }

        const footerCopyright = document.querySelector('footer p');
        if (footerCopyright) {
            footerCopyright.textContent = texts.footer[language].copyright;
        }

        const form = document.getElementById('contactForm');
        if (form) {
            const formInputs = form.querySelectorAll('input, textarea');
            const formButton = form.querySelector('button');
            if (formInputs.length >= 4 && formButton) {
                if (language === 'ru') {
                    formInputs[0].placeholder = 'Ваше имя';
                    formInputs[1].placeholder = 'Ваш Email';
                    formInputs[2].placeholder = 'Тема';
                    formInputs[3].placeholder = 'Ваше сообщение';
                    formButton.textContent = 'Отправить сообщение';
                } else if (language === 'en') {
                    formInputs[0].placeholder = 'Your Name';
                    formInputs[1].placeholder = 'Your Email';
                    formInputs[2].placeholder = 'Subject';
                    formInputs[3].placeholder = 'Your Message';
                    formButton.textContent = 'Send Message';
                } else if (language === 'zh') {
                    formInputs[0].placeholder = '您的姓名';
                    formInputs[1].placeholder = '您的电子邮件';
                    formInputs[2].placeholder = '主题';
                    formInputs[3].placeholder = '您的留言';
                    formButton.textContent = '发送消息';
                }
            }
        }

        // Тексты админ-панели
        const loginTitle = document.getElementById('login-title');
        if (loginTitle) loginTitle.textContent = texts.admin[language].loginTitle;
        const loginUserLabel = document.getElementById('login-username-label');
        if (loginUserLabel) loginUserLabel.textContent = texts.admin[language].loginUser;
        const loginPassLabel = document.getElementById('login-password-label');
        if (loginPassLabel) loginPassLabel.textContent = texts.admin[language].loginPass;
        const loginBtn = document.getElementById('login-submit');
        if (loginBtn) loginBtn.textContent = texts.admin[language].loginBtn;

        const credTitle = document.getElementById('cred-title');
        if (credTitle) credTitle.textContent = texts.admin[language].credTitle;
        const credUserLabel = document.getElementById('cred-username-label');
        if (credUserLabel) credUserLabel.textContent = texts.admin[language].credUser;
        const credPassLabel = document.getElementById('cred-password-label');
        if (credPassLabel) credPassLabel.textContent = texts.admin[language].credPass;
        const credBtn = document.getElementById('cred-submit');
        if (credBtn) credBtn.textContent = texts.admin[language].credBtn;

        const dashTitle = document.getElementById('dash-title');
        if (dashTitle) dashTitle.textContent = texts.admin[language].dashTitle;
        const dashWelcome = document.getElementById('dash-welcome');
        if (dashWelcome) dashWelcome.textContent = texts.admin[language].dashWelcome;
        const dashInstr = document.getElementById('dash-instruction');
        if (dashInstr) dashInstr.textContent = texts.admin[language].dashInstr;
        const dashBlogLink = document.getElementById('dash-blog-link');
        if (dashBlogLink) dashBlogLink.textContent = texts.admin[language].dashBlog;
        const dashPortfolioLink = document.getElementById('dash-portfolio-link');
        if (dashPortfolioLink) dashPortfolioLink.textContent = texts.admin[language].dashPortfolio;
        const dashSettingsLink = document.getElementById('dash-settings-link');
        if (dashSettingsLink) dashSettingsLink.textContent = texts.admin[language].dashSettings;
    }

    // Портфолио фильтр
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
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

    // Плавная прокрутка к секциям
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

    // Анимация при скролле
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

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Обработка формы контактов
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button');
            const originalText = submitButton.textContent;

            submitButton.disabled = true;

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

                alert(lang === 'ru' ? 'Сообщение отправлено!' :
                    (lang === 'en' ? 'Message sent!' : '消息已发送！'));
            }, 1500);
        });
    }

    // Карусель блога
    const blogPostsContainer = document.getElementById('blog-posts');
    if (blogPostsContainer) {
        const staticBase = "{{ url_for('static', filename='') }}";
        fetch('blog/posts.json')
            .then(response => response.json())
            .then(posts => {
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'blog-card';
                    postElement.innerHTML = `
                        <div class="blog-img">
                            <img src="${staticBase}${post.thumbnail || 'images/placeholder.jpg'}" alt="${post.title}">
                        </div>
                        <div class="blog-content">
                            <h3 class="blog-title">${post.title}</h3>
                            <p class="blog-date">${post.date}</p>
                            <p>${post.content.substring(0, 100)}...</p>
                            <a href="blog/post-${post.id}.html" class="read-more">Читать далее</a>
                        </div>
                    `;
                    blogPostsContainer.appendChild(postElement);
                });
            })
            .catch(error => console.error('Ошибка загрузки постов:', error));

        const prevButton = document.querySelector('.carousel-nav.prev');
        const nextButton = document.querySelector('.carousel-nav.next');

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                blogPostsContainer.scrollBy({ left: -300, behavior: 'smooth' });
            });

            nextButton.addEventListener('click', () => {
                blogPostsContainer.scrollBy({ left: 300, behavior: 'smooth' });
            });

            let isHovering = false;
            let scrollDirection = 0;

            blogPostsContainer.parentElement.addEventListener('mouseenter', () => {
                isHovering = true;
            });

            blogPostsContainer.parentElement.addEventListener('mouseleave', () => {
                isHovering = false;
                scrollDirection = 0;
            });

            blogPostsContainer.parentElement.addEventListener('mousemove', (e) => {
                const rect = blogPostsContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;

                if (x < width * 0.2) {
                    scrollDirection = -1; // Scroll left
                } else if (x > width * 0.8) {
                    scrollDirection = 1; // Scroll right
                } else {
                    scrollDirection = 0; // Stop scrolling
                }
            });

            function autoScroll() {
                if (isHovering && scrollDirection !== 0) {
                    blogPostsContainer.scrollBy({ left: scrollDirection * 5, behavior: 'smooth' });
                }
                requestAnimationFrame(autoScroll);
            }

            requestAnimationFrame(autoScroll);
        }
    }
});