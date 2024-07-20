document.getElementById('fetchDataButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', handleFile);

document.getElementById('graphButton').addEventListener('click', showGraph);

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        processData(jsonData);
    };
    
    reader.readAsArrayBuffer(file);
}

let excusedAbsences = 0;
let unexcusedAbsences = 0;

function processData(data) {
    data.forEach(row => {
        if (row[0] === 'مجموع الغياب بعذر') {
            excusedAbsences = row[1];
        } else if (row[0] === 'مجموع الغياب بدون عذر') {
            unexcusedAbsences = row[1];
        }
    });

    console.log('مجموع الغياب بعذر:', excusedAbsences);
    console.log('مجموع الغياب بدون عذر:', unexcusedAbsences);
}

function showGraph() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['مجموع الغياب بعذر', 'مجموع الغياب بدون عذر'],
            datasets: [{
                label: 'عدد الغيابات',
                data: [excusedAbsences, unexcusedAbsences],
                backgroundColor: ['#36A2EB', '#FF6384']
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

    document.getElementById('chart-container').classList.remove('hidden');
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('stats-container').classList.add('hidden');
}

// Download chart as PDF
document.getElementById('downloadChart').addEventListener('click', () => {
    const canvas = document.getElementById('attendanceChart');
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10);
    pdf.save('attendance_chart.pdf');
});
