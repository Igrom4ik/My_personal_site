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

function clearForm() {
    document.getElementById('post-title').value = '';
    document.getElementById('post-date').value = '';
    if (quill) {
        quill.root.innerHTML = '';
    }
    document.querySelectorAll('.post-item').forEach(p => p.classList.remove('active'));
}

function addTopicClickHandler(topicElement) {
    topicElement.addEventListener('click', function() {
        const postList = this.nextElementSibling;
        postList.style.display = postList.style.display === 'none' ? 'block' : 'none';
    });
}

function fixScrollbars() {
    const quillContainer = document.querySelector('.ql-container');
    const quillEditor = document.querySelector('.ql-editor');
    const editorDiv = document.querySelector('#editor');

    if (quillContainer) {
        quillContainer.style.overflow = 'hidden';
    }

    if (editorDiv) {
        editorDiv.style.overflow = 'hidden';
    }

    if (quillEditor) {
        quillEditor.style.maxHeight = '400px';
        quillEditor.style.overflowY = 'auto';
    }
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

    fixScrollbars();
    quill.on('text-change', fixScrollbars);
    window.addEventListener('resize', fixScrollbars);

    const editorEl = document.querySelector('#editor');

    editorEl.addEventListener('dragover', e => {
        e.preventDefault();
        editorEl.classList.add('drag-over');
    });

    editorEl.addEventListener('dragleave', () => {
        editorEl.classList.remove('drag-over');
    });

    editorEl.addEventListener('drop', e => {
        e.preventDefault();
        editorEl.classList.remove('drag-over');

        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    const range = quill.getSelection(true);
                    if (file.type.startsWith('image/')) {
                        quill.insertEmbed(range.index, 'image', reader.result);
                    } else if (file.type.startsWith('video/')) {
                        const videoTag = `<video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.4);">
                            <source src="${reader.result}" type="${file.type}">
                            Ваш браузер не поддерживает видео.
                        </video><p></p>`;
                        quill.clipboard.dangerouslyPasteHTML(range.index, videoTag);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });

    const submitBtn = document.getElementById('submit-post');
    if (submitBtn) {
        submitBtn.addEventListener('click', savePost);
    }

    const cancelBtn = document.getElementById('cancel-post');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            clearForm();
            console.log('Редактирование отменено');
        });
    }

    document.querySelectorAll('.topic-name').forEach(topic => {
        addTopicClickHandler(topic);
    });

    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.post-item').forEach(p => p.classList.remove('active'));
            item.classList.add('active');

            const topic = item.closest('.topic')?.querySelector('.topic-name')?.textContent.trim();
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

            addTopicClickHandler(topic);
        }
    });
});

function savePost() {
    const title = document.getElementById('post-title').value.trim();
    const date = document.getElementById('post-date').value;
    const content = quill.root.innerHTML;
    const thumbnail = prompt('Введите URL миниатюры (или оставьте пустым):') || 'images/placeholder.jpg';

    if (!title || !date || !content) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const newPost = {
        id: Date.now(), // Уникальный ID на основе времени
        title,
        date,
        content,
        thumbnail
    };

    console.log('=== Новый пост для posts.json ===');
    console.log(JSON.stringify(newPost, null, 2));

    alert('Пост сохранен в консоли!');

    clearForm();
}