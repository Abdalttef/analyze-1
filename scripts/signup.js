$(document).ready(function() {
  $('#form-group').on('submit', function(e) {
    e.preventDefault();

    console.log('Form submitted');

    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
    }

    $.ajax({
      url: 'http://localhost:3000/api/users/register',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        username: username,
        email: email,
        password: password,
        confirmPassword :confirmPassword 
      }),
      success: function(response) {
        console.log('User registered successfully');
        window.location.href = 'SubscriptionPage.html';
      },
      error: function(error) {
        const errorMsg = error.responseJSON ? error.responseJSON.error : 'An unexpected error occurred';
        $('#error-message').text(errorMsg).show();
        // console.log('Error: ' + errorMsg);
      }
    });
  });
});

