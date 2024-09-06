#!/bin/bash

# Actualizar el repositorio
echo "Actualizando el repositorio..."
git pull origin main

# Instalar dependencias si es necesario
echo "Instalando dependencias..."
npm install

# Compilar la aplicación en modo producción
echo "Compilando la aplicación..."
ng build --configuration production

# Reiniciar Apache para aplicar los cambios
echo "Reiniciando Apache..."
sudo systemctl restart apache2

echo "Despliegue completado en mascalerino.es"