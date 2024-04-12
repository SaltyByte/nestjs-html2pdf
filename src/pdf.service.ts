import { Injectable } from "@nestjs/common";
import inlineCss from "inline-css";
import { launch, PDFOptions, BrowserLaunchArgumentOptions } from "puppeteer";

export type PdfFileOptions = {
  html: string;
  args?: string[];
  pdfOptions?: PDFOptions;
};

export type PdfMultipleFilesOptions = {
  htmls: string[];
  args?: string[];
  pdfOptions?: PDFOptions;
};

@Injectable()
export class PdfService {
  async createPdf(options: PdfFileOptions): Promise<Buffer> {
    const { html, pdfOptions = {}, args = [] } = options;
    if (typeof html !== "string") {
      throw new Error("HTML must be a string.");
    }
    const defaultArgs = new Set([
      "--no-sandbox",
      "--disable-setuid-sandbox",
      ...args,
    ]);
    const defaultLaunchOptions: BrowserLaunchArgumentOptions = {
      headless: true,
      args: [...defaultArgs],
    };
    const defaultOptions: PDFOptions = { format: "A4", ...pdfOptions };
    const browser = await launch(defaultLaunchOptions);
    try {
      const page = await browser.newPage();
      const inlinedPdf = await inlineCss(html, { url: "/" });
      await page.setContent(inlinedPdf);
      return await page.pdf(defaultOptions);
    } catch (error) {
      console.error("Failed to create PDF:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async createMultiplePdfs(
    options: PdfMultipleFilesOptions
  ): Promise<Buffer[]> {
    const { htmls, pdfOptions = {}, args = [] } = options;
    if (!Array.isArray(htmls)) {
      throw new Error("HTMLs must be an array of strings.");
    }
    const defaultArgs = new Set([
      "--no-sandbox",
      "--disable-setuid-sandbox",
      ...args,
    ]);
    const defaultLaunchOptions: BrowserLaunchArgumentOptions = {
      headless: true,
      args: [...defaultArgs],
    };
    const defaultOptions: PDFOptions = { format: "A4", ...pdfOptions };
    const browser = await launch(defaultLaunchOptions);
    try {
      const pdfPromises: Promise<Buffer>[] = [];
      for (const html of htmls) {
        pdfPromises.push(
          (async () => {
            const page = await browser.newPage();
            try {
              const inlinedPdf = await inlineCss(html, { url: "/" });
              await page.setContent(inlinedPdf);
              return await page.pdf(defaultOptions);
            } finally {
              await page.close();
            }
          })()
        );
      }
      return await Promise.all(pdfPromises);
    } catch (error) {
      console.error("Failed to create PDF:", error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
