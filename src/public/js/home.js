$(document).ready(function () {
    uploadItemSlidebar();
});

function uploadItemSlidebar() {
    const sidebarItems = document.querySelectorAll('.slidebar-item');

    sidebarItems.forEach(function (item) {
      item.addEventListener('click', function () {
        // Xoá class 'item_active' từ tất cả các item
        sidebarItems.forEach(function (item) {
          item.querySelector('a').classList.remove('item_active');
        });

        // Thêm class 'item_active' cho item được nhấn
        item.querySelector('a').classList.add('item_active');
      });
    });
}