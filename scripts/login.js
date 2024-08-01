$(document).ready(function() {
    $('#login-form').on('submit', function(e) {
      e.preventDefault();
  
      const usernameEmail = $('#username-email').val();
      const password = $('#password').val();
  
      $.ajax({
        url: 'http://localhost:3000/api/users/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          usernameEmail: usernameEmail,
          password: password
        }),
        success: function(response) {
          console.log('User logged in successfully');
          window.location.href = 'homePage.html';
        },
        error: function(error) {
          const errorMsg = error.responseJSON ? error.responseJSON.error : 'An unexpected error occurred';
          $('#error-message').text(errorMsg).show();
        //  comsole.log('Error: ' + errorMsg);
        }
      });
    });
  });
  