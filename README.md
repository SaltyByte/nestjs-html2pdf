# NestJS PDF Generation Module

This module for NestJS leverages Puppeteer to generate PDF documents from HTML. It supports generating a single PDF from HTML content and creating multiple PDFs from an array of HTML strings.

## Features

- Generate PDF from a single HTML string.
- Generate multiple PDFs from an array of HTML strings.
- Custom PDF options including page format, margins, and more.
- Secure Puppeteer usage with sandbox disabled for server environments.

## Installation

Install the module using npm:

```bash
npm install --save nestjs-pdf
```

## Usage

Importing the Module
First, import the PdfModule into your NestJS module:

```bash
import { Module } from '@nestjs/common';
import { PdfModule } from 'nestjs-pdf';

@Module({
imports: [PdfModule],
})
export class AppModule {}
```

## Using the service

```bash
import { Injectable } from '@nestjs/common';
import { PdfService, PdfFileOptions, PdfMultipleFilesOptions } from 'nestjs-pdf';

@Injectable()
export class YourService {
  constructor(private pdfService: PdfService) {}

  async createSinglePdf() {
    const options: PdfFileOptions = {
      html: '<h1>Title</h1><p>This is a PDF generated from HTML.</p>',
      pdfOptions: { format: 'A4' }
    };
    const pdfBuffer = await this.pdfService.createPdf(options);
    // Save, send or manipulate the PDF file stored in pdfBuffer
  }

  async createMultiplePdfs() {
    const options: PdfMultipleFilesOptions = {
      htmls: [
        '<h1>Say hello</h1>',
        '<h1>Say hello again</h1>'
      ],
      pdfOptions: { format: 'A4' }
    };
    const pdfBuffers = await this.pdfService.createMultiplePdfs(options);
    // Each buffer in pdfBuffers corresponds to one of the HTML strings
  }
}
```

## Configuration

The service accepts the following options:

- html: A string of HTML to convert to PDF.
- args: Additional command-line arguments to pass to Puppeteer's browser instance.
- pdfOptions: Options for the generated PDF, such as format, margin, and more.
