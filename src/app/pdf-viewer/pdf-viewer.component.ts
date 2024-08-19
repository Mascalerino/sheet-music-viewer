import { Component, OnInit } from "@angular/core";
import { PdfLoaderService } from "../services/pdf-loader.service";

interface Pdf {
  name: string;
  url: string;
}

interface Category {
  name: string;
  pdfs: Pdf[];
}

@Component({
  selector: "app-pdf-list",
  templateUrl: "./pdf-viewer.component.html",
})
export class PdfListComponent implements OnInit {
  categories: Category[] = [];
  allCategories: Category[] = []; // Guardar la lista completa de categorías
  selectedPdf: Pdf | null = null;
  searchTerm: string = "";

  constructor(private pdfLoaderService: PdfLoaderService) {}

  ngOnInit(): void {
    this.pdfLoaderService.getPdfList().subscribe((lines) => {
      this.parseCategories(lines);
      this.allCategories = JSON.parse(JSON.stringify(this.categories)); // Guardar copia de la lista completa
    });
  }

  parseCategories(lines: string[]): void {
    let currentCategory: Category | null = null;

    lines.forEach((line) => {
      if (line.startsWith("#")) {
        if (currentCategory) {
          this.categories.push(currentCategory);
        }
        currentCategory = { name: line.substring(1).trim(), pdfs: [] };
      } else if (currentCategory && line) {
        const [name, url] = line.split(",");
        currentCategory.pdfs.push({ name: name.trim(), url: url.trim() });
      }
    });

    if (currentCategory) {
      this.categories.push(currentCategory);
    }

    this.sortPdfsInCategories();
  }

  sortPdfsInCategories(): void {
    this.categories.forEach((category) => {
      category.pdfs.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  filterPdfs(): void {
    const normalizedSearchTerm = this.normalizeString(this.searchTerm);

    if (!normalizedSearchTerm) {
      // Si el término de búsqueda está vacío, restaurar la lista original
      this.categories = JSON.parse(JSON.stringify(this.allCategories));
    } else {
      // Aplicar filtro a la copia original de las categorías
      this.categories = this.allCategories.map((category) => {
        return {
          ...category,
          pdfs: category.pdfs.filter((pdf) =>
            this.normalizeString(pdf.name).includes(normalizedSearchTerm)
          ),
        };
      });
    }
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
