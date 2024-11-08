(function () {
    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = callback;
        script.src = url;
        document.head.appendChild(script);
    }

    function InitExport() {
        'use strict';

        if (!window.location.href.includes('noor.moe.gov.sa')) {
            alert('لتفعيل هذه الميزة، يرجى تسجيل الدخول إلى نظام نور.');
            return;
        }

        const e = document.querySelector('.MSRS-RVC'),
            t = e ? e.parentElement : null;

        if (!e || !t) {
            Swal.fire({
                title: 'تنبيه',
                text: 'انقر فوق "عرض التقرير" لتصديره.',
                icon: 'error',
                confirmButtonText: 'موافق'
            });
            return;
        }

        try {
            var o = document.getElementById('ExportContainer');
            if (o) o.remove();
        } catch (e) { }

        const r = e.id,
            n = document.createElement('div');

        n.setAttribute('style', 'padding: 0 10px; text-align: end; display: inline-flex; float: right; cursor: pointer;');
        n.setAttribute('id', 'ExportContainer');

        ['pdf', 'excel', 'word'].forEach(e => {
            const t = document.createElement('div');
            t.id = 'ExportButton_' + e;
            t.title = 'تصدير ' + e;
            t.style.cursor = 'pointer';

            if (e === 'pdf') {
                t.innerHTML = '<i class="fa fa-file-pdf-o" style="font-size: 35px; color: #F44336;"></i>';
            } else if (e === 'excel') {
                t.innerHTML = '<i class="fa fa-file-excel-o" style="font-size: 35px; color: #009688; margin: 0 30px;"></i>';
                t.style.margin = '0 30px;';
            } else if (e === 'word') {
                t.innerHTML = '<i class="fa fa-file-word-o" style="font-size: 35px; color: #2196F3;"></i>';
            }

            t.addEventListener('click', () => window.$find(r).exportReport(e === 'excel' ? 'EXCELOPENXML' : e));
            n.appendChild(t);
        });

        const i = document.querySelector('.ToolBarButtonsCell');
        i.prepend(n);
    }

    loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11', InitExport);
})();























// function InitExport() {
//     'use strict';

//     if (!window.location.href.includes('noor.moe.gov.sa')) {
//         alert('لتفعيل هذه الميزة، يرجى تسجيل الدخول إلى نظام نور.');
//         return;
//     }

//     // const e = document.querySelector('.MSRS-RVC'),
//     //       t = e ? e.parentElement : null;

//     // if (!e || !t) {
//     //     alert('اضغط عرض التقرير لكي يتم تصديره');
//     //     return;
//     // }

//     const e = document.querySelector('.MSRS-RVC'),
//           t = e ? e.parentElement : null;

//     if (!e || !t) {
//         Swal.fire({
//             title: 'تنبيه',
//             text:'انقر فوق "عرض التقرير" لتصديره.',
//             icon: 'error',
//             confirmButtonText: 'موافق'
//         });
//         return;
//     }

//     try {
//         var o = document.getElementById('ExportContainer');
//         if (o) o.remove();
//     } catch (e) {}

//     const r = e.id,
//           n = document.createElement('div');

//     n.setAttribute('style', 'padding: 0 10px; text-align: end; display: inline-flex; float: right; cursor: pointer;');
//     n.setAttribute('id', 'ExportContainer');

//     ['pdf', 'excel', 'word'].forEach(e => {
//         const t = document.createElement('div');
//         t.id = 'ExportButton_' + e;
//         t.title = 'تصدير ' + e;
//         t.style.cursor = 'pointer';

//         if (e === 'pdf') {
//             t.innerHTML = '<i class="fa fa-file-pdf-o" style="font-size: 35px; color: #F44336;"></i>';
//         } else if (e === 'excel') {
//             t.innerHTML = '<i class="fa fa-file-excel-o" style="font-size: 35px; color: #009688; margin: 0 30px;"></i>';
//             t.style.margin = '0 30px;';
//         } else if (e === 'word') {
//             t.innerHTML = '<i class="fa fa-file-word-o" style="font-size: 35px; color: #2196F3;"></i>';
//         }

//         t.addEventListener('click', () => window.$find(r).exportReport(e === 'excel' ? 'EXCELOPENXML' : e));
//         n.appendChild(t);
//     });

//     const i = document.querySelector('.ToolBarButtonsCell');
//     i.prepend(n);
// }
