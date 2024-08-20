import { Component, OnInit } from "@angular/core";
import { PdfLoaderService } from "../services/pdf-loader.service";

interface Pdf {
  name: string;
  url: string;
}

@Component({
  selector: "app-pdf-list",
  templateUrl: "./pdf-viewer.component.html",
})
export class PdfListComponent implements OnInit {
  pdfs: Pdf[] = [];
  filteredPdfs: Pdf[] = [];
  selectedPdf: Pdf | null = null;
  searchTerm: string = "";

  constructor(private pdfLoaderService: PdfLoaderService) {}

  ngOnInit(): void {
    this.pdfLoaderService.getPdfList().subscribe((lines) => {
      this.parsePdfList(lines);
      this.filteredPdfs = this.pdfs; // Inicializa la lista filtrada
    });
  }

  parsePdfList(lines: string[]): void {
    this.pdfs = lines.map((line) => {
      const [name, url] = line.split(",");
      return { name: name.trim(), url: url.trim() };
    });

    this.sortPdfs();
  }

  sortPdfs(): void {
    this.pdfs.sort((a, b) => a.name.localeCompare(b.name));
  }

  filterPdfs(): void {
    const normalizedSearchTerm = this.normalizeString(this.searchTerm);
    this.filteredPdfs = this.pdfs.filter((pdf) =>
      this.normalizeString(pdf.name).includes(normalizedSearchTerm)
    );
  }

  normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Elimina acentos y diacríticos
  }

  selectPdf(pdf: Pdf): void {
    this.selectedPdf = pdf;
  }

  closePdfViewer(): void {
    this.selectedPdf = null;
  }
}
