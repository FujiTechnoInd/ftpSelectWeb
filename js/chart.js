/**
 * @file グラフ描画関連の処理
 * このファイルは、メインのSVG性能選定グラフと、Chart.jsを使用した詳細性能グラフの
 * 描画、更新、破棄に関するすべてのロジックを管理します。
 */

// 必要なモジュールをインポート
import { CONSTANTS, currentModel, getProductData } from './app.js';
import { updateUI, getDetailsData, clearProductDetails, renderProductDetails } from './ui.js';

// 現在アクティブなChart.jsインスタンスを保持する配列。グラフを破棄する際に使用します。
let activeDetailCharts = [];

/**
 * 表示されているすべてのメインSVGグラフをDOMから削除します。
 */
export function destroyMainSvgCharts() {
    const productData = getProductData();
    productData.forEach(product => {
        const container = document.getElementById(`chart-container-${product.id}`);
        if (container) {
            const title = container.querySelector('.chart-title');
            container.innerHTML = '';
            if (title) {
                container.appendChild(title);
            }
        }
    });
}

/**
 * 表示されているすべての詳細Chart.jsグラフを破棄（destroy）します。
 * これにより、メモリリークを防ぎ、パフォーマンスを維持します。
 */
export function destroyDetailCharts() {
    activeDetailCharts.forEach(chart => chart.destroy());
    activeDetailCharts = [];
}

/**
 * 指定された製品カラムに対応するメインSVGグラフを描画します。
 * @param {HTMLElement} column - グラフを描画する対象の製品カラム要素。
 */
export function renderProductCharts(column) {
    destroyMainSvgCharts();
    const button = column.querySelector('.product-button');
    if (!button) return;
    const productId = button.dataset.modelId;
    const product = getProductData().find(p => p.id === productId);
    if (!product || !product.charts) return;

    renderMainSvgChart(product, `chart-container-${product.id}`, product.charts.chart1);
}

/**
 * SVG要素を動的に生成し、性能選定グラフを描画します。
 * @param {object} product - 製品データオブジェクト。
 * @param {string} containerId - SVGを挿入するコンテナ要素のID。
 * @param {object} chartData - グラフのデータセット。
 */
