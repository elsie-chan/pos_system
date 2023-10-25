// LOGOUT BUTTON
let logoutBtn = $('.logout');

logoutBtn.click(function (e) {
    e.preventDefault()
    if (localStorage.getItem("token") !== null) {
        $.ajax({
            url: '/api/v1/auth/logout',
            type: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem("token")
            },
            success: function (data) {
                console.log(data)
                localStorage.removeItem("token")
                localStorage.removeItem("refreshToken")
                window.location.href = '/auth/login'
            },
            error: function (error) {
                console.log(error)
            }
        })
    } else {
        window.location.href = '/admin/login'
    }
})

