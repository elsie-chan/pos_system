// Toggle Sidenav
const iconNavbarSidenav = document.getElementById('iconNavbarSidenav');
const iconSidenav = document.getElementById('iconSidenav');
const sidenav = document.getElementById('sidenav-main');
let body = document.getElementsByTagName('body')[0];
let className = 'g-sidenav-pinned';

if (iconNavbarSidenav) {
    iconNavbarSidenav.addEventListener("click", toggleSidenav);
}

if (iconSidenav) {
    iconSidenav.addEventListener("click", toggleSidenav);
}

function toggleSidenav() {
    if (body.classList.contains(className)) {
        body.classList.remove(className);
        body.classList.add('g-sidenav-show');
        setTimeout(function() {
            sidenav.classList.remove('bg-white');
        }, 100);
        sidenav.classList.remove('bg-transparent');

    } else {
        body.classList.add(className);
        body.classList.remove('g-sidenav-show');
        sidenav.classList.add('bg-white');
        sidenav.classList.remove('bg-transparent');
        iconSidenav.classList.remove('d-none');
    }
}



