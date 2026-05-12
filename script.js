/* =====================================================
   DASHBOARD E-COMMERCE — Carlos Tesoriero · @ctesorierog
   ===================================================== */

// Load data.json and then draw all 4 charts
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        drawChart1(data.sparklineIngresos);   // Canvas
        drawChart2(data.ventasPorCanal);      // SVG
        drawChart3(data.ingresosPorMes);      // Chart.js
        drawChart4(data.ingresosPorCategoria); // D3.js
    });


/* =====================================================
   CHART 1 — CANVAS — Sparkline (Ingresos últimos 12 meses)
   ===================================================== */
function drawChart1(datos) {
    const canvas = document.getElementById('chart1');
    const ctx = canvas.getContext('2d');

    // Match canvas internal size to its CSS size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;
    const padding = 30;

    // Find min and max revenue for scaling
    const values = datos.map(d => d.ingresos);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    // Map data values to x,y pixel coordinates
    const points = datos.map((d, i) => {
        const x = padding + (i / (datos.length - 1)) * (W - 2 * padding);
        const y = H - padding - ((d.ingresos - minVal) / (maxVal - minVal)) * (H - 2 * padding);
        return { x, y, label: d.mes, value: d.ingresos };
    });

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Draw gradient area below the line
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.5)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, H - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, H - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#A78BFA';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw dots on each point
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // X-axis labels (just first and last month for clarity)
    ctx.fillStyle = '#A78BFA';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(datos[0].mes, padding, H - 8);
    ctx.textAlign = 'right';
    ctx.fillText(datos[datos.length - 1].mes, W - padding, H - 8);

    // Show the latest value as a big number
    const latest = datos[datos.length - 1].ingresos;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('€' + (latest / 1000).toFixed(1) + 'K', W - padding, 24);
}


/* =====================================================
   CHART 2 — SVG — Donut (Ventas por canal)
   ===================================================== */
function drawChart2(datos) {
    const svg = document.getElementById('chart2');
    const W = svg.clientWidth;
    const H = svg.clientHeight;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) / 2 - 30;
    const innerRadius = radius * 0.6;

    // Clear previous content
    svg.innerHTML = '';

    const total = datos.reduce((sum, d) => sum + d.pedidos, 0);
    const colores = ['#7C3AED', '#0D9488'];

    let startAngle = -Math.PI / 2; // start at top

    datos.forEach((d, i) => {
        const sliceAngle = (d.pedidos / total) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;

        // Calculate path for donut slice
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);
        const x3 = cx + innerRadius * Math.cos(endAngle);
        const y3 = cy + innerRadius * Math.sin(endAngle);
        const x4 = cx + innerRadius * Math.cos(startAngle);
        const y4 = cy + innerRadius * Math.sin(startAngle);

        const largeArc = sliceAngle > Math.PI ? 1 : 0;

        const d_path = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
            'Z'
        ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d_path);
        path.setAttribute('fill', colores[i]);
        path.setAttribute('stroke', '#1a1a2e');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);

        startAngle = endAngle;
    });

    // Center text — total orders
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', cx);
    centerText.setAttribute('y', cy - 4);
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('fill', '#ffffff');
    centerText.setAttribute('font-size', '20');
    centerText.setAttribute('font-weight', 'bold');
    centerText.textContent = total.toLocaleString();
    svg.appendChild(centerText);

    const centerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerLabel.setAttribute('x', cx);
    centerLabel.setAttribute('y', cy + 14);
    centerLabel.setAttribute('text-anchor', 'middle');
    centerLabel.setAttribute('fill', '#A78BFA');
    centerLabel.setAttribute('font-size', '11');
    centerLabel.textContent = 'pedidos';
    svg.appendChild(centerLabel);

    // Legend
    datos.forEach((d, i) => {
        const pct = ((d.pedidos / total) * 100).toFixed(1);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 20);
        rect.setAttribute('y', 20 + i * 22);
        rect.setAttribute('width', 12);
        rect.setAttribute('height', 12);
        rect.setAttribute('fill', colores[i]);
        rect.setAttribute('rx', 2);
        svg.appendChild(rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 38);
        text.setAttribute('y', 30 + i * 22);
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12');
        text.textContent = `${d.canal} (${pct}%)`;
        svg.appendChild(text);
    });
}


/* =====================================================
   CHART 3 — CHART.JS — Line chart (Tendencia de ingresos)
   ===================================================== */
function drawChart3(datos) {
    const ctx = document.getElementById('chart3').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.map(d => d.mes),
            datasets: [{
                label: 'Ingresos (€)',
                data: datos.map(d => d.ingresos),
                borderColor: '#7C3AED',
                backgroundColor: 'rgba(124, 58, 237, 0.15)',
                fill: true,
                tension: 0.3,
                pointRadius: 2,
                pointBackgroundColor: '#A78BFA',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a2e',
                    borderColor: '#7C3AED',
                    borderWidth: 1,
                    titleColor: '#ffffff',
                    bodyColor: '#A78BFA'
                }
            },
            scales: {
                x: {
                    ticks: { color: '#A78BFA', font: { size: 10 }, maxTicksLimit: 8 },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: {
                        color: '#A78BFA',
                        font: { size: 10 },
                        callback: function (v) { return '€' + (v / 1000).toFixed(0) + 'K'; }
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}


/* =====================================================
   CHART 4 — D3.JS — Animated horizontal bars (Top categorías)
   ===================================================== */
function drawChart4(datos) {
    const svg = d3.select('#chart4');
    const W = svg.node().clientWidth;
    const H = svg.node().clientHeight;
    const margin = { top: 10, right: 50, bottom: 10, left: 90 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const y = d3.scaleBand()
        .domain(datos.map(d => d.categoria))
        .range([0, innerH])
        .padding(0.25);

    const x = d3.scaleLinear()
        .domain([0, d3.max(datos, d => d.ingresos)])
        .range([0, innerW]);

    // Y axis
    g.append('g')
        .call(d3.axisLeft(y).tickSize(0))
        .call(g => g.select('.domain').remove());

    // Bars with animation
    g.selectAll('rect')
        .data(datos)
        .join('rect')
        .attr('y', d => y(d.categoria))
        .attr('x', 0)
        .attr('height', y.bandwidth())
        .attr('width', 0)
        .attr('fill', '#7C3AED')
        .attr('rx', 3)
        .transition()
        .duration(800)
        .delay((d, i) => i * 80)
        .ease(d3.easeCubicOut)
        .attr('width', d => x(d.ingresos));

    // Value labels at the end of each bar
    g.selectAll('text.value')
        .data(datos)
        .join('text')
        .attr('class', 'value')
        .attr('y', d => y(d.categoria) + y.bandwidth() / 2 + 4)
        .attr('x', d => x(d.ingresos) + 6)
        .attr('fill', '#ffffff')
        .attr('font-size', '11px')
        .attr('opacity', 0)
        .text(d => '€' + (d.ingresos / 1000).toFixed(0) + 'K')
        .transition()
        .duration(500)
        .delay((d, i) => 800 + i * 80)
        .attr('opacity', 1);
}