function renderMainSvgChart(product, containerId, chartData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let titleEl = container.querySelector('.chart-title');
    if (!titleEl) {
        titleEl = document.createElement('h4');
        titleEl.className = 'chart-title';
        titleEl.textContent = CONSTANTS.MAIN_CHART_LABELS.label || 'グラフ';
        container.appendChild(titleEl);
    }

    const datasets = chartData.datasets;
    if (!datasets || datasets.length === 0) return;

    // SVGとグラフエリアのサイズ、パディングを定義
    const svgWidth = 500;
    const svgHeight = 250;
    const padding = { top: 40, right: 40, bottom: 40, left: 60 };

    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    // 全データポイントからX軸とY軸の最大・最小値を計算
    const allDataPoints = datasets.flatMap(ds => ds.data);
    const xValues = allDataPoints.map(d => d.x);
    const yValues = allDataPoints.map(d => d.y);

    let minX = 0;
    // X軸の最大値は見栄えが良いように切り上げる
    let maxX = Math.max(...xValues);
    let minY = Math.min(...yValues);
    let maxY = Math.max(...yValues);

    if (minY === maxY) {
        minY = minY - 0.1;
        maxY = maxY + 0.1;
    } else {
        minY = 0;
        maxY = maxY * 1.1;
    }

    maxX = Math.ceil(maxX * 1.05);
    if (maxX <= 1) {
        maxX = 1;
    } else if (maxX <= 5) {
        maxX = Math.ceil(maxX);
    } else if (maxX <= 10) {
        maxX = Math.ceil(maxX / 2) * 2;
    } else if (maxX <= 50) {
        maxX = Math.ceil(maxX / 5) * 5;
    } else {
        maxX = Math.ceil(maxX / 10) * 10;
    }

    // データ値をSVG座標に変換するためのスケール関数
    const scaleX = (val) => padding.left + ((val - minX) / (maxX - minX)) * chartWidth;
    const scaleY = (val) => (val === 0 ? padding.top + chartHeight : padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight);

    // Y軸の底辺（0の位置）のY座標
    const yBottom = scaleY(minY);

    let areasHTML = '';
    let textsHTML = '';

    // データセットごとにループし、SVGの<path>（領域）と<text>（ラベル）のHTMLを生成
    datasets.forEach((ds) => {
        const label = ds.label;
        const data = ds.data;
        const color = ds.backgroundColor;
        const isHorizontalArea = data.every(d => d.y === data[0].y);
        let d, textX, textY;
        const pathStyle = `fill="${color}"; stroke: ${ds.borderColor};`;

        // ラベル位置の計算ロジック
        if (isHorizontalArea) {
            const x1 = scaleX(data[0].x);
            const x2 = scaleX(data[data.length - 1].x);
            const yLine = scaleY(data[0].y);
            d = `M ${x1} ${yBottom} L ${x1} ${yLine} L ${x2} ${yLine} L ${x2} ${yBottom} Z`;
            textX = (x1 + x2) / 2;
            textY = yLine + (yBottom - yLine) / 2 + 6; // 基本位置

            // 特定のラベルが重なるのを防ぐためにY座標を微調整
            if ( label === '208A' || label === '212A') {
                textY += 30; // 少し下にずらす
            }
            if (label === '204A' || label === '320H') {
                textY -= 15; // 少し上にずらす
            }
        } else {
            const points = data.map(d => `${scaleX(d.x)} ${scaleY(d.y)}`).join(' L ');
            const firstPoint = data[0];
            const lastPoint = data[data.length - 1];
            d = `M ${scaleX(firstPoint.x)} ${yBottom} L ${points} L ${scaleX(lastPoint.x)} ${yBottom} Z`;
            textX = scaleX(lastPoint.x) - 15;
            textY = scaleY(lastPoint.y) - 15;
        }

        areasHTML += `<path d="${d}" fill="${color}" class="svg-chart-area" data-submodel="${label}" style="${pathStyle}" />`;
        textsHTML += `<text x="${textX}" y="${textY}" text-anchor="middle" class="svg-chart-text">${label}</text>`;
    });

    // X軸の目盛りを計算
    let tickInterval = 1;
    if (maxX > 50) tickInterval = 10;
    else if (maxX > 10) tickInterval = 5;
    else if (maxX > 5) tickInterval = 2;
    else if (maxX <= 1) tickInterval = 0.2;

    const xAxisTicks = [];
    for (let i = 0; i <= maxX; i += tickInterval) {
        xAxisTicks.push({ val: i, x: scaleX(i) });
    }

    // Y軸の目盛りを計算
    const yAxisTicks = [];
    const yTickCount = (maxY < 1 ? 4 : 2);
    for (let i = 0; i <= yTickCount; i++) {
        const val = minY + (maxY - minY) * (i / yTickCount);
        yAxisTicks.push({ val: val.toFixed(1), y: scaleY(val) });
    }

    // 軸と目盛りのSVG HTMLを生成
    const axisHTML = `
        <line x1="${padding.left}" y1="${yBottom}" x2="${scaleX(maxX)}" y2="${yBottom}" stroke="#9ca3af" />
        <text x="${padding.left + chartWidth / 2}" y="${svgHeight - 5}" text-anchor="middle" fill="#4b5563" font-size="14">${CONSTANTS.MAIN_CHART_LABELS.xAxisLabel || 'X軸'}</text>
        ${xAxisTicks.map(tick => `<text x="${tick.x}" y="${yBottom + 15}" text-anchor="middle" fill="#4b5563" font-size="12">${tick.val.toFixed(maxX <= 1 ? 1 : 0)}</text>`).join('')}
        
        <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${yBottom}" stroke="#9ca3af" />
        <text x="${padding.left - 40}" y="${padding.top + chartHeight / 2}" text-anchor="middle" fill="#4b5563" font-size="14" transform="rotate(-90 ${padding.left - 40} ${padding.top + chartHeight / 2})">${CONSTANTS.MAIN_CHART_LABELS.yAxisLabel || 'Y軸'}</text>
        ${yAxisTicks.map(tick => `<text x="${padding.left - 10}" y="${tick.y}" text-anchor="end" dominant-baseline="middle" fill="#4b5563" font-size="12">${tick.val}</text>`).join('')}
    `;

    // SVG要素を組み立ててDOMに追加
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svgElement.setAttribute("class", "svg-chart");
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.innerHTML = axisHTML + areasHTML + textsHTML;

    if (currentModel.chartSelection) {
        const activeArea = svgElement.querySelector(`.svg-chart-area[data-submodel="${currentModel.chartSelection}"]`);
        if (activeArea) activeArea.classList.add('active');
    }

    // 各領域にクリックイベントリスナーを設定
    svgElement.querySelectorAll('.svg-chart-area').forEach(area => {
        area.addEventListener('click', (event) => {
            const subModelLabel = event.target.dataset.submodel;
            const isActive = event.target.classList.contains('active');

            // すべての領域のアクティブ状態を解除
            svgElement.querySelectorAll('.svg-chart-area').forEach(a => a.classList.remove('active'));

            // 詳細表示をクリア
            clearProductDetails(product.id);

            // 既にアクティブな領域をクリックした場合は選択解除
            if (isActive) {
                currentModel.chartSelection = null;
            // 新しい領域をクリックした場合は選択
            } else {
                event.target.classList.add('active');
                currentModel.chartSelection = subModelLabel;

                const l4Container = document.querySelector(`.col-${product.id} .options-level-4-container`);
                const shouldRenderDetails = (product.id === '1RA' && product.details) ||
                    (l4Container && l4Container.style.display === 'block');

                // 詳細表示の条件が満たされていれば、詳細をレンダリング
                if (shouldRenderDetails) {
                    const detailsData = getDetailsData(product.id, currentModel.optionL1, currentModel.optionL2);
                    if (detailsData) {
                        renderProductDetails(detailsData, subModelLabel);
                    }
                }
            }
            // UI全体を更新
            updateUI(true);
        });
    });

    const existingSvg = container.querySelector('.svg-chart');
    if (existingSvg) {
        existingSvg.remove();
    }
    container.appendChild(svgElement);
}

