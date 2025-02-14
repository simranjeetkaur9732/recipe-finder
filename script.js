// Existing variables
const canvas = document.getElementById('coffeeLogo');
        const ctx = canvas.getContext('2d');

        function drawLogo() {
            // Clear canvas
            ctx.clearRect(0, 0, 40, 40);
            
            // Cup body
            ctx.beginPath();
            ctx.moveTo(10, 15);
            ctx.lineTo(25, 15);
            ctx.lineTo(23, 30);
            ctx.lineTo(12, 30);
            ctx.closePath();
            ctx.fillStyle = '#14213D';
            ctx.fill();

            // Handle
            ctx.beginPath();
            ctx.moveTo(25, 18);
            ctx.quadraticCurveTo(30, 20, 25, 25);
            ctx.lineWidth = 2;
            ctx.stroke();

            // Steam
            ctx.beginPath();
            ctx.moveTo(15, 8);
            ctx.quadraticCurveTo(17, 5, 15, 2);
            ctx.moveTo(20, 8);
            ctx.quadraticCurveTo(22, 5, 20, 2);
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
        drawLogo();
const searchbox = document.querySelector(".searchbox");
const searchbutton = document.querySelector(".searchbutton");
const recipecontainer = document.querySelector(".recipecontainer");
const recipedetailcontent = document.querySelector(".recipe-details-content");
const recipeclosebtn = document.querySelector(".recipe-close-button");
const categoryButtons = document.querySelectorAll('.category-btn');

let currentCategory = 'all';

// Function to fetch recipes by category
const getRecipesByCategory = async (category) => {
    recipecontainer.innerHTML = "<h2>Fetching recipes.....</h2>";
    
    try {
        let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
        
        if (category !== 'all') {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        }
        
        const data = await fetch(url);
        const response = await data.json();
        
        displayRecipes(response.meals);
    } catch (error) {
        recipecontainer.innerHTML = "<h2>Error in Fetching Recipes.....</h2>";
    }
};

// Function to display recipes
const displayRecipes = async (meals) => {
    recipecontainer.innerHTML = "";
    
    if (!meals) {
        recipecontainer.innerHTML = "<h2>No recipes found.</h2>";
        return;
    }

    for (let meal of meals) {
        // If we only have partial meal data, fetch the full details
        if (!meal.strInstructions) {
            const fullDetails = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const detailsJson = await fullDetails.json();
            meal = detailsJson.meals[0];
        }

        const recipediv = document.createElement("div");
        recipediv.classList.add("recipe");
        recipediv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea || 'Various'}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span></p>
            <button type="button">View Recipe</button>
        `;

        const button = recipediv.querySelector("button");
        button.addEventListener("click", () => {
            openrecipepopup(meal);
        });

        recipecontainer.appendChild(recipediv);
    }
};

// Function to fetch ingredients
const fetchingredients = (meal) => {
    let ingredientslist = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientslist += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientslist;
};

// Function to open recipe popup
const openrecipepopup = (meal) => {
    recipedetailcontent.innerHTML = `
        <h2 class="recipename">${meal.strMeal}</h2>
        <h3>INGREDIENTS:</h3>
        <ul class="ingredientlist">${fetchingredients(meal)}</ul>
        <div>
            <h3>INSTRUCTIONS:</h3>
            <p class="recipeinstructions">${meal.strInstructions}</p>
        </div>
    `;
    recipedetailcontent.parentElement.style.display = "block";
};

// Event Listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Get and store category
        currentCategory = button.dataset.category;
        
        // Fetch recipes for category
        getRecipesByCategory(currentCategory);
    });
});

// Close button event listener
recipeclosebtn.addEventListener("click", () => {
    recipedetailcontent.parentElement.style.display = "none";
});

// Search button event listener
searchbutton.addEventListener("click", async (e) => {
    e.preventDefault();
    const searchInput = searchbox.value.trim();
    
    if (!searchInput) {
        recipecontainer.innerHTML = "<h2>Type the Meal in the search box</h2>";
        return;
    }

    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`);
        const response = await data.json();
        
        if (currentCategory !== 'all') {
            // Filter results by current category
            const filteredMeals = response.meals ? response.meals.filter(meal => 
                meal.strCategory.toLowerCase() === currentCategory.toLowerCase()
            ) : null;
            displayRecipes(filteredMeals);
        } else {
            displayRecipes(response.meals);
        }
    } catch (error) {
        recipecontainer.innerHTML = "<h2>Error in Fetching Recipes.....</h2>";
    }
});

// Load initial recipes when page loads
window.addEventListener('DOMContentLoaded', () => {
    getRecipesByCategory('all');
});

// Add this to your existing script.js file

// Navigation functionality
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Hide all sections
      document.querySelectorAll('main section').forEach(section => {
          section.classList.add('section-hidden');
          section.classList.remove('section-visible');
      });
      
      // Show clicked section
      const sectionId = link.getAttribute('href').substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
          section.classList.remove('section-hidden');
          section.classList.add('section-visible');
      }
  });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Add your form submission logic here
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
  });
}

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Add your newsletter subscription logic here
      alert('Thank you for subscribing to our newsletter!');
      newsletterForm.reset();
  });
}
