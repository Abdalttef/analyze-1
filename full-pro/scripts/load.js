function loadPage(url) {
    document.getElementById('contentFrame').src = url;
}
// function loadPage(page) {
//     fetch(page)
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('contentFrame').innerHTML = data;
//         })
//         .catch(error => console.error('Error loading page:', error));
// }