/**
 * Chart.jsを使用して詳細グラフ（流量特性、所要動力など）を描画します。
 * @param {string} containerId - canvasを挿入するコンテナ要素のID。
 * @param {object} chartData - Chart.js用のデータオブジェクト。
 * @param {string} highlightLabel - ハイライト表示するデータセットのラベル。
 */
export function renderDetailsChartJs(containerId, chartData, highlightLabel) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) existingCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = `${containerId}-canvas`;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // データセットを加工し、選択されたモデルの線を太く、他を細く表示する
    const processedDatasets = chartData.datasets.map(ds => {
        const isHighlighted = ds.label === highlightLabel;
        return {
            ...ds,
            borderWidth: isHighlighted ? 4 : 1.5,
            borderColor: ds.borderColor,
            opacity: isHighlighted ? 1.0 : 0.3,
            backgroundColor: 'rgba(0,0,0,0)',
            fill: false,
            spanGaps: true
        };
    });

    // Chart.jsインスタンスを生成
    const chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: processedDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 500,
                easing: 'easeInOutQuad',
            },
            elements: { line: { tension: 0.1 } },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: chartData.xAxisLabel || 'X軸'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: chartData.yAxisLabel || 'Y軸'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // 生成したインスタンスを管理用配列に追加
    activeDetailCharts.push(chartInstance);
}