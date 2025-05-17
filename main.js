// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
    // Initialize icons using Lucide library
    lucide.createIcons();

    // DOM elements
    // Hamburger menu button
    const menuBtn = document.getElementById('menu-btn');
    
    // Mobile menu
    const mobileMenu = document.getElementById('mobile-menu');

    // Article submission form
    const form = document.getElementById('articleForm'); 
    
    // Container to display articles
    const articleList = document.getElementById('article-list'); 
    
    // Toast notification
    const toast = document.getElementById('toast'); 

    // Toggle mobile menu visibility on button click
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('max-h-0');
        mobileMenu.classList.toggle('max-h-96');
    });

    // Function to show toast message
    function showToast(message) {
        toast.textContent = message; // Set toast message
        toast.classList.remove("hidden");
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
            toast.classList.add("hidden");
        }, 3000); // Hide toast after 3 seconds
    }

    // Function to load articles from localStorage
    function loadArticles() {
        return JSON.parse(localStorage.getItem("articles") || "[]");
    }

    // Function to save articles to localStorage
    function saveArticles(articles) {
        localStorage.setItem("articles", JSON.stringify(articles));
    }

    // Function to render articles on the page
    function renderArticles() {
        const articles = loadArticles(); // Load articles
        articleList.innerHTML = ""; // Clear current article list

        articles.forEach((article, index) => {
            // Create a card for each article
            const articleCard = document.createElement("div");
            articleCard.className = "flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-md";

            const img = document.createElement("img"); // Article image
            img.src = article.image;
            img.alt = article.title;
            img.className = "w-full md:w-48 h-auto object-cover rounded";

            const contentDiv = document.createElement("div");

            const titleLink = document.createElement("a"); // Article title link
            titleLink.href = `article.html?id=${article.id}`;
            titleLink.textContent = article.title;
            titleLink.className = "block text-xl font-semibold mb-2 text-gray-800 hover:text-orange-500 hover:scale-[1.02] transform transition";

            const summary = document.createElement("p"); // Article summary (first 60 characters)
            const preview = article.content.substring(0, 60);
            summary.textContent = preview + (article.content.length > 60 ? "..." : "");
            summary.className = "text-gray-700";

            const date = document.createElement("p"); // Article date
            date.textContent = new Date(article.date).toLocaleString();
            date.className = "text-sm text-gray-400 mt-1";

            const deleteBtn = document.createElement("button"); // Delete button for the article
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "mt-2 text-sm text-red-500 hover:underline";
            deleteBtn.setAttribute("data-index", index);

            contentDiv.append(titleLink, summary, date, deleteBtn);
            articleCard.append(img, contentDiv);
            articleList.appendChild(articleCard);
        });

        // Attach delete functionality to each delete button
        document.querySelectorAll("button[data-index]").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.getAttribute("data-index"));
                const articles = loadArticles(); // Load articles
                articles.splice(index, 1); // Remove the selected article
                saveArticles(articles); // Save updated articles
                renderArticles(); // Re-render the articles list
                showToast("Article deleted."); // Show a success toast
            });
        });
    }

    // Handle article form submission
    form.addEventListener("submit", e => {
        e.preventDefault(); // Prevent page refresh on form submit

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const image = document.getElementById("image").value;

        // Create a new article object
        const newArticle = {
            id: Date.now().toString(), // Unique ID based on current timestamp
            title,
            content,
            image,
            date: new Date().toISOString() // Store current date
        };

        // Load existing articles
        const articles = loadArticles();
        
        // Add the new article at the beginning
        articles.unshift(newArticle); 
        
        // Save updated articles list
        saveArticles(articles); 
        
        // Re-render articles
        renderArticles(); 
        
        // Clear the form
        form.reset(); 
        
        // Show success toast
        showToast("Article added."); 
    });

    // Initial call to render articles when the page loads
    renderArticles();
});