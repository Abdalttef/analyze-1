document.addEventListener('DOMContentLoaded', function() {
    const deleteAllResultsButton = document.querySelector('.buttons .btn:nth-child(2)');
    const fileListContainer = document.getElementById('file-list');

    // Function to update file list display
    const updateFileListDisplay = function(event) {
        const fileList = event.target.files;
        if (fileList.length === 0) {
            fileListContainer.textContent = 'لم يتم تحديد أي ملفات.';
        } else {
            const fileNames = Array.from(fileList).map(file => file.name).join('\n');
            fileListContainer.textContent = fileNames;
        }
    };

    // Event listener for file input change
    document.getElementById('file-input').addEventListener('change', updateFileListDisplay);

    // Event listener for delete all results button
    deleteAllResultsButton.addEventListener('click', function() {
        // Remove all child elements (files) from the file list container
        while (fileListContainer.firstChild) {
            fileListContainer.removeChild(fileListContainer.firstChild);
        }
    });

    // Event listener for fetch data button
    document.getElementById('fetch-data-btn').addEventListener('click', function() {
        const fileInput = document.getElementById('file-input');
        const files = fileInput.files;

        if (files.length === 0) {
            alert('يرجى اختيار ملفات الإكسل أولا.');
            return;
        }

        let totalStudents = 0;
        let totalDays = 0;

        const readFile = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    const studentCount = sheetData.length - 1; // Assuming first row is header
                    const dayCount = sheetData[0].length - 1; // Assuming first column is student names

                    totalStudents += studentCount;
                    totalDays += dayCount;

                    resolve();
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        };

        const readFiles = async () => {
            for (let file of files) {
                await readFile(file);
            }
            alert(`عدد الطلاب: ${totalStudents}\nعدد أيام المدرسة: ${totalDays}`);
        };

        readFiles().catch(error => {
            console.error('Error reading files:', error);
            alert('حدث خطأ أثناء قراءة الملفات.');
        });
    });
});
