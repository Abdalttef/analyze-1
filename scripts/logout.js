document.addEventListener('DOMContentLoaded', () => {
    // Initialize Userfront
    Userfront.init('wn9mg6xn'); 
  
    const logoutButton = document.getElementById('logout-button');
  
    logoutButton.addEventListener('click', async () => {
      try {
        // Call Userfront's logout function
        await Userfront.logout();
  
        // Redirect to index.html
        window.location.href = 'index.html';
      } catch (err) {
        alert('An error occurred during logout');
      }
    });
  });
  