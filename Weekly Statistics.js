document.getElementById('fetchDataButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            // Parse the file content and store it
            console.log(content);
            // Assuming the file content is CSV
            const rows = content.split('\n').map(row => row.split(','));
            // Process the data
            processData(rows);
        };
        reader.readAsText(file);
    }
});

let studentsData = [];

function processData(rows) {
    studentsData = rows.map(row => {
        const [id, name, ...attendance] = row;
        const excusedAbsences = attendance.filter(status => status === 'G').length;
        const unexcusedAbsences = attendance.filter(status => status === 'B').length;
        return { id, name, excusedAbsences, unexcusedAbsences };
    });

    console.log(studentsData);
    populateTable();
}

function populateTable() {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>الهوية</th>
                    <th>الاسم</th>
                    <th>غياب بعذر</th>
                    <th>غياب بدون عذر</th>
                </tr>
            </thead>
            <tbody>
                ${studentsData.map(student => `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.excusedAbsences}</td>
                        <td>${student.unexcusedAbsences}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

document.getElementById('graphButton').addEventListener('click', function() {
    document.getElementById('header').classList.add('hidden');
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('chart-container').classList.remove('hidden');
    document.getElementById('stats-container').classList.add('hidden');

    const labels = studentsData.map(student => student.name);
    const excusedData = studentsData.map(student => student.excusedAbsences);
    const unexcusedData = studentsData.map(student => student.unexcusedAbsences);

    var ctx = document.getElementById('attendanceChart').getContext('2d');
    var attendanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'غياب بعذر',
                data: excusedData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'غياب بدون عذر',
                data: unexcusedData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

document.getElementById('statsButton').addEventListener('click', function() {
    document.getElementById('header').classList.add('hidden');
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('chart-container').classList.add('hidden');
    document.getElementById('stats-container').classList.remove('hidden');

    const totalStudents = studentsData.length;
    const totalExcused = studentsData.reduce((sum, student) => sum + student.excusedAbsences, 0);
    const totalUnexcused = studentsData.reduce((sum, student) => sum + student.unexcusedAbsences, 0);

    document.getElementById('stats-container').innerHTML = `
        <p>إحصائيات الحضور والغياب:</p>
        <p>عدد الطلاب: ${totalStudents}</p>
        <p>مجموع الغياب بعذر: ${totalExcused}</p>
        <p>مجموع الغياب بدون عذر: ${totalUnexcused}</p>
    `;
});

document.getElementById('downloadChart').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    html2canvas(document.getElementById('attendanceChart')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('attendanceChart.pdf');
    });
});

document.getElementById('downloadStats').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const statsContainer = document.getElementById('stats-container');
    const statsText = statsContainer.innerText;
    const lines = statsText.split('\n');

    // Set text direction to RTL and a font that supports Arabic
    doc.setFont('Amiri', 'normal');
    doc.setFontSize(12);
    doc.textDirection = 'rtl';

    lines.forEach((line, index) => {
        doc.text(line, 200, 10 + (index * 10), {
            align: 'right'
        });
    });

    doc.save('attendanceStats.pdf');
});
