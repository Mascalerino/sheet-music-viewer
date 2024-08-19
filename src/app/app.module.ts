import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; // Importa MatIconModule
import { MatTooltipModule } from '@angular/material/tooltip'; // Importa MatTooltipModule

import { AppComponent } from './app.component';
import { PdfListComponent } from './pdf-viewer/pdf-viewer.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { PdfLoaderService } from 'src/app/services/pdf-loader.service';

@NgModule({
  declarations: [AppComponent, PdfListComponent, SafeUrlPipe],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatIconModule, // Asegúrate de importar MatIconModule aquí
    MatTooltipModule, // Asegúrate de importar MatTooltipModule aquí
  ],
  providers: [PdfLoaderService],
  bootstrap: [AppComponent],
})
export class AppModule {}
