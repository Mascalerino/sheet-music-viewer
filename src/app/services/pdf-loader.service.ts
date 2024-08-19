import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PdfLoaderService {
  private txtFilePath = "assets/pdf-list.txt";

  constructor(private http: HttpClient) {}

  getPdfList(): Observable<string[]> {
    return this.http.get(this.txtFilePath, { responseType: "text" }).pipe(
      map((data) =>
        data
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "")
      )
    );
  }
}
