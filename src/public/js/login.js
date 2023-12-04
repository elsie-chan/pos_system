// $(document).ready(function () {
//     $("#password").keyup(function(event) {
//         if (event.keyCode === 13) {
//             $(".loginBtn").click();
//         }
//     });
//     $('.loginBtn').click(function (e) {
//         e.preventDefault();
//         const username = $('#username').val();
//         const password = $('#password').val();
//         console.log(username, password)
//
//         if (username === '' || password === '') {
//             $('.notification').text('Username or password is empty.');
//             console.log('Username or password is empty.');
//             return;
//         }
//
//         $.ajax({
//             url: '/api/v1/auth/authenticate',
//             type: 'POST',
//             data: JSON.stringify({
//                 username,
//                 password,
//             }),
//             contentType: 'application/json',
//             success: function (response) {
//                 console.log(response);
//                 window.location.href = "/";
//             },
//             error: function (error) {
//                 console.log(error);
//                 if (error.status === 400) {
//                     $('.notification').text('Username or password is incorrect.');
//                     console.log('Username or password is incorrect.');
//                 }
//             }
//         });
//     });
// })