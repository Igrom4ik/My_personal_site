let quill;

const blogPosts = {
    "Unreal Engine": [
        {
            title: "Lumen Lighting",
            date: "2025-03-10",
            content: "<p>Настройки освещения через Lumen...</p>"
        },
        {
            title: "Nanite и производительность",
            date: "2025-03-15",
            content: "<p>Как повысить FPS с Nanite...</p>"
        }
    ],
    "3D Моделинг": [
        {
            title: "Оптимизация моделей",
            date: "2025-02-20",
            content: "<p>Удаляйте лишние полигоны...</p>"
        }
    ]
};

// Функция для очистки формы и снятия выделения с постов
function clearForm() {
    document.getElementById('post-title').value = '';
    document.getElementById('post-date').value = '';
    if (quill) {
        quill.root.innerHTML = '';
    }

    // Снимаем выделение с активного поста
    document.querySelectorAll('.post-item').forEach(p => p.classList.remove('active'));
}

// Функция для добавления обработчика клика на темы
function addTopicClickHandler(topicElement) {
    topicElement.addEventListener('click', function() {
        const postList = this.nextElementSibling;
        postList.style.display = postList.style.display === 'none' ? 'block' : 'none';
    });
}

window.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Напишите что-нибудь...',
        modules: {
            toolbar: {
                container: '#editor-toolbar',
                handlers: {
                    'link': function(value) {
                        if (value) {
                            var href = prompt('Введите URL:');
                            this.quill.format('link', href);
                        } else {
                            this.quill.format('link', false);
                        }
                    },
                    'image': function() {
                        var url = prompt('Введите URL изображения:');
                        if(url) {
                            this.quill.insertEmbed(this.quill.getSelection().index, 'image', url);
                        }
                    }
                }
            }
        }
    });

    // Обработчик для кнопки публикации
    const submitBtn = document.getElementById('submit-post');
    if (submitBtn) {
        submitBtn.addEventListener('click', savePost);
    }

    // Обработчик для кнопки отмены
    const cancelBtn = document.getElementById('cancel-post');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            clearForm();
            console.log('Редактирование отменено');
        });
    }

    // Добавляем обработчики для существующих тем
    document.querySelectorAll('.topic-name').forEach(topic => {
        addTopicClickHandler(topic);
    });

    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.post-item').forEach(p => p.classList.remove('active'));
            item.classList.add('active');

            const topic = item.closest('.topic').querySelector('.topic-name').textContent.trim();
            const title = item.textContent.trim();
            const post = blogPosts[topic]?.find(p => p.title === title);

            if (post) {
                document.getElementById('post-title').value = post.title;
                document.getElementById('post-date').value = post.date;
                quill.root.innerHTML = post.content;
            }
        });
    });

    document.querySelector('.add-topic')?.addEventListener('click', function() {
        const topicName = prompt('Введите название новой темы:');
        if (topicName && topicName.trim()) {
            const topic = document.createElement('div');
            topic.className = 'topic-name';
            topic.textContent = topicName;

            const postList = document.createElement('ul');
            postList.className = 'post-list';

            const sidebar = document.querySelector('.sidebar');
            sidebar.insertBefore(topic, document.querySelector('.add-topic'));
            sidebar.insertBefore(postList, document.querySelector('.add-topic'));

            // Используем общую функцию для добавления обработчика
            addTopicClickHandler(topic);
        }
    });
});

function savePost() {
    const title = document.getElementById('post-title').value.trim();
    const date = document.getElementById('post-date').value;
    const content = quill.root.innerHTML;

    if (!title || !date || !content) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    console.log('=== Новый пост ===');
    console.log('Заголовок:', title);
    console.log('Дата:', date);
    console.log('Контент:', content);

    alert('Пост подготовлен — пока только в консоли :)');

    // Используем общую функцию для очистки формы
    clearForm();
}