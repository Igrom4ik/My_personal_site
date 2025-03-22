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

window.addEventListener('DOMContentLoaded', () => {
    // Инициализация Quill
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Напишите что-нибудь...',
        modules: {
            toolbar: '#editor-toolbar'
        }
    });

    // Устанавливаем начальный режим "Создать"
    document.querySelector('.mode-label').textContent = 'Создать';

    const submitBtn = document.getElementById('submit-post');
    if (submitBtn) {
        submitBtn.addEventListener('click', savePost);
    }

    // Обработчик для переключения отображения списка постов
    document.querySelectorAll('.topic-name').forEach(topic => {
        topic.addEventListener('click', function() {
            const postList = this.nextElementSibling;
            postList.style.display = postList.style.display === 'none' ? 'block' : 'none';
        });
    });

    // Обработчик клика по постам
    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', () => {
            // Меняем режим на "Отредактировать"
            document.querySelector('.mode-label').textContent = 'Отредактировать';

            // Визуально выделяем активный пост
            document.querySelectorAll('.post-item').forEach(p => p.classList.remove('active'));
            item.classList.add('active');

            // Загружаем данные поста для редактирования
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

    // Обработчик для добавления новой темы
    document.querySelector('.add-topic').addEventListener('click', function() {
        const topicName = prompt('Введите название новой темы:');
        if (topicName && topicName.trim()) {
            const topicList = document.querySelector('.topic-list');
            const newTopic = document.createElement('li');
            newTopic.className = 'topic';
            newTopic.innerHTML = `
                <span class="topic-name">${topicName}</span>
                <ul class="post-list"></ul>
            `;
            topicList.appendChild(newTopic);

            // Добавляем обработчик для новой темы
            newTopic.querySelector('.topic-name').addEventListener('click', function() {
                const postList = this.nextElementSibling;
                postList.style.display = postList.style.display === 'none' ? 'block' : 'none';
            });
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

    // Сбрасываем форму и возвращаем режим "Создать"
    document.getElementById('post-title').value = '';
    document.getElementById('post-date').value = '';
    quill.root.innerHTML = '';
    document.querySelector('.mode-label').textContent = 'Создать';

    // Снимаем выделение с активного поста
    document.querySelectorAll('.post-item').forEach(p => p.classList.remove('active'));
}