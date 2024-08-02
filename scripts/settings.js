document.addEventListener('DOMContentLoaded', () => {
    const changePasswordForm = document.getElementById('change-password-form');
    const logoutButton = document.getElementById('logout-button');
  
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      alert('User ID not found. Please log in again.');
      window.location.href = 'index.html'; 
      return;
    }
  
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmNewPassword = document.getElementById('confirm-new-password').value;
  
      if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match');
        return;
      }
  
      try {
        const response = await fetch('/api/users/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
          body: JSON.stringify({ userId, currentPassword, newPassword })
        });
  
        const data = await response.json();
        alert(data.message);
      } catch (err) {
        alert('An error occurred');
      }
    });
  
    logoutButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/users/logout', {
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await response.json();
        alert(data.message);
  
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
  
  
        // Redirect to login page or home page
        window.location.href = 'login.html';
      } catch (err) {
        alert('An error occurred');
      }
    });
  });
  