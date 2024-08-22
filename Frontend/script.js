// Function to simulate showing unfollowers
function showUnfollowers() {
    const unfollowersContainer = document.getElementById('unfollowers');
    const instagramId = document.getElementById('instagramId').value.trim();
    
    if (!instagramId) {
        alert('Please enter an Instagram User ID.');
        return;
    }

    // Dummy data for unfollowers
    const dummyUnfollowers = Array.from({ length: 50 }, (_, index) => `User${index + 1}`);

    // Clear previous content
    unfollowersContainer.innerHTML = '';

    // Display the first 20 unfollowers
    dummyUnfollowers.slice(0, 20).forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.textContent = user;
        unfollowersContainer.appendChild(userDiv);
    });

    // Add "Load More" button if there are more unfollowers
    if (dummyUnfollowers.length > 20) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.onclick = () => loadMoreUnfollowers(dummyUnfollowers);
        unfollowersContainer.appendChild(loadMoreButton);
    }
}

// Function to load more unfollowers
function loadMoreUnfollowers(allUnfollowers) {
    const unfollowersContainer = document.getElementById('unfollowers');
    const currentCount = unfollowersContainer.children.length - 1; // Exclude the "Load More" button
    const nextUnfollowers = allUnfollowed.slice(currentCount, currentCount + 20);

    nextUnfollowers.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.textContent = user;
        unfollowersContainer.insertBefore(userDiv, unfollowersContainer.querySelector('button'));
    });

    // Hide "Load More" button if all unfollowers are displayed
    if (currentCount + nextUnfollowers.length >= allUnfollowers.length) {
        unfollowersContainer.querySelector('button').style.display = 'none';
    }
}

// Light/Dark mode toggle
const checkbox = document.getElementById("checkbox");

checkbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});
