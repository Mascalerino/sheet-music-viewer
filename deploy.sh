#!/bin/bash

# Mostrar un mensaje informativo
echo "Actualizando el repositorio..."
# Actualizar el repositorio desde GitHub
git pull origin main

# Mostrar un mensaje informativo
echo "Instalando dependencias (si es necesario)..."
# Instalar dependencias
npm install

# Mostrar un mensaje informativo
echo "Compilando la aplicación en modo producción..."
# Compilar la aplicación Angular en modo producción
ng build --configuration production

# Mostrar un mensaje informativo
echo "Reiniciando Nginx..."
# Reiniciar Nginx para asegurar que los cambios sean reflejados
sudo systemctl restart nginx

# Mostrar un mensaje informativo
echo "Actualización y despliegue completados."