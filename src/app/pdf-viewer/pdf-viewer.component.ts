import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { PdfLoaderService } from "../services/pdf-loader.service";
import * as pdfjsLib from "pdfjs-dist";
import * as JSZip from "jszip";
const FileSaver = require("file-saver");

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  @ViewChild("pdfViewer") pdfViewer!: ElementRef;

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
    this.loadPdf(pdf.url);

    // Desplazamiento al visor, asegurando que el visor se haya actualizado
    setTimeout(() => {
      this.scrollToViewer();
    }, 0);
  }
  loadPdf(url: string): void {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdf) => {
      const pdfContainer = document.getElementById("pdf-container");
      if (pdfContainer) {
        pdfContainer.innerHTML = ""; // Limpia el contenedor antes de cargar un nuevo PDF
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          pdf.getPage(pageNumber).then((page) => {
            const screenWidth = window.innerWidth;
            let scale = 1.5; // Escala por defecto

            // Cambiar la escala para dispositivos móviles
            if (screenWidth < 768) {
              scale = 0.75; // Escala más pequeña para pantallas pequeñas
            }

            const viewport = page.getViewport({ scale: scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d")!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page.render({
              canvasContext: context,
              viewport: viewport,
            });

            pdfContainer.appendChild(canvas);
          });
        }
      }
    });
  }

  scrollToViewer(): void {
    if (this.pdfViewer) {
      this.pdfViewer.nativeElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  closePdfViewer(): void {
    this.selectedPdf = null;
    const pdfContainer = document.getElementById("pdf-container");
    if (pdfContainer) {
      pdfContainer.innerHTML = "";
    }
  }

  async downloadAllPdfsAsZip(): Promise<void> {
    const zip = new JSZip();

    for (const pdf of this.pdfs) {
      // Descarga el archivo PDF
      const response = await fetch(pdf.url);
      const blob = await response.blob();

      // Usa el nombre de la lista para el archivo PDF dentro del ZIP
      zip.file(`${pdf.name}.pdf`, blob);
    }

    // Genera el archivo ZIP y descarga
    zip.generateAsync({ type: "blob" }).then((content) => {
      FileSaver.saveAs(content, "partituras.zip");
    });
  }
}
