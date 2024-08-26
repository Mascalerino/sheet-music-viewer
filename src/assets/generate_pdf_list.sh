#!/bin/bash

# Define la carpeta de partituras y el archivo de salida
PARTITURAS_DIR="partituras"
OUTPUT_FILE="pdf-list.txt"

# Verifica si la carpeta de partituras existe
if [ ! -d "$PARTITURAS_DIR" ]; then
  echo "La carpeta $PARTITURAS_DIR no existe."
  exit 1
fi

# Limpia el archivo de salida si ya existe
> $OUTPUT_FILE

# Recorre todos los archivos PDF en la carpeta de partituras
for pdf in "$PARTITURAS_DIR"/*.pdf; do
  # Obtiene el nombre del archivo sin la extensión
  filename=$(basename -- "$pdf")
  name="${filename%.pdf}"
  
  # Escribe la línea en el archivo de salida
  echo "$name,assets/partituras/$filename" >> $OUTPUT_FILE
done

echo "Archivo $OUTPUT_FILE generado con éxito."