# Dashboard E-commerce — Visualización de Datos

**Autor:** Carlos Tesoriero · @ctesorierog

Panel de control que visualiza datos de un e-commerce ficticio mediante cuatro tecnologías de gráficos web:

| # | Tecnología | Gráfico | Datos |
|---|---|---|---|
| 1 | **Canvas (JavaScript)** | Sparkline | Ingresos de los últimos 12 meses |
| 2 | **SVG (JavaScript)** | Donut chart | Ventas por canal (Web vs App) |
| 3 | **Chart.js** | Line chart | Tendencia de ingresos mensuales |
| 4 | **D3.js** | Barras horizontales animadas | Top categorías por ingresos |

## Estructura del proyecto

```
dashboard-ecommerce/
├── index.html       Estructura HTML
├── style.css        Estilos (tema oscuro)
├── script.js        Lógica de los 4 gráficos
└── data.json        Datos agregados
```

## Cómo ejecutar

Abrir `index.html` en un navegador moderno (Chrome / Firefox / Edge).

> Si `data.json` no carga al abrir el archivo localmente, servir la carpeta con un servidor local. Ejemplo con Python:
> ```bash
> python -m http.server 8000
> ```
> y abrir http://localhost:8000

## Columnas calculadas (aplicadas al dataset original)

- `IngresoLinea` = `NumUnidades * PrecioUnitarioVenta * (1 - DescuentoLineaPct)`
- `CosteLinea`, `BeneficioLinea`, `MargenLineaPct`
- `MargenBruto`, `MargenPct` en Productos
- `RetrasoEntregaDias` en Pedidos
