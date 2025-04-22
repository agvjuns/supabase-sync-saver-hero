import React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UploadCloud, Download, FileSpreadsheet, FileJson, FileText, Loader2, X as Close } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { exportToCsv, exportToExcel, exportToJson, downloadFile, importFromFile } from '@/services/inventory/importExport';
import { InventoryItem } from '@/services/inventory/types';
import { useAuth } from '@/hooks/useAuth';

interface ImportExportProps {
  items: InventoryItem[];
  onImportComplete: () => void;
}

const ImportExport = ({ items, onImportComplete }: ImportExportProps) => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useAuth();

  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    if (!items.length) {
      toast.error('No items to export');
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      switch (format) {
        case 'csv': {
          const csvData = exportToCsv(items);
          downloadFile(csvData, `inventory-export-${timestamp}.csv`);
          toast.success('Inventory exported as CSV');
          break;
        }
        case 'excel': {
          const excelData = exportToExcel(items);
          downloadFile(excelData, `inventory-export-${timestamp}.xlsx`);
          toast.success('Inventory exported as Excel');
          break;
        }
        case 'json': {
          const jsonData = exportToJson(items);
          downloadFile(jsonData, `inventory-export-${timestamp}.json`);
          toast.success('Inventory exported as JSON');
          break;
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Export failed: ${(error as Error).message}`);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to import data');
      return;
    }

    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    // Validate file extension
    const validExtensions = ['.csv', '.xlsx', '.json'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Invalid file format. Please use CSV, Excel, or JSON');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      const importedCount = await importFromFile(
        file, 
        user.id,
        (progress) => setImportProgress(progress)
      );
      
      toast.success(`Successfully imported ${importedCount} items`);
      onImportComplete();
      setIsImportOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Import failed: ${(error as Error).message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-1">
            <UploadCloud className="h-4 w-4 mr-1 text-white" />
            <span className="font-semibold text-white">Import Inventory</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-blue-500/10">
          <DialogHeader className="flex justify-between items-center mb-4 border-b border-blue-200 pb-4">
            <DialogTitle className="text-xl font-bold text-blue-900">Import Inventory</DialogTitle>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setIsImportOpen(false)}
            >
              <Close className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <div className="py-4 px-4">
            {isImporting ? (
              <div className="space-y-4 p-4">
                <div className="text-center text-muted-foreground">Importing your data...</div>
                <Progress value={importProgress} className="h-2" />
                <div className="text-center text-sm text-muted-foreground">{importProgress}% complete</div>
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center border-2 border-blue-300 rounded-lg p-8 transition-colors
                 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud className="h-10 w-10 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-2 text-center">
                  Drag and drop a file or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4 text-center">
                  Supported formats: CSV, Excel (.xlsx), JSON
                </p>
                
                <div className="flex space-x-4">
                  <Button variant="default" className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-full px-6 py-2 shadow-md" onClick={() => document.getElementById('file-upload')?.click()}>
                    Select File
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-400 text-blue-600 hover:bg-blue-50 font-medium rounded-full px-6 py-2"
                    onClick={() => {
                      const templateItems = [{
                        name: '(Required)',
                        location: '(Recommended)',
                        coordinates: {
                          lat: 0,
                          lng: 0
                        },
                        quantity: '(Recommended)',
                        status: '(Recommended)',
                        category: '(Recommended)',
                        description: '',
                        price: 0,
                        currency: 'USD',
                        uom: 'Unit',
                        sku: '',
                        minimumStock: 0,
                        supplierInfo: '',
                        lastUpdated: ''
                      } as unknown as InventoryItem];
                      const excelData = exportToExcel(templateItems);
                      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                      downloadFile(excelData, `inventory-template-${timestamp}.xlsx`);
                    }}
                  >
                    Download Template
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileInput}
                />
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground space-y-2">
            <p>• File must be less than 5MB</p>
            <p>• Required columns: name</p>
            <p>• Recommended columns: location, quantity, status, category</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileText className="h-4 w-4 mr-2" />
            <span>Export as CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            <span>Export as Excel</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('json')}>
            <FileJson className="h-4 w-4 mr-2" />
            <span>Export as JSON</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImportExport;
