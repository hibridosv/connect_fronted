# 📊 Pulse - Sistema de Gestión Empresarial

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Laravel](https://img.shields.io/badge/Backend:_Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)

**Pulse** es una aplicación web moderna y completa, diseñada para la gestión de inventario, ventas y control de negocio. Construida con Next.js y TypeScript, ofrece una interfaz de usuario rápida, reactiva y estéticamente agradable gracias a Tailwind CSS y un sistema de temas dinámico.

![Captura de Pantalla de Pulse](https://via.placeholder.com/800x450.png?text=Vista+Previa+de+la+Aplicación)

---

## ✨ Características Principales

-   **📦 Gestión de Productos:** Control total sobre el inventario, incluyendo registro, edición, stock, kardex y productos vinculados.
-   **📈 Dashboard Analítico:** Visualización de datos clave del negocio con gráficos de ventas por día y semana.
-   **🔐 Autenticación Segura:** Integración con Laravel Passport a través de NextAuth.js para un inicio de sesión robusto basado en credenciales.
-   **🎨 Sistema de Temas Dinámico:** Permite al usuario cambiar la apariencia de la aplicación entre varios temas predefinidos (`mdb`, `blue`, `green`, `navy`).
-   **📱 Diseño Responsivo:** Interfaz completamente adaptable a diferentes tamaños de pantalla, desde móviles hasta escritorios.
-   **🔍 Búsqueda y Paginación:** Componentes optimizados para navegar y buscar eficientemente a través de grandes volúmenes de datos.
-   **💵 Control de Cajas (Cash Drawers):** Funcionalidad para administrar cortes de caja y movimientos de efectivo.

---

## 🚀 Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### Pre-requisitos

Asegúrate de tener instalado lo siguiente:
-   [Node.js](https://nodejs.org/) (v20.x o superior)
-   [npm](https://www.npmjs.com/) (v10.x o superior) o [yarn](https://yarnpkg.com/)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/pulse.git
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd pulse
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto. Este archivo es **obligatorio** para el correcto funcionamiento de la aplicación.

    ```dotenv
    # ========================
    # API y Autenticación
    # ========================
    # URL base de la API de Laravel
    NEXT_PUBLIC_URL_API=http://pulse-api.test/api

    # URL completa de tu aplicación Next.js (para NextAuth)
    NEXTAUTH_URL=http://localhost:3000

    # Clave secreta para firmar los JWT de NextAuth (genera una con: openssl rand -base64 32)
    NEXTAUTH_SECRET=Th3S3cr3tK3yG0esH3re

    # ========================
    # Real-Time (Pusher)
    # ========================
    # Clave de la aplicación Pusher
    NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
    
    # Cluster de la aplicación Pusher
    NEXT_PUBLIC_PUSHER_CLUSTER=mt1
    ```

### Ejecución

-   **Modo Desarrollo:**
    Ejecuta el siguiente comando para iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

-   **Modo Producción:**
    Para compilar la aplicación para producción y ejecutarla:
    ```bash
    npm run build
    npm run start
    ```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
-   **Framework:** [Next.js](https://nextjs.org/)
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand)
-   **Autenticación:** [NextAuth.js](https://next-auth.js.org/)
-   **Peticiones HTTP:** [Axios](https://axios-http.com/)
-   **Gráficos:** [Chart.js](https://www.chartjs.org/) con `react-chartjs-2`
-   **Formularios:** [React Hook Form](https://react-hook-form.com/)
-   **Notificaciones:** [React Hot Toast](https://react-hot-toast.com/)
-   **Iconos:** [React Icons](https://react-icons.github.io/react-icons/)

### Backend (Consumido por el Frontend)
-   **API:** [Laravel](https://laravel.com/)
-   **Autenticación API:** [Laravel Passport](https://laravel.com/docs/passport) (OAuth2)
-   **Eventos en tiempo real:** [Laravel Echo](https://laravel.com/docs/broadcasting) con [Pusher](https://pusher.com/)

### Dev-Tools
-   **Linting:** [ESLint](https://eslint.org/)
-   **Formateo:** Configurado según las convenciones del proyecto.

---

## 📂 Estructura del Proyecto

El proyecto sigue una estructura organizada para facilitar la escalabilidad y el mantenimiento:

```
/src
├── /app            # Rutas de la aplicación (App Router de Next.js)
│   ├── /api        # Rutas de API de Next.js (ej. NextAuth)
│   └── ...         # Páginas y layouts de cada ruta
├── /components     # Componentes React reutilizables
├── /hooks          # Hooks personalizados para la lógica de negocio
├── /interfaces     # Definiciones de tipos y interfaces de TypeScript
├── /lib            # Funciones de utilidad y configuración
├── /providers      # Proveedores de contexto de React
├── /services       # Lógica de comunicación con la API (httpService)
├── /stores         # Stores de Zustand para el manejo de estado global
└── /styles         # Estilos globales y configuración de temas
```

---
## 🎨 Sistema de Temas

La aplicación cuenta con un sistema de temas personalizable basado en variables CSS y un `data-theme` attribute en la etiqueta `<html>`.

-   **Cómo funciona:** Los colores se definen como variables CSS en `src/styles/globals.css`. El tema activo se controla mediante el atributo `data-theme`.
-   **Temas Disponibles:**
    -   `mdb` (Default): Azul-grisáceo oscuro.
    -   `blue`: Azul profundo.
    -   `green`: Verde oscuro.
    -   `navy`: Azul marino.
-   **Switching:** El cambio de tema se gestiona con un store de Zustand (`themeStore.ts`) y se puede realizar desde el componente `Drawer`.

---

## 📜 Política de Desarrollo Interno

Este es un proyecto de código cerrado para uso exclusivo de la empresa **Hibrido**. No se aceptan contribuciones públicas.

### Flujo de Trabajo para Nuevas Características

Todo el desarrollo debe seguir el siguiente flujo de trabajo para mantener la coherencia y calidad del código:

1.  **Crear una Rama:**
    A partir de la rama `main`, crea una nueva rama para tu tarea. Utiliza los siguientes prefijos según el tipo de tarea:
    -   `feature/<nombre-descriptivo>` para nuevas funcionalidades.
    -   `fix/<nombre-descriptivo>` para corrección de errores.
    -   `refactor/<nombre-descriptivo>` para mejoras de código sin cambiar la funcionalidad.

    ```bash
    # Ejemplo para una nueva característica
    git checkout -b feature/gestion-de-usuarios
    ```

2.  **Desarrollar:**
    Implementa los cambios en tu rama. Realiza commits atómicos y descriptivos.

3.  **Verificar Calidad de Código:**
    Antes de solicitar una revisión, asegúrate de que el código cumple con los estándares de linting del proyecto.
    ```bash
    npm run lint
    ```
    Corrige todos los errores y advertencias reportados.

4.  **Crear Pull Request (PR):**
    Una vez que la tarea esté completa y verificada, haz push de tu rama al repositorio remoto y abre un **Pull Request** dirigido a la rama `main`.

5.  **Revisión de Código y Fusión:**
    El PR será revisado por el equipo. Una vez aprobado, será fusionado a `main`. No se deben fusionar ramas sin la aprobación de al menos un revisor.

---

## 📄 Licencia

Este proyecto es propiedad de **Hibrido**. Todos los derechos reservados.
