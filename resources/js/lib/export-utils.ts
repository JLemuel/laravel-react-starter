export function downloadTableAsCSV(data: any[], filename: string) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export function downloadTableAsExcel(data: any[], filename: string) {
    // For now, we'll use CSV as Excel (you can add actual Excel export later)
    downloadTableAsCSV(data, filename);
}

function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
} 