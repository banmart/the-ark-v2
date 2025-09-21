import { CSVExportData } from '../services/enhancedPerPoolBurnAnalyticsService';

export interface CSVExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: 'iso' | 'us' | 'eu';
}

export class CSVExporter {
  static formatCSVData(data: CSVExportData[], options: CSVExportOptions = {}): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const { includeHeaders = true } = options;

    const rows: string[] = [];
    
    if (includeHeaders) {
      rows.push(headers.join(','));
    }

    data.forEach(row => {
      const csvRow = headers.map(header => {
        const value = row[header as keyof CSVExportData];
        
        // Handle strings that contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
      
      rows.push(csvRow);
    });

    return rows.join('\n');
  }

  static downloadCSV(
    data: CSVExportData[], 
    options: CSVExportOptions = {}
  ): void {
    const { filename = 'ark-burn-analytics.csv' } = options;
    
    try {
      const csvContent = this.formatCSVData(data, options);
      
      // Add timestamp to filename
      const timestamp = new Date().toISOString().split('T')[0];
      const finalFilename = filename.replace('.csv', `_${timestamp}.csv`);
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', finalFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      throw new Error('Failed to download CSV file');
    }
  }

  static async generateAnalyticsReport(
    data: CSVExportData[]
  ): Promise<string> {
    if (data.length === 0) return 'No data available for report generation.';

    const totalBurn = data.reduce((sum, row) => sum + parseFloat(row.burn_human), 0);
    const totalVolumeUSD = data.reduce((sum, row) => sum + parseFloat(row.volume_usd), 0);
    const avgEfficiency = data.reduce((sum, row) => sum + parseFloat(row.efficiency_percentage), 0) / data.length;
    
    const topPoolByBurn = data.reduce((max, row) => 
      parseFloat(row.burn_human) > parseFloat(max.burn_human) ? row : max
    );
    
    const topPoolByVolume = data.reduce((max, row) => 
      parseFloat(row.volume_usd) > parseFloat(max.volume_usd) ? row : max
    );

    const report = `
ARK Token Burn Analytics Report
Generated: ${new Date().toISOString()}

SUMMARY STATISTICS:
- Total Pools Analyzed: ${data.length}
- Total Burn Amount: ${totalBurn.toFixed(6)} ARK
- Total Volume (USD): $${totalVolumeUSD.toFixed(2)}
- Average Efficiency: ${avgEfficiency.toFixed(4)}%

TOP PERFORMERS:
- Highest Burn Pool: ${topPoolByBurn.pair} (${parseFloat(topPoolByBurn.burn_human).toFixed(6)} ARK)
- Highest Volume Pool: ${topPoolByVolume.pair} ($${parseFloat(topPoolByVolume.volume_usd).toFixed(2)})

DETAILED DATA:
${this.formatCSVData(data)}
`;

    return report;
  }
}

export const csvExporter = new CSVExporter();