import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface PdfEntry {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PdfLoaderService {
  private txtFilePath = 'assets/pdf-list.txt';

  constructor(private http: HttpClient) {}

  getPdfList(): Observable<PdfEntry[]> {
    return this.http.get(this.txtFilePath, { responseType: 'text' }).pipe(
      map((data) => {
        return data
          .split('\n')
          .filter((line) => line.trim() !== '' && !line.startsWith('#')) // Ignora líneas vacías y comentarios
          .map((line) => {
            const [name, url] = line.split(',');
            return { name: name.trim(), url: url.trim() };
          });
      })
    );
  }
}
