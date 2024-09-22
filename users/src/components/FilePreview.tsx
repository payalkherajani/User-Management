import React, { useRef } from 'react';
import { Button, styled } from '@mui/material';
import mammoth from 'mammoth';

// Styled input component
const Input = styled('input')({
  display: 'none',
});

const FilePreview: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    const fileUrl = URL.createObjectURL(file);

    if (fileType === 'application/pdf') {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.location.href = fileUrl;
        newWindow.focus();
      } else {
        alert('Please allow pop-ups in your browser for this site.');
      }
    } else if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(result.value);
          newWindow.document.title = file.name;
        } else {
          alert('Please allow pop-ups in your browser for this site.');
        }
      } catch (error) {
        console.error('Error converting file:', error);
      }
    } else if (fileType === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const newWindow = window.open('', '_blank');
        if (newWindow && e.target) {
          newWindow.document.write(`<pre>${e.target.result}</pre>`);
          newWindow.document.title = file.name;
        } else {
          alert('Please allow pop-ups in your browser for this site.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Unsupported file type! Please select a PDF, DOC, DOCX, or TXT file.');
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">
        <Input
          accept=".pdf,.doc,.docx,.txt"
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <Button variant="outlined" component="span">
          Upload File
        </Button>
      </label>
    </div>
  );
};

export default FilePreview;
