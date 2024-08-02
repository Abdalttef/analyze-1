function handleActionButton() {
    const absenceType = document.getElementById('absence-type').value;
    const actionButton = document.getElementById('action-button');

    if (absenceType === 'بدون عذر') {
        actionButton.textContent = 'إنذار';
        actionButton.style.backgroundColor = '#ff0000';
    } else if (absenceType === 'بعذر') {
        actionButton.textContent = 'شهادة شكر';
        actionButton.style.backgroundColor = '#00bfff';
    } else {
        actionButton.textContent = 'نوع الغياب';
        actionButton.style.backgroundColor = '#bfa2db';
    }
}
