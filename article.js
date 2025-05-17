// Wait for the DOM to load before executing the script
document.addEventListener("DOMContentLoaded", () => {
    // Get the 'id' from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // Retrieve articles from local storage or initialize as an empty array
    const articles = JSON.parse(localStorage.getItem("articles") || "[]");

    // Find the article with the matching ID
    const article = articles.find(a => String(a.id) === id);

    const container = document.getElementById("articleContainer");

    // If no article is found, display an error message
    if (!article) {
        container.innerHTML = "";
        const error = document.createElement("p");
        error.className = "text-center text-red-500 text-xl";
        error.textContent = "Article not found.";
        container.appendChild(error);
        return;
    }

    // Set the article's content (title, image, content, date)
    document.getElementById("title").textContent = article.title;
    document.getElementById("content").textContent = article.content;
    document.getElementById("image").src = article.image;
    document.getElementById("image").alt = article.title;
    document.getElementById("date").textContent = new Date(article.date).toLocaleString();

    // Initialize like and dislike buttons
    const likeBtn = document.getElementById("likeBtn");
    const dislikeBtn = document.getElementById("dislikeBtn");
    const likesEl = document.getElementById("likes");
    const dislikesEl = document.getElementById("dislikes");

    // Keys to store likes and dislikes count in localStorage
    const likeKey = `likes_${id}`;
    const dislikeKey = `dislikes_${id}`;
    const commentKey = `comments_${id}`;

    // Get likes and dislikes from localStorage or initialize to 0
    let likes = parseInt(localStorage.getItem(likeKey) || 0);
    let dislikes = parseInt(localStorage.getItem(dislikeKey) || 0);
    likesEl.textContent = likes;
    dislikesEl.textContent = dislikes;

    // Increment likes and update localStorage
    likeBtn.onclick = () => {
        likes++;
        localStorage.setItem(likeKey, likes);
        likesEl.textContent = likes;
    };

    // Increment dislikes and update localStorage
    dislikeBtn.onclick = () => {
        dislikes++;
        localStorage.setItem(dislikeKey, dislikes);
        dislikesEl.textContent = dislikes;
    };

    // Retrieve comments from localStorage or initialize as empty array
    const comments = JSON.parse(localStorage.getItem(commentKey) || "[]");
    const commentsList = document.getElementById("comments");
    const input = document.getElementById("commentInput");

    // Function to render comments in the list
    function renderComments() {
        commentsList.innerHTML = "";
        comments.forEach(comment => {
            const li = document.createElement("li");
            li.textContent = comment;
            li.className = "bg-gray-100 p-2 rounded";
            commentsList.appendChild(li);
        });
    }

    // Render existing comments
    renderComments();

    // Handle new comment submission
    document.getElementById("commentBtn").onclick = () => {
        const text = input.value.trim();
        if (text) {
            comments.push(text); // Add comment to array
            localStorage.setItem(commentKey, JSON.stringify(comments)); // Save to localStorage
            input.value = ""; // Clear input field
            renderComments(); // Re-render comments
        }
    };
});