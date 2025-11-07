// --- DOM読み込み後の処理 ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- グローバル変数・要素取得 ---
    const productContainer = document.getElementById('product-container');
    const headerTitle = document.getElementById('header-title');
    const originalTitleText = headerTitle.textContent.trim();
    
    // フッター関連 (model-part-1 から model-part-11 まで拡張)
    const modelFooterContainer = document.getElementById('model-footer-container');
    const modelParts = Array.from({length: 11}, (_, i) => document.getElementById(`model-part-${i + 1}`));

    // 状態 (currentModel オブジェクトを拡張)
    let currentModel = { 
        base: null,        // 例: 1A
        id: null,          // 例: 1A
        chartSelection: null, // 例: 100 (グラフで選択された型式)
        optionL1: null,    // 例: ポンプ単体 / ポンプ・モータ 一体型 (選択されたL1オプションオブジェクト全体)
        optionL2: null,    // 例: 単相モータ (選択されたL2オプションオブジェクト全体)
        optionL3: null,    // ★ 修正: L3 (モータ出力)
        usage: "S",        // ★ 修正: usage (トグルスイッチ)
        optionL4_Axis: "S",
        optionL4_Rotation: "S",
        optionL4_Seal: "S",
        optionL4_Relief: "N"
    };    
    let activeDetailCharts = []; // ★ 追加: 詳細グラフインスタンスを保持
    let currentRpm = 1500; // ★ 修正: RPMの状態をグローバルに保持

    // --- 関数定義 ---

    /**
     * 1つの製品カラムのHTMLを生成
     */
    function createProductColumnHTML(product) {
        const showOptions = product.options.length > 0;
        const optionsClass = showOptions ? 'has-options-true' : 'has-options-false';
        const chartContainerId = `chart-container-${product.id}`;
        const chartTitle = product.charts.chart1.label;

        const optionsL1HTML = product.options.map((opt, index) => {
            const disabledAttr = opt.enabled ? '' : 'disabled';
            return `<button 
                        class="option-button option-level-1-button flex-1" 
                        data-product-id="${product.id}" 
                        data-option-index="${index}"
                        ${disabledAttr}>
                        ${opt.name}
                    </button>`;
        }).join('');

        // ★ 修正: レイアウト反転 + 詳細コンテナ + トグルスイッチ
        return `
        <div class="capacity-column col-${product.id} border-b border-gray-200 ${optionsClass}">
            
            <div class="product-button-wrapper">
                <button class="product-button group" style="--tw-ring-color: ${product.ringColor};"
                        data-model-base="${product.id}" data-model-id="${product.id}">
                    <img src="${product.imageSrc}"
                            alt="${product.name} 製品写真" 
                            class="absolute inset-0 w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"></div>
                    <span class="absolute bottom-4 left-4 text-2xl font-bold text-white ${product.colorClass}">${product.name}</span>
                </button>
            </div>
            
            <div class="capacity-bar-container">
                <div class="capacity-bar-fill" style="width: ${product.capacityPercent};"></div>
                <span class="capacity-spec-text">${product.capacitySpec}</span>
            </div>

            <div class="new-menu-item new-menu-column-wrapper"> 
                
                ${showOptions ? `
                <div class="options-area-wrapper p-4 border-b border-gray-200"> 
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">製品構成を選択</h3>
                    
                    <!-- ★ 新規: トグルスイッチ -->
                    <div class="usage-toggle-switch-wrapper mb-4">
                        <span class="usage-toggle-label active" data-value="S">標準</span>
                        <div class="toggle-button">
                            <input type="checkbox" id="usage-toggle-${product.id}" class="toggle_input usage-toggle-input" value="WO">
                            <label for="usage-toggle-${product.id}" class="toggle_label"></label>
                        </div>
                        <span class="usage-toggle-label" data-value="WO">燃料油・クーラント用</span>
                    </div>
                    
                    <div class="flex flex-col gap-4">
                        <div class="options-level-1 flex flex-row gap-2">
                            ${optionsL1HTML}
                        </div>
                        <!-- サブオプションコンテナ (JSで中身を描画) --><div class="sub-options-container flex-col" style="display: none;">
                            <!-- レベル2のオプションがここに入る --><div class="options-level-2 flex flex-row flex-wrap gap-2 mb-2"></div>
                            <!-- レベル3のオプションがここに入る --><div class="options-level-3 flex flex-row flex-wrap gap-2"></div>
                        </div>
                    </div>
                    
                </div>
                ` : ''}

                <div class="graphs-area-wrapper p-4"> 
                    <div id="${chartContainerId}" class="chart-wrapper bg-white rounded-lg shadow-lg">
                            <h4 class="chart-title">${chartTitle}</h4>
                    </div>
                </div>

            </div>
            
            <!-- ★ 新規: L4 オプションコンテナ (外に移動) -->
            ${showOptions ? `
            <div class="options-level-4-container" style="display: none;" data-product-id="${product.id}">
                <h4 class="options-level-4-title">オプション</h4>
                <div class="grid grid-cols-2 gap-4">
                    <!-- 軸端形状 -->
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-dropdown-label">軸端形状</label>
                        <button class="l4-dropdown-button" data-l4-type="Axis">
                            <span data-l4-value="S">標準(平割り)</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list" style="display: none;">
                            <button class="l4-dropdown-item active" data-value="S">標準(平割り)</button>
                            <button class="l4-dropdown-item" data-value="M">M(Dカット)</button>
                        </div>
                    </div>
                    <!-- 回転方向 -->
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-dropdown-label">回転方向</label>
                        <button class="l4-dropdown-button" data-l4-type="Rotation">
                            <span data-l4-value="S">標準(反時計)</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list" style="display: none;">
                            <button class="l4-dropdown-item active" data-value="S">標準(反時計)</button>
                            <button class="l4-dropdown-item" data-value="R">R(時計)</button>
                        </div>
                    </div>
                    <!-- シール材質 -->
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-dropdown-label">シール材質</label>
                        <button class="l4-dropdown-button" data-l4-type="Seal">
                            <span data-l4-value="S">標準(-5～40℃)</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list" style="display: none;">
                            <button class="l4-dropdown-item active" data-value="S">標準(-5～40℃)</button>
                            <button class="l4-dropdown-item" data-value="VF">VF(120℃)</button>
                        </div>
                    </div>
                    <!-- リリーフバルブ -->
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-dropdown-label">リリーフバルブ</label>
                        <button class="l4-dropdown-button" data-l4-type="Relief">
                            <span data-l4-value="N">なし</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list" style="display: none;">
                            <button class="l4-dropdown-item active" data-value="N">なし</button>
                            <button class="l4-dropdown-item" data-value="VB">VB(あり)</button>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- ★ 新規: 製品詳細コンテナ -->
            <div id="product-details-${product.id}" class="product-details-container" style="display: none;">
                <!-- JSで中身が描画されます -->
            </div>
        </div>
        `;
    }


    /**
     * 製品データを基にHTMLをコンテナに描画
     */
    function generateProductColumns() {
        const allProductsHTML = productData.map(createProductColumnHTML).join('');
        productContainer.innerHTML = allProductsHTML;
    }
    
    /**
     * プレースホルダーSPANを生成
     * @param {string} content - プレースホルダーに表示する文字
     * @param {string} className - 追加するクラス名
     */
    function createPlaceholder(content = '□', className = '') {
        const span = document.createElement('span');
        span.className = `model-placeholder ${className}`.trim();
        span.textContent = content;
        return span;
    }

    /**
     * 値SPANを生成
     * @param {string} content - 表示する値
     */
    function createValue(content) {
        const span = document.createElement('span');
        span.className = 'model-value';
        span.textContent = content;
        return span;
    }

    /**
     * currentModelを初期状態にリセットする
     */
    function resetCurrentModel() {
        currentModel = {
            base: null, id: null, chartSelection: null,
            optionL1: null, optionL2: null, optionL3: null,
            usage: "S",
            optionL4_Axis: "S",
            optionL4_Rotation: "S",
            optionL4_Seal: "S",
            optionL4_Relief: "N"
        };
    }

    /**
     * 型式フッターの表示を更新
     */
    function updateModelDisplay(scrollToFooter = false) {
        
        // --- フッター表示判定 ---
        if (!currentModel.base) {
            modelFooterContainer.style.display = 'none';
            return;
        }

        let shouldShowFooter = false;
        if (currentModel.id === "1RA") {
            if (currentModel.chartSelection) { // 1RAはグラフ選択時に表示
                shouldShowFooter = true;
            }
        } else if (currentModel.optionL1) {
            if (currentModel.optionL1.name === "ポンプ・モータ 一体型") {
                if (currentModel.optionL2) { // 一体型はL2選択時に表示
                    shouldShowFooter = true;
                }
            } else { // ポンプ単体、ベースカップリングはL1選択時に表示
                shouldShowFooter = true;
            }
        }
        
        if (!shouldShowFooter) {
            modelFooterContainer.style.display = 'none';
            return; // 表示条件を満たさなければここで終了
        }

        // --- L4 オプションと詳細の表示判定 ---
        let showL4AndDetails = false;
        if (currentModel.id === '1RA' && currentModel.chartSelection) {
            showL4AndDetails = true; // ★ 修正: 1RAでも詳細表示を有効にする
        } else if (currentModel.optionL1) {
            if (currentModel.optionL1.name === "ポンプ・モータ 一体型") {
                if (currentModel.optionL2 && currentModel.optionL3 && currentModel.chartSelection) {
                    showL4AndDetails = true;
                }
            } else { // ポンプ単体、ベースカップリング
                if (currentModel.chartSelection) {
                    showL4AndDetails = true;
                }
            }
        }
        
        // L4コンテナの表示/非表示
        const l4Container = document.querySelector(`.col-${currentModel.id} .options-level-4-container`);
        if (l4Container) {
            l4Container.style.display = showL4AndDetails ? 'block' : 'none';
        }
        
        // 詳細コンテナの表示/非表示と描画
        const detailsContainer = document.getElementById(`product-details-${currentModel.id}`);
        if (detailsContainer) {
            if (showL4AndDetails) {
                const detailsData = getDetailsData(currentModel.id, currentModel.optionL1, currentModel.optionL2);
                if (detailsData) {
                    renderProductDetails(detailsData, currentModel.chartSelection);
                }
            } else {
                clearProductDetails(currentModel.id);
            }
        }


        // --- フッター本体の描画 ---
        modelParts.forEach(part => { 
            if (part) part.innerHTML = ''; 
        });
        
        if (modelFooterContainer.style.display === 'none') {
            modelFooterContainer.style.display = 'flex'; 
            scrollToFooter = true; 
        }

        // 型式パーツを組み立ててフッターに描画
        const partsToRender = buildModelStringParts();
        partsToRender.forEach((part, index) => {
            if (modelParts[index]) modelParts[index].appendChild(part);
        });
        
        if (scrollToFooter) {
            setTimeout(() => {
                modelFooterContainer.scrollIntoView({ behavior: 'smooth', 'block': 'end' });
            }, 300);
        }
    }

    /**
     * currentModelに基づいてフッターに表示する型式のパーツ配列を生成する
     * @returns {HTMLElement[]}
     */
    function buildModelStringParts() {
        const parts = [];
        const { id, chartSelection, optionL1, optionL2, optionL3, usage, optionL4_Axis, optionL4_Rotation, optionL4_Seal, optionL4_Relief } = currentModel;

        if (id === "1RA") {
            parts.push(createValue(id));
            parts.push(createStaticText("-"));
            parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
        } else if (["1A", "2A", "3F", "3H"].includes(id)) {
            if (optionL1?.name === CONSTANTS.OPTION_TYPE.PUMP_ONLY) {
                parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
                if (usage === "WO") parts.push(createValue("WO"));
                if (optionL4_Axis === "M") parts.push(createValue("M"));
                if (optionL4_Rotation === "R") parts.push(createValue("R"));
                if (optionL4_Seal === "VF") parts.push(createValue("VF"));
                if (optionL4_Relief === "VB") parts.push(createValue("-VB"));
            }
            else if (optionL1?.name === CONSTANTS.OPTION_TYPE.MOTOR_SET) {
                if (optionL2) {
                    parts.push(createValue(optionL2.modelConfig.part3));
                    parts.push(optionL3 ? createValue(optionL3.modelPart) : createPlaceholder("□"));
                    if (id !== '1A') parts.push(createStaticText("-"));
                    parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
                    if (usage === "WO") parts.push(createValue("WO"));
                } else {
                    parts.push(createPlaceholder(id[0] + "M"));
                    parts.push(createPlaceholder("□"));
                    parts.push(createStaticText("-"));
                    parts.push(createPlaceholder("□"));
                    if (usage === "WO") parts.push(createValue("WO"));
                }
                parts.push(createValue("M"));
                if (optionL4_Axis === "M") parts.push(createValue("M"));
                if (optionL4_Rotation === "R") parts.push(createValue("R"));
                if (optionL4_Seal === "VF") parts.push(createValue("VF"));
                if (optionL4_Relief === "VB") parts.push(createValue("-VB"));
            }
            else if (optionL1?.name === CONSTANTS.OPTION_TYPE.BASE_COUPLING) {
                parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
                if (usage === "WO") parts.push(createValue("WO"));
                if (optionL4_Axis === "M") parts.push(createValue("M"));
                if (optionL4_Rotation === "R") parts.push(createValue("R"));
                if (optionL4_Seal === "VF") parts.push(createValue("VF"));
                if (optionL4_Relief === "VB") parts.push(createValue("-VB"));
            } else {
                // L1未選択
                parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
                if (usage === "WO") parts.push(createValue("WO"));
                parts.push(createPlaceholder("□"));
                parts.push(createPlaceholder("□"));
                parts.push(createPlaceholder("□"));
            }
        }
        return parts;
    }

    /**
     * 製品詳細データを取得し、プレースホルダーを解決する
     */
    function getDetailsData(productId, optionL1, optionL2) {
        let detailsData = optionL2?.details || optionL1?.details || (productId === '1RA' ? productData.find(p => p.id === '1RA').details : null);
        if (detailsData === "USE_1RA_DETAILS") {
            return productData.find(p => p.id === '1RA').details;
        } else if (detailsData?.specTable === "USE_1RA_SPEC_TABLE_ONLY") {
            return { ...productData.find(p => p.id === '1RA').details, flowChart: null, powerChart: null, dimensionImageSrc: detailsData.dimensionImageSrc };
        }
        return detailsData;
    }

    // 静的なテキストを表示するためのヘルパー関数
    function createStaticText(text) {
        const span = document.createElement('span');
        span.className = 'model-static';
        span.textContent = text;
        return span;
    }

    /**
     * メインSVGグラフを破棄
     */
    function destroyMainSvgCharts() {
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
     * 詳細Chart.jsグラフを破棄
     */
    function destroyDetailCharts() {
        activeDetailCharts.forEach(chart => chart.destroy());
        activeDetailCharts = [];
    }


    /**
     * グラフ描画のメイン関数
     */
    function renderProductCharts(column) {
        destroyMainSvgCharts(); 
        const button = column.querySelector('.product-button');
        if (!button) return;
        const productId = button.dataset.modelId;
        const product = productData.find(p => p.id === productId);
        if (!product || !product.charts) return;
        
        renderMainSvgChart(product, `chart-container-${product.id}`, product.charts.chart1);
    }
    
    /**
     * メインSVGグラフ描画
     */
    function renderMainSvgChart(product, containerId, chartData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // グラフタイトルをコンテナから取得または設定
        let titleEl = container.querySelector('.chart-title');
        if (!titleEl) {
                titleEl = document.createElement('h4');
                titleEl.className = 'chart-title';
                titleEl.textContent = chartData.label || 'グラフ';
                container.appendChild(titleEl);
        }

        const datasets = chartData.datasets;
        if (!datasets || datasets.length === 0) return;

        const svgWidth = 500;
        const svgHeight = 250; 
        const padding = { top: 40, right: 40, bottom: 40, left: 60 };
        
        const chartWidth = svgWidth - padding.left - padding.right;
        const chartHeight = svgHeight - padding.top - padding.bottom;
        
        // 1. X/Y軸の最小/最大を動的に計算
        const allDataPoints = datasets.flatMap(ds => ds.data);
        const xValues = allDataPoints.map(d => d.x);
        const yValues = allDataPoints.map(d => d.y);
        
        let minX = 0; // Xは0固定
        let maxX = Math.max(...xValues);
        let minY = Math.min(...yValues);
        let maxY = Math.max(...yValues);

        // 2. スケール調整
        if (minY === maxY) {
            minY = minY - 0.1;
            maxY = maxY + 0.1;
        } else { 
            minY = 0; 
            maxY = maxY * 1.1; 
        }
        
        // X軸の最大値と刻み幅をキリの良い値に
        maxX = Math.ceil(maxX * 1.05); 
        if (maxX <= 1) {
            maxX = 1; // 最小 1
        } else if (maxX <= 5) {
            maxX = Math.ceil(maxX); // 4.5 -> 5
        } else if (maxX <= 10) {
            maxX = Math.ceil(maxX / 2) * 2; // 8.1 -> 9 -> 10
        } else if (maxX <= 50) {
            maxX = Math.ceil(maxX / 5) * 5; // 42 -> 45
        } else {
            maxX = Math.ceil(maxX / 10) * 10; // 100 -> 100, 116 -> 120
        }

        const scaleX = (val) => padding.left + ((val - minX) / (maxX - minX)) * chartWidth;
        const scaleY = (val) => (val === 0 ? padding.top + chartHeight : padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight);
        
        const yBottom = scaleY(minY); // Y軸の底 (グラフの底)
        
        let areasHTML = '';
        let textsHTML = '';
        
        // 3. グラフ本体 (Path) の描画
        datasets.forEach(ds => {
            const label = ds.label;
            const data = ds.data;
            const color = ds.backgroundColor;
            const borderColor = ds.borderColor;

            const isHorizontalArea = data.every(d => d.y === data[0].y);
            
            let d;
            let textX, textY;
            let pathClass = "svg-chart-area"; // デフォルト (エリアグラフ)
            let pathStyle = `fill="${color}"; stroke: ${borderColor};`;

            if (isHorizontalArea) {
                const x1 = scaleX(data[0].x);
                const x2 = scaleX(data[data.length - 1].x); 
                const yLine = scaleY(data[0].y); 
                d = `M ${x1} ${yBottom} L ${x1} ${yLine} L ${x2} ${yLine} L ${x2} ${yBottom} Z`;
                textX = (x1 + x2) / 2;
                textY = yLine + (yBottom - yLine) / 2 + 6; 
            } else {
                // 線グラフ
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
        
        // 4. 軸 (Axis) の描画 (動的)
        let tickInterval = 1;
        if (maxX > 50) tickInterval = 10;
        else if (maxX > 10) tickInterval = 5;
        else if (maxX > 5) tickInterval = 2;
        else if (maxX <= 1) tickInterval = 0.2;
        
        const xAxisTicks = [];
        for (let i = 0; i <= maxX; i += tickInterval) {
            xAxisTicks.push({ val: i, x: scaleX(i) });
        }
        
        const yAxisTicks = [];
        const yTickCount = (maxY < 1 ? 4 : 2); // Y軸が小さい場合は目盛りを増やす
        for (let i = 0; i <= yTickCount; i++) {
            const val = minY + (maxY - minY) * (i / yTickCount);
            yAxisTicks.push({ val: val.toFixed(1), y: scaleY(val) });
        }

        const axisHTML = `
            <!-- X axis --><line x1="${padding.left}" y1="${yBottom}" x2="${scaleX(maxX)}" y2="${yBottom}" stroke="#9ca3af" />
            <text x="${padding.left + chartWidth / 2}" y="${svgHeight - 5}" text-anchor="middle" fill="#4b5563" font-size="14">${chartData.xAxisLabel || 'X軸'}</text>
            ${xAxisTicks.map(tick => `<text x="${tick.x}" y="${yBottom + 15}" text-anchor="middle" fill="#4b5563" font-size="12">${tick.val.toFixed(maxX <= 1 ? 1 : 0)}</text>`).join('')}
            
            <!-- Y axis --><line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${yBottom}" stroke="#9ca3af" />
            <text x="${padding.left - 40}" y="${padding.top + chartHeight / 2}" text-anchor="middle" fill="#4b5563" font-size="14" transform="rotate(-90 ${padding.left - 40} ${padding.top + chartHeight / 2})">${chartData.yAxisLabel || 'Y軸'}</text>
            ${yAxisTicks.map(tick => `<text x="${padding.left - 10}" y="${tick.y}" text-anchor="end" dominant-baseline="middle" fill="#4b5563" font-size="12">${tick.val}</text>`).join('')}
        `;

        // 5. SVG設定とイベントリスナー
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
        svgElement.setAttribute("class", "svg-chart");
        svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svgElement.innerHTML = axisHTML + areasHTML + textsHTML;
        
        // 選択状態を復元
        const selectedChartValue = currentModel.chartSelection;
        if (selectedChartValue) {
            const activeArea = svgElement.querySelector(`.svg-chart-area[data-submodel="${selectedChartValue}"]`);
            if (activeArea) activeArea.classList.add('active');
        }
    
        // SVGクリック (グラフの型式: chartSelection)
        svgElement.querySelectorAll('.svg-chart-area').forEach(area => {
            area.addEventListener('click', (event) => {
                const subModelLabel = event.target.dataset.submodel;
                const isActive = event.target.classList.contains('active');
                
                // 全エリアのアクティブ解除
                svgElement.querySelectorAll('.svg-chart-area').forEach(a => a.classList.remove('active'));
                
                clearProductDetails(product.id);

                if (isActive) {
                    currentModel.chartSelection = null;
                } else {
                    event.target.classList.add('active');
                    currentModel.chartSelection = subModelLabel;
                    
                    const l4Container = document.querySelector(`.col-${product.id} .options-level-4-container`);
                    const shouldRenderDetails = (product.id === '1RA' && product.details) || 
                                                (l4Container && l4Container.style.display === 'block');

                    if (shouldRenderDetails) {                        
                        const detailsData = getDetailsData(product.id, currentModel.optionL1, currentModel.optionL2);
                        // ★ 修正: 1Aの場合はマッピング不要。1RAの場合は過去の互換性のために残す。
                        const mappedSelection = subModelLabel;

                        if(detailsData) {
                            renderProductDetails(detailsData, mappedSelection);
                        }
                    }
                }
                updateModelDisplay(true);
            });
        });
        
        // 既存のSVGを削除してから追加
        const existingSvg = container.querySelector('.svg-chart');
        if (existingSvg) {
            existingSvg.remove();
        }
        container.appendChild(svgElement);
    }
    
    /**
     * 詳細グラフ (Chart.js) を描画
     */
    function renderDetailsChartJs(containerId, chartData, highlightLabel) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const existingCanvas = container.querySelector('canvas');
        if(existingCanvas) existingCanvas.remove();
        
        const canvas = document.createElement('canvas');
        canvas.id = `${containerId}-canvas`;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // データセットをハイライト/非ハイライトに加工
        const processedDatasets = chartData.datasets.map(ds => {
            const isHighlighted = ds.label === highlightLabel;
            return {
                ...ds,
                borderWidth: isHighlighted ? 4 : 1.5, // ★ ハイライト
                borderColor: ds.borderColor, // ★ 修正: 常に元の色
                opacity: isHighlighted ? 1.0 : 0.3, // ★ 追加: 透明度
                backgroundColor: 'rgba(0,0,0,0)', 
                fill: false,
                tension: 0.1
            };
        });

        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: processedDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
        
        activeDetailCharts.push(chartInstance);
    }

    /**
     * 製品詳細コンテナをクリア
     */
    function clearProductDetails(productId) {
            const detailsContainer = document.getElementById(`product-details-${productId}`);
            if (detailsContainer) {
                detailsContainer.innerHTML = '';
                detailsContainer.style.display = 'none';
            }
            destroyDetailCharts();
    }

    /**
     * 製品詳細を描画 (1RA または 1A以降の仮データ)
     */
    function renderProductDetails(detailsData, selectedModel) {
        const detailsContainer = document.getElementById(`product-details-${currentModel.id}`); // 修正済み
        if (!detailsContainer || !detailsData) return;

        const { specTable, flowChart: flowChartData, powerChart: powerChartData, dimensionImageSrc } = detailsData;
        const selectedSpec = specTable.find(s => s.model === selectedModel);
        const highlightedModel = selectedSpec ? selectedModel : specTable[0].model;
        
        // 仕様表のHTMLを生成
        const tableHeader = `
            <thead>
                <tr>
                    <th>型式</th>
                    <th>一回転当たり<br>吐出量(ml/rev)</th>
                    <th id="flow-header-${currentModel.id}">理論吐出量<br>(L/min)</th>
                    <th>最大吐出圧力<br>(Mpa)</th>
                    <th>最高回転数<br>(min-1)</th>
                    <th>概略質量<br>(kg)</th>
                </tr>
            </thead>
        `;
        const tableBody = specTable.map(row => `
            <tr class="${row.model === highlightedModel ? 'highlight' : ''}">
                <td>${row.model}</td>
                <td>${row.volume.toFixed(2)}</td>
                <td class="flow-cell" data-flow-1500="${row.flow1500?.toFixed(2) || 'N/A'}" data-flow-1800="${row.flow1800?.toFixed(2) || 'N/A'}">
                    ${currentRpm === 1800 ? (row.flow1800?.toFixed(2) || 'N/A') : (row.flow1500?.toFixed(2) || 'N/A')}
                </td>
                <td>${row.pressure.toFixed(1)}</td>
                <td>${row.speed}</td>
                <td>${typeof row.weight === 'number' ? row.weight.toFixed(1) : row.weight}</td>
            </tr>
        `).join('');

        // コンテナのHTMLを構築
        detailsContainer.innerHTML = `
            <h2>${currentModel.id} - ${currentModel.chartSelection} 製品詳細</h2>
            
            <div class="flex justify-between items-center">
                <h3>寸法図面</h3>
                <!-- ★新規: 3Dモデルがあればボタンを表示 -->
                ${detailsData.model3dSrc ? `
                    <button class="view-3d-button" data-model-src="${detailsData.model3dSrc}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fill-rule="evenodd" d="M.458 10C3.732 4.943 10 3.5 10 3.5s6.268 1.443 9.542 6.5c-1.33 2.165-3.303 3.788-5.542 4.582A.5.5 0 0113.5 15.5a.5.5 0 01-.458-.418C11.542 14.29 10 13.5 10 13.5s-1.542.79-3.042 1.582A.5.5 0 016.5 15.5a.5.5 0 01-.458-.418C3.759 14.288 1.786 12.665.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                        3Dで確認
                    </button>
                ` : ''}
            </div>
            <div class="p-4 border border-slate-300 rounded-lg bg-white">
                <img src="${dimensionImageSrc || 'https://placehold.co/800x400/e2e8f0/9ca3b8?text=IMAGE+NOT+FOUND'}" alt="寸法図面" class="w-full h-auto object-contain" onerror="this.src='https://placehold.co/800x400/e2e8f0/9ca3b8?text=IMAGE+NOT+FOUND'">
            </div>

            <!-- 仕様 -->
            <div class="mt-6 relative">
                <h3>仕様</h3>
                <div class="absolute top-0 right-0">
                    <button class="rpm-toggle-button active" data-rpm="1500">1500min-1</button>
                    <button class="rpm-toggle-button" data-rpm="1800">1800min-1</button>
                </div>
                
                <table class="spec-table mt-4">
                    ${tableHeader}
                    <tbody>${tableBody}</tbody>
                </table>
                <p class="spec-table-note">※最大吐出圧力は試供油をISO-VG46 油温40度とした値です(粘度・温度によりことなります)</p>

                <!-- 流量特性グラフ (★ flowChartData がある場合のみ描画) -->
                ${flowChartData ? `
                <h3 class="mt-6">流量特性</h3>
                <div id="flow-chart-${currentModel.id}" class="chart-wrapper bg-white rounded-lg shadow-lg" style="height: 300px;">
                        <h4 class="chart-title">${flowChartData.label}</h4>
                </div>
                ` : ''}
                
                <!-- 所要電力グラフ (★ powerChartData がある場合のみ描画) -->
                ${powerChartData ? `
                <h3 class="mt-6">所要電力</h3>
                <div id="power-chart-${currentModel.id}" class="chart-wrapper bg-white rounded-lg shadow-lg" style="height: 300px;">
                        <h4 class="chart-title">${powerChartData.label}</h4>
                </div>
                ` : ''}
            </div>
        `;

        // 詳細コンテナを表示
        detailsContainer.style.display = 'block';

        // Chart.jsでグラフを描画
        if (flowChartData) {
            renderDetailsChartJs(`flow-chart-${currentModel.id}`, flowChartData, highlightedModel);
        }
        if (powerChartData) {
            renderDetailsChartJs(`power-chart-${currentModel.id}`, powerChartData, highlightedModel);
        }

        // RPMボタンのアクティブ状態を現在のcurrentRpmに合わせて更新
        detailsContainer.querySelectorAll('.rpm-toggle-button').forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.rpm, 10) === currentRpm));
    }

    /**
     * ★ 新規: 寸法図面を動的に更新する
     */
    function updateDimensionImage() {
        const detailsContainer = document.getElementById(`product-details-${currentModel.id}`);
        if (!detailsContainer || detailsContainer.style.display === 'none') return;

        const img = detailsContainer.querySelector('img[alt="寸法図面"]');
        if (!img) return;

        let newSrc = "https://placehold.co/800x400/e2e8f0/9ca3b8?text=IMAGE+NOT+FOUND";

        // ★ 修正: L4オプションの画像選択ロジックを修正
        const l4ReliefSrc = currentModel.optionL1?.l4_details?.Relief?.[currentModel.optionL4_Relief]?.dimensionImageSrc;
        const l4RotationSrc = currentModel.optionL1?.l4_details?.Rotation?.[currentModel.optionL4_Rotation]?.dimensionImageSrc;

        if (currentModel.optionL4_Relief === 'VB' && l4ReliefSrc) {
            newSrc = l4ReliefSrc;
        } else if (currentModel.optionL4_Rotation === 'R' && l4RotationSrc) {
            newSrc = l4RotationSrc;
        } else if (currentModel.optionL2 && currentModel.optionL2.details?.dimensionImageSrc) {
            newSrc = currentModel.optionL2.details.dimensionImageSrc;
        } else if (currentModel.optionL1 && currentModel.optionL1.details?.dimensionImageSrc) {
            newSrc = currentModel.optionL1.details.dimensionImageSrc;
        } else if (currentModel.id === '1RA') {
            newSrc = productData.find(p => p.id === '1RA').details.dimensionImageSrc;
        }

        img.src = newSrc;
    }
    
    /**
     * レベル2/3のオプションボタンを生成し、表示する
     */
    function renderSubOptions(column, parentOption, level) {
        const subOptionsContainer = column.querySelector('.sub-options-container');
        let targetDiv;
        let optionsToRender = [];
        let titleHTML = ''; // ★ L3タイトル用

        if (level === 'L2') {
            targetDiv = column.querySelector('.options-level-2');
            optionsToRender = parentOption.subOptions;
            // L3もクリア
            column.querySelector('.options-level-3').innerHTML = '';
            currentModel.optionL3 = null; 
        } else if (level === 'L3') {
            targetDiv = column.querySelector('.options-level-3');
            // L1/L2両方 L3 を additionalSubOptions から取得
            optionsToRender = parentOption.additionalSubOptions;
            if (optionsToRender && optionsToRender.length > 0) {
                titleHTML = '<h4 class="options-level-3-title">モータ出力</h4>';
            }
        }
        
        targetDiv.innerHTML = ''; // 既存のサブオプションをクリア

        if (optionsToRender && optionsToRender.length > 0) {
            const subOptionsHTML = optionsToRender.map((opt, index) => {
                return `<button 
                            class="option-button option-${level}-button" 
                            data-option-index="${parentOption.optionIndex}" 
                            data-sub-option-index="${index}"
                            data-level="${level}">
                            ${opt.name}
                        </button>`;
            }).join('');
            targetDiv.innerHTML = titleHTML + subOptionsHTML; // ★ タイトルを追加
            subOptionsContainer.style.display = 'flex'; // コンテナを表示
        } else {
                // レベルのコンテナを空にする
            targetDiv.innerHTML = '';
        }

        // L2とL3の両方が空の場合のみ、親コンテナを非表示
        const l2Content = column.querySelector('.options-level-2').innerHTML;
        const l3Content = column.querySelector('.options-level-3').innerHTML;
        if (!l2Content && !l3Content) {
            subOptionsContainer.style.display = 'none';
        } else {
            subOptionsContainer.style.display = 'flex';
        }
    }
    
    /**
     * 型式選択モーダルを開く
     */
    function openModelDropdown() {
        const productId = currentModel.id;
        const product = productData.find(p => p.id === productId);
        if (!product) return;

        const datasets = product.charts.chart1.datasets;
        const modelList = datasets.map(ds => ds.label);
        
        const listContainer = document.getElementById('model-dropdown-list');
        listContainer.innerHTML = modelList.map(model => `
            <button 
                class="model-dropdown-item ${model === currentModel.chartSelection ? 'active' : ''}" 
                data-model="${model}">
                ${model}
            </button>
        `).join('');
        
        document.getElementById('model-dropdown-title').textContent = `${productId} の型式を選択`;
        document.getElementById('model-dropdown-modal').style.display = 'flex';
    }
    
    /**
     * 型式選択モーダルを閉じる
     */
    function closeModelDropdown() {
        document.getElementById('model-dropdown-modal').style.display = 'none';
    }
    
    /**
     * ★ 新規: L1またはL2クリック時に画像を変更
     */
    function updateProductImage(column, newSrc) {
        const img = column.querySelector('.product-button img');
        if (img && newSrc) {
            img.src = newSrc;
        }
    }

    /**
     * 全ての製品カラムのUIをリセットする
     */
    function resetAllColumns() {
        document.querySelectorAll('.capacity-column').forEach(col => {
            col.classList.remove('column-active');
            col.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
            
            const subOptionsContainer = col.querySelector('.sub-options-container');
            if (subOptionsContainer) subOptionsContainer.style.display = 'none';
            
            const l4Container = col.querySelector('.options-level-4-container');
            if (l4Container) l4Container.style.display = 'none';

            const productId = col.querySelector('.product-button')?.dataset.modelId;
            if (productId) {
                clearProductDetails(productId);
                const originalProduct = productData.find(p => p.id === productId);
                if(originalProduct) updateProductImage(col, originalProduct.imageSrc);
            }
        });
        productContainer.classList.remove('has-active');
        headerTitle.textContent = originalTitleText;
        headerTitle.classList.remove('cursor-pointer', 'hover:text-blue-600');
    }

    /**
     * 製品カラムクリック時のハンドラ
     */
    function handleProductColumnClick(column) {
        const isAlreadyActive = column.classList.contains('column-active');
        
        // 状態とUIをリセット
        resetCurrentModel();
        resetAllColumns();
        destroyMainSvgCharts();

        if (!isAlreadyActive) {
            // カラムをアクティブ化
            column.classList.add('column-active');
            productContainer.classList.add('has-active');

            const button = column.querySelector('.product-button');
            if (button) {
                currentModel.base = button.dataset.modelBase;
                currentModel.id = button.dataset.modelId;
            }

            headerTitle.textContent = '＜　 シリーズ一覧に戻る';
            headerTitle.classList.add('cursor-pointer', 'hover:text-blue-600');
            renderProductCharts(column);

            setTimeout(() => {
                headerTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
        
        updateModelDisplay(false);
    }

    /**
     * ★ 修正: イベントリスナーの集約
     */
    function setupEventListeners() {

        // --- (A) productContainer への集約リスナー ---
        productContainer.addEventListener('click', (e) => {
            
            // --- (A-1) 製品カラム (写真) のクリック ---
            const clickableArea = e.target.closest('.product-button-wrapper');
            if (clickableArea) {
                handleProductColumnClick(clickableArea.closest('.capacity-column')); // 修正済み
                return; // 他のクリックイベントと重複させない
            }

            // --- (A-3) RPMトグルボタン ---
            const rpmButton = e.target.closest('.rpm-toggle-button');
            if (rpmButton) {
                // ★修正: RPMボタンのハンドラ
                const newRpm = parseInt(rpmButton.dataset.rpm, 10);
                if (newRpm === currentRpm) return; // 既に選択されている場合は何もしない

                currentRpm = newRpm;
                const detailsContainer = rpmButton.closest('.product-details-container');
                if (detailsContainer) {
                    // ボタンのアクティブ状態を更新
                    detailsContainer.querySelectorAll('.rpm-toggle-button').forEach(btn => btn.classList.remove('active'));
                    rpmButton.classList.add('active');
                    // 仕様表の理論吐出量を更新
                    detailsContainer.querySelectorAll('.flow-cell').forEach(cell => {
                        cell.textContent = cell.dataset[`flow${currentRpm}`];
                    });
                }
                return;
            }

            // --- ★新規: 3Dビューアボタン ---
            const view3dButton = e.target.closest('.view-3d-button');
            if (view3dButton) {
                const modelSrc = view3dButton.dataset.modelSrc;
                openModelViewer(modelSrc);
                return;
            }

            // --- (A-2) オプションボタン (L1, L2, トグル) のクリック ---
            const currentActiveColumn = document.querySelector('.capacity-column.column-active');
            if (!currentActiveColumn) return; 

            const product = productData.find(p => p.id === currentModel.id);
            if (!product) return;
            
            // --- トグルスイッチ (Usage) ---
            const toggleInput = e.target.closest('.usage-toggle-input:not(.l4-toggle)');
            if (toggleInput) {
                currentModel.usage = toggleInput.checked ? "WO" : "S"; 
                // ラベルのアクティブ状態を更新
                const wrapper = toggleInput.closest('.usage-toggle-switch-wrapper');
                wrapper.querySelector('.usage-toggle-label[data-value="S"]').classList.toggle('active', currentModel.usage === 'S');
                wrapper.querySelector('.usage-toggle-label[data-value="WO"]').classList.toggle('active', currentModel.usage === 'WO');

                updateModelDisplay(false);
                return;
            }

            // --- レベル1 ボタン (ポンプ単体 など) ---
            const l1Button = e.target.closest('.option-level-1-button');
            if (l1Button) {
                const optionIndex = parseInt(l1Button.dataset.optionIndex, 10);
                const selectedOption = { ...product.options[optionIndex], optionIndex }; 
                const isActive = l1Button.classList.contains('active');
                
                currentActiveColumn.querySelectorAll('.option-level-1-button').forEach(btn => btn.classList.remove('active'));
                
                const l2Div = currentActiveColumn.querySelector('.options-level-2');
                const l3Div = currentActiveColumn.querySelector('.options-level-3');
                const subOptionsContainer = currentActiveColumn.querySelector('.sub-options-container');
                l2Div.innerHTML = '';
                l3Div.innerHTML = '';
                subOptionsContainer.style.display = 'none';

                clearProductDetails(currentModel.id);
                // ★ 新規: L4 オプションもリセット
                currentModel.optionL4_Axis = "S";
                currentModel.optionL4_Rotation = "S";
                currentModel.optionL4_Seal = "S";
                currentModel.optionL4_Relief = "N";
                // ★ 新規: L4 ドロップダウンの見た目もリセット
                const l4Container = currentActiveColumn.querySelector('.options-level-4-container');
                if (l4Container) {
                        l4Container.querySelectorAll('.l4-dropdown-button span').forEach(span => {
                            const defaultItem = span.closest('.l4-dropdown-wrapper').querySelector('.l4-dropdown-item[data-value="S"], .l4-dropdown-item[data-value="N"]');
                            if(defaultItem) span.textContent = defaultItem.textContent;
                        });
                        l4Container.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
                        l4Container.querySelectorAll('.l4-dropdown-item[data-value="S"]').forEach(item => item.classList.add('active'));
                        l4Container.querySelectorAll('.l4-dropdown-item[data-value="N"]').forEach(item => item.classList.add('active'));
                }
                // currentModelリセット
                currentModel.optionL1 = null;
                currentModel.optionL2 = null;
                currentModel.optionL3 = null; 


                if (!isActive) {
                    l1Button.classList.add('active');
                    currentModel.optionL1 = selectedOption;
                    updateProductImage(currentActiveColumn, selectedOption.imageSrc || product.imageSrc); // 画像更新

                    if (selectedOption.subOptions && selectedOption.subOptions.length > 0) {
                        renderSubOptions(currentActiveColumn, selectedOption, 'L2');
                    }
                } else {
                    updateProductImage(currentActiveColumn, product.imageSrc); // 元の画像に戻す
                }
                
                updateModelDisplay(true);
                updateDimensionImage(); // ★ 追加
                return; 
            }

            // --- レベル2 ボタン (単相モータ など) ---
            const l2Button = e.target.closest('.option-L2-button[data-level="L2"]');
            if (l2Button) {
                const optionIndex = parseInt(l2Button.dataset.optionIndex, 10);
                const subOptionIndex = parseInt(l2Button.dataset.subOptionIndex, 10);
                
                const selectedL1Option = currentModel.optionL1;
                if (!selectedL1Option) return; 
                
                const selectedL2Option = { ...selectedL1Option.subOptions[subOptionIndex], optionIndex: subOptionIndex };
                const isActive = l2Button.classList.contains('active');

                const container = l2Button.closest('.options-level-2');
                container.querySelectorAll('.option-L2-button').forEach(btn => btn.classList.remove('active'));
                
                const l3Div = currentActiveColumn.querySelector('.options-level-3');
                l3Div.innerHTML = '';
                
                currentModel.optionL2 = null;
                currentModel.optionL3 = null; // ★ L3 もリセット
                
                if (!isActive) {
                    l2Button.classList.add('active');
                    currentModel.optionL2 = selectedL2Option;
                    updateProductImage(currentActiveColumn, selectedL2Option.imageSrc || selectedL1Option.imageSrc); // 画像更新

                    // ★ 修正: L3 (モータ出力) を描画
                    if (selectedL2Option.additionalSubOptions && selectedL2Option.additionalSubOptions.length > 0) {
                        renderSubOptions(currentActiveColumn, selectedL2Option, 'L3');
                    }
                } else {
                    updateProductImage(currentActiveColumn, selectedL1Option.imageSrc); // L1の画像に戻す
                }
                
                updateModelDisplay(true);
                updateDimensionImage(); // ★ 追加
                return; 
            }
            
            // --- ★ 新規: レベル3 ボタン (モータ出力) ---
            const l3Button = e.target.closest('.option-L3-button[data-level="L3"]');
            if (l3Button) {
                const subOptionIndex = parseInt(l3Button.dataset.subOptionIndex, 10); // L3のインデックス
                const isActive = l3Button.classList.contains('active');

                const selectedL2Option = currentModel.optionL2;
                if (!selectedL2Option || !selectedL2Option.additionalSubOptions) return;
                
                const selectedL3Option = selectedL2Option.additionalSubOptions[subOptionIndex];
                
                const container = l3Button.closest('.options-level-3');
                container.querySelectorAll('.option-L3-button').forEach(btn => btn.classList.remove('active'));
                
                currentModel.optionL3 = null;

                if (!isActive) {
                    l3Button.classList.add('active');
                    currentModel.optionL3 = selectedL3Option;
                }
                
                updateModelDisplay(false); 
                updateDimensionImage(); // ★ 追加: L4変更時に画像更新をトリガー
                return;
            }
            
            // --- ★ 新規: L4 ドロップダウンボタン ---
            const l4Button = e.target.closest('.l4-dropdown-button');
            if (l4Button) {
                // 他の開いているドロップダウンを閉じる
                currentActiveColumn.querySelectorAll('.l4-dropdown-list').forEach(list => {
                    if (list !== l4Button.nextElementSibling) {
                        list.style.display = 'none';
                    }
                });
                // クリックしたドロップダウンのリストを開閉
                const list = l4Button.nextElementSibling;
                list.style.display = list.style.display === 'block' ? 'none' : 'block';
                return;
            }

            // --- ★ 新規: L4 ドロップダウンアイテム ---
            const l4Item = e.target.closest('.l4-dropdown-item');
            if (l4Item) {
                const value = l4Item.dataset.value;
                const wrapper = l4Item.closest('.l4-dropdown-wrapper');
                const button = wrapper.querySelector('.l4-dropdown-button');
                const type = button.dataset.l4Type; // Axis, Rotation, Seal, Relief
                
                // モデル更新
                currentModel[`optionL4_${type}`] = value;
                
                // ボタンのテキスト更新
                button.querySelector('span').textContent = l4Item.textContent;
                
                // リスト内のアクティブ状態更新
                wrapper.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
                l4Item.classList.add('active');
                
                // リストを閉じる
                l4Item.closest('.l4-dropdown-list').style.display = 'none';

                // --- ★ 修正: 連動ロジック (Rotation と Relief) ---
                if (type === 'Rotation' && value === 'R') {
                    if (currentModel.optionL4_Relief === 'VB') {
                        currentModel.optionL4_Relief = 'N'; // 標準に戻す
                        const reliefWrapper = currentActiveColumn.querySelector(`button[data-l4-type="Relief"]`).closest('.l4-dropdown-wrapper');
                        reliefWrapper.querySelector('span').textContent = "なし";
                        reliefWrapper.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
                        reliefWrapper.querySelector('.l4-dropdown-item[data-value="N"]').classList.add('active');
                    }
                }
                if (type === 'Relief' && value === 'VB') {
                        if (currentModel.optionL4_Rotation === 'R') {
                        currentModel.optionL4_Rotation = 'S'; // 標準に戻す
                        const rotWrapper = currentActiveColumn.querySelector(`button[data-l4-type="Rotation"]`).closest('.l4-dropdown-wrapper');
                        rotWrapper.querySelector('span').textContent = "標準(反時計)";
                        rotWrapper.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
                        rotWrapper.querySelector('.l4-dropdown-item[data-value="S"]').classList.add('active');
                        }
                }
                
                updateModelDisplay(false); 
                updateDimensionImage(); // ★ 追加: L4変更時に画像更新をトリガー
                return;
            }

        });


        // --- (B) ヘッダークリック (一覧に戻る) ---
        headerTitle.addEventListener('click', () => {
            if (!productContainer.classList.contains('has-active')) return;
            resetCurrentModel();
            resetAllColumns();
            destroyMainSvgCharts(); 
            updateModelDisplay(false);
        });
        
        // --- (C) フッタークリック (モーダル起動) ---
        document.getElementById('model-display-clickable').addEventListener('click', openModelDropdown);
        
        // --- (D) モーダル閉じるボタン ---
        document.getElementById('model-dropdown-close').addEventListener('click', closeModelDropdown);
        
        // --- (E) モーダル外側クリックで閉じる ---
        document.getElementById('model-dropdown-modal').addEventListener('click', (e) => {
            if (e.target.id === 'model-dropdown-modal') {
                closeModelDropdown();
            }
        });

        // --- (F) モーダル内リストアイテムクリック ---
        document.getElementById('model-dropdown-list').addEventListener('click', (e) => {
            const button = e.target.closest('.model-dropdown-item');
            if (!button) return;

            const selectedModel = button.dataset.model;
            currentModel.chartSelection = selectedModel;

            closeModelDropdown();

            // メインSVGのハイライトを更新
            const column = document.querySelector(`.col-${currentModel.id}`);
            if(column) renderProductCharts(column); // ★ 修正: SVGグラフを再描画してハイライトを適用

            updateModelDisplay(false); // フッター表示と詳細を更新

            // ★ 修正: 詳細表示がされている場合、グラフと仕様表も更新する
            const detailsContainer = document.getElementById(`product-details-${currentModel.id}`);
            if (detailsContainer?.style.display === 'block') {
                const detailsData = getDetailsData(currentModel.id, currentModel.optionL1, currentModel.optionL2);
                if (detailsData) renderProductDetails(detailsData, selectedModel);
            }
        });
        
        // --- (G) ドロップダウン以外の場所をクリックしたら閉じる ---
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.l4-dropdown-wrapper')) {
                document.querySelectorAll('.l4-dropdown-list').forEach(list => {
                    list.style.display = 'none';
                });
            }
        });
    }

    /**
     * ★新規: 3Dビューアモーダル関連
     */
    function setupModelViewerModal() {
        const modal = document.getElementById('model-viewer-modal');
        const closeBtn = document.getElementById('model-viewer-close');
        const viewerContainer = document.getElementById('model-viewer-container');
        const arToggle = document.getElementById('ar-mode-toggle');
        const videoBackground = document.getElementById('ar-video-background');
        let currentModelSrc = '';
        let videoStream = null;

        window.openModelViewer = (src) => {
            currentModelSrc = src;
            arToggle.checked = false; // デフォルトはARオフ
            videoBackground.style.display = 'none';
            renderModelViewer();
            modal.style.display = 'flex';
        };

        const renderModelViewer = (isArMode = false) => {
            const bgColor = isArMode ? 'transparent' : '#f0f0f0'; // ARモードなら背景透明
            viewerContainer.innerHTML = `
                <model-viewer src="${currentModelSrc}"
                              alt="3D model"
                              auto-rotate
                              camera-controls
                              shadow-intensity="1"
                              style="width: 100%; height: 100%; --model-viewer-background-color: ${bgColor}; --progress-bar-color: #3b82f6;">
                </model-viewer>
            `;
        };

        const startArMode = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert('お使いのブラウザはカメラ機能に対応していません。');
                    arToggle.checked = false;
                    return;
                }
                videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                videoBackground.srcObject = videoStream;
                videoBackground.style.display = 'block';
                renderModelViewer(true); // ARモードでビューアを再描画
            } catch (err) {
                console.error("カメラへのアクセスに失敗しました:", err);
                alert('カメラへのアクセスが拒否されたか、カメラが見つかりませんでした。');
                arToggle.checked = false;
            }
        };

        const stopArMode = () => {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                videoStream = null;
            }
            videoBackground.style.display = 'none';
            renderModelViewer(false); // 通常モードでビューアを再描画
        };

        const closeModelViewer = () => {
            modal.style.display = 'none';
            stopArMode(); // ARモードを停止
            viewerContainer.innerHTML = '';
        };

        closeBtn.addEventListener('click', closeModelViewer);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModelViewer(); });
        arToggle.addEventListener('change', () => {
            if (arToggle.checked) {
                startArMode();
            } else {
                stopArMode();
            }
        });
    }

    /**
     * ★新規: 型式一覧モーダル関連のセットアップ
     */
    function setupQuickSelectModal() {
        const openBtn = document.getElementById('quick-select-btn');
        const closeBtn = document.getElementById('quick-select-modal-close');
        const modal = document.getElementById('quick-select-modal');
        const tableBody = document.getElementById('quick-select-table-body');
        const categoryTabsContainer = document.getElementById('quick-select-category-tabs');
        const subCategoryTabsContainer = document.getElementById('quick-select-subcategory-tabs');
        const filterInput = document.getElementById('quick-select-filter-input');
        const usageToggleContainer = document.getElementById('quick-select-usage-toggle');

        let currentTableData = []; // 現在テーブルに表示されているデータの配列

        // モーダルを開く
        openBtn.addEventListener('click', () => {
            initializeModalView();
            modal.style.display = 'flex';
        });

        // モーダルを閉じる
        const closeModal = () => {
            modal.style.display = 'none';
        };
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // モーダル表示の初期化
        function initializeModalView() {
            // メインカテゴリのタブを生成
            categoryTabsContainer.innerHTML = Object.keys(quickSelectData).map(cat => 
                `<button class="quick-select-tab-btn" data-category="${cat}">${cat}</button>`
            ).join('');
            subCategoryTabsContainer.innerHTML = '';
            subCategoryTabsContainer.style.display = 'none';
            tableBody.innerHTML = '';
            filterInput.value = ''; // フィルターをリセット
            resetUsageToggle(); // 用途トグルをリセット

            // 最初のタブをアクティブにして表示
            const firstTab = categoryTabsContainer.querySelector('.quick-select-tab-btn');
            if (firstTab) {
                firstTab.click();
            }
        }
        
        // 用途トグルを初期状態（標準）に戻す
        function resetUsageToggle() {
            usageToggleContainer.querySelectorAll('.quick-select-usage-btn').forEach(btn => btn.classList.remove('active'));
            usageToggleContainer.querySelector('.quick-select-usage-btn[data-usage-value=""]').classList.add('active');
        }

        // メインカテゴリタブのクリックイベント
        categoryTabsContainer.addEventListener('click', e => {
            if (!e.target.classList.contains('quick-select-tab-btn')) return;

            const category = e.target.dataset.category;
            const data = quickSelectData[category];

            filterInput.value = ''; // タブ切り替えでフィルターをリセット

            // タブのアクティブ状態を更新
            categoryTabsContainer.querySelectorAll('.quick-select-tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            if (Array.isArray(data)) { // ポンプ単体
                subCategoryTabsContainer.style.display = 'none';
                subCategoryTabsContainer.innerHTML = '';
                populateQuickSelectTable(data);
            } else { // ポンプ・モータ一体型
                subCategoryTabsContainer.style.display = 'flex';
                // サブカテゴリのタブを生成
                subCategoryTabsContainer.innerHTML = Object.keys(data).map(subCat => 
                    `<button class="quick-select-tab-btn" data-category="${category}" data-subcategory="${subCat}">${subCat}</button>`
                ).join('');
                // 最初のサブタブをクリック
                const firstSubTab = subCategoryTabsContainer.querySelector('.quick-select-tab-btn');
                if (firstSubTab) {
                    firstSubTab.click();
                }
            }
        });

        // サブカテゴリタブのクリックイベント
        subCategoryTabsContainer.addEventListener('click', e => {
            if (!e.target.classList.contains('quick-select-tab-btn')) return;

            const category = e.target.dataset.category;
            const subcategory = e.target.dataset.subcategory;
            const data = quickSelectData[category][subcategory];

            filterInput.value = ''; // タブ切り替えでフィルターをリセット

            // タブのアクティブ状態を更新
            subCategoryTabsContainer.querySelectorAll('.quick-select-tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            populateQuickSelectTable(data);
        });

        // ★新規: フィルター入力イベント
        filterInput.addEventListener('input', () => {
            const activeCatTab = categoryTabsContainer.querySelector('.active');
            const activeSubCatTab = subCategoryTabsContainer.querySelector('.active');
            if (!activeCatTab) return;

            const category = activeCatTab.dataset.category;
            let data;
            if (activeSubCatTab) {
                const subcategory = activeSubCatTab.dataset.subcategory;
                data = quickSelectData[category][subcategory];
            } else {
                data = quickSelectData[category];
            }
            populateQuickSelectTable(data);
        });

        // ★新規: 用途トグルクリックイベント
        usageToggleContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-select-usage-btn')) {
                usageToggleContainer.querySelectorAll('.quick-select-usage-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // ★修正: テーブルを再描画してフィルターを適用する
                const activeCatTab = categoryTabsContainer.querySelector('.active');
                const activeSubCatTab = subCategoryTabsContainer.querySelector('.active');
                if (!activeCatTab) return;

                const category = activeCatTab.dataset.category;
                const subcategory = activeSubCatTab ? activeSubCatTab.dataset.subcategory : null;
                const data = subcategory ? quickSelectData[category][subcategory] : quickSelectData[category];
                
                populateQuickSelectTable(data);
            }
        });

        // テーブルの内容をデータに基づいて生成
        function populateQuickSelectTable(dataArray) {
            const tableHeader = document.getElementById('quick-select-table-header');
            tableHeader.innerHTML = ''; // ヘッダーもクリア
            tableBody.innerHTML = ''; // 既存の内容をクリア

            if (!dataArray || dataArray.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-gray-500 py-4">該当する型式はありません。</td></tr>`;
                return;
            }

            // ★修正: フィルターを適用
            const activeUsageBtn = usageToggleContainer.querySelector('.quick-select-usage-btn.active');
            const usageValue = activeUsageBtn ? activeUsageBtn.dataset.usageValue : '';
            const filterText = filterInput.value.toLowerCase();

            const filteredData = dataArray.filter(item => {
                // 1. 用途フィルター
                if (usageValue) { // 「標準」以外が選択されている
                    if (!item.code.includes('[用途]')) return false; // 用途オプションがないものは除外
                    if (usageValue === 'PL' && !['2A', '3H'].includes(item.series)) {
                        return false; // 液封仕様は2Aと3Hのみ
                    }
                }

                // 2. 型式表記テキストフィルター
                // フィルターチェック用に、現在選択されている用途でプレースホルダーを一時的に置換
                // [出力]と[規格]は、item.code自体にそれらの文字列が含まれているかで判定するため、ここでは置換しない
                const tempCodeForFiltering = item.code.replace(/\[用途\]/g, usageValue);
                
                // ユーザーが入力したテキストでフィルター
                // これにより、"FTP-1E75S" のような部分的な型式でも検索可能になる
                return tempCodeForFiltering.toLowerCase().includes(filterText);
            });

            currentTableData = filteredData; // 現在の表示データを保存

            // --- 動的カラム表示のためのチェック ---
            const hasOutputColumn = filteredData.some(item => item.output && item.output.length > 0);
            const hasRegulationColumn = filteredData.some(item => item.regulation && item.regulation.length > 0);

            // --- ヘッダーの動的生成 ---
            let headerHTML = `
                <th class="w-1/12">シリーズ</th>
                <th class="w-2/12">ポンプ型式</th>
                <th class="w-3/12">型式表記</th>
            `;
            if (hasOutputColumn) {
                headerHTML += `<th class="w-2/12">出力</th>`;
            }
            if (hasRegulationColumn) {
                headerHTML += `<th class="w-2/12">規格</th>`;
            }
            headerHTML += `
                <th class="w-1/12">最大吐出圧力</th>
                <th class="w-1/12">最大吐出量</th>
                <th class="w-1/12"></th>
            `;
            tableHeader.innerHTML = headerHTML;


            // --- ボディ(行)の動的生成 ---
            filteredData.forEach((item, index) => {
                const row = document.createElement('tr');
                row.dataset.index = index;

                // 出力ドロップダウン
                const outputOptions = item.output ? item.output.map(o => `<option value="${o}">${o}</option>`).join('') : '';
                const outputSelect = item.output ? `<select class="quick-select-output">${outputOptions}</select>` : 'ー';

                // 規格ドロップダウン
                const regulationOptions = item.regulation ? item.regulation.map(r => {
                    const [value, text] = r.split('：');
                    return `<option value="${value}">${text || value}</option>`;
                }).join('') : '';
                const regulationSelect = item.regulation ? `<select class="quick-select-regulation">${regulationOptions}</select>` : 'ー';

                let rowHTML = `
                    <td>${item.series}</td>
                    <td>${item.model}</td>
                    <td class="quick-select-code-display"></td>
                `;
                if (hasOutputColumn) {
                    rowHTML += `<td>${outputSelect}</td>`;
                }
                if (hasRegulationColumn) {
                    rowHTML += `<td>${regulationSelect}</td>`;
                }
                rowHTML += `
                    <td>${item.pressure}</td>
                    <td>${item.flow}</td>
                    <td><button class="confirm-selection-btn">選択</button></td>
                `;
                row.innerHTML = rowHTML;
                tableBody.appendChild(row);

                // 型式表記を初期設定
                updateQuickSelectCodeDisplay(row);
            });
        }

        // 型式表記を更新する関数
        function updateQuickSelectCodeDisplay(row) {
            const index = parseInt(row.dataset.index, 10);
            const item = currentTableData[index];
            const codeDisplayCell = row.querySelector('.quick-select-code-display');
            if (!item || !codeDisplayCell) return;
            
            let code = item.code;

            const outputSelect = row.querySelector('.quick-select-output');
            if (outputSelect) {
                code = code.replace(/\[出力\]/g, outputSelect.value);
            }

            const regulationSelect = row.querySelector('.quick-select-regulation');
            if (regulationSelect) {
                code = code.replace(/\[規格\]/g, regulationSelect.value);
            }

            // ★新規: 用途トグルの値を反映
            const activeUsageBtn = usageToggleContainer.querySelector('.quick-select-usage-btn.active');
            const usageValue = activeUsageBtn ? activeUsageBtn.dataset.usageValue : '';
            code = code.replace(/\[用途\]/g, usageValue);

            codeDisplayCell.textContent = code;
        }

        // ドロップダウンの変更イベント
        tableBody.addEventListener('change', (e) => {
            if (e.target.matches('.quick-select-output, .quick-select-regulation')) {
                const row = e.target.closest('tr');
                updateQuickSelectCodeDisplay(row);
            }
        });

        /**
         * currentModelの状態に基づいて、メインUIの状態（カラム、ボタン、画像）を直接設定する
         */
        function setActiveWithOptions() {
            if (!currentModel || !currentModel.id) return;

            // --- 1. 全てのカラムをリセット ---
            document.querySelectorAll('.capacity-column').forEach(col => col.classList.remove('column-active'));
            productContainer.classList.remove('has-active');

            // --- 2. 対象カラムを特定してアクティブ化 ---
            const column = document.querySelector(`.col-${currentModel.id}`);
            if (!column) return;

            column.classList.add('column-active');
            productContainer.classList.add('has-active');
            headerTitle.textContent = '＜　 シリーズ一覧に戻る';
            headerTitle.classList.add('cursor-pointer', 'hover:text-blue-600');

            // --- 3. オプションボタンの状態をリセット & 再設定 ---
            column.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
            const subOptionsContainer = column.querySelector('.sub-options-container');
            if (subOptionsContainer) subOptionsContainer.style.display = 'none';

            let finalImageSrc = productData.find(p => p.id === currentModel.id)?.imageSrc;

            // L1
            if (currentModel.optionL1) {
                const l1Button = column.querySelector(`.option-level-1-button[data-option-index="${currentModel.optionL1.optionIndex}"]`);
                if (l1Button) {
                    l1Button.classList.add('active');
                    finalImageSrc = currentModel.optionL1.imageSrc || finalImageSrc;
                    if (currentModel.optionL1.subOptions && currentModel.optionL1.subOptions.length > 0) {
                        renderSubOptions(column, currentModel.optionL1, 'L2');
                    }
                }
            }
            // L2
            if (currentModel.optionL2) {
                const l2Button = column.querySelector(`.option-L2-button[data-sub-option-index="${currentModel.optionL2.optionIndex}"]`);
                if (l2Button) {
                    l2Button.classList.add('active');
                    finalImageSrc = currentModel.optionL2.imageSrc || finalImageSrc;
                    if (currentModel.optionL2.additionalSubOptions && currentModel.optionL2.additionalSubOptions.length > 0) {
                        renderSubOptions(column, currentModel.optionL2, 'L3');
                    }
                }
            }
            // L3
            if (currentModel.optionL3) {
                const l3Button = column.querySelector(`.option-L3-button[data-sub-option-index="${currentModel.optionL2.additionalSubOptions.findIndex(o => o.modelPart === currentModel.optionL3.modelPart)}"]`);
                if (l3Button) l3Button.classList.add('active');
            }

            // --- 4. 画像とグラフを更新 ---
            updateProductImage(column, finalImageSrc);
            renderProductCharts(column);

            // --- 5. フッターを更新 ---
            updateModelDisplay(true);
        }

        // 「この型式を選択」ボタンのクリックイベント
        tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('confirm-selection-btn')) {
                const row = e.target.closest('tr');
                const index = parseInt(row.dataset.index, 10);
                const selectedData = currentTableData[index]; // 保存しておいたデータから取得
                const product = productData.find(p => p.id === selectedData.series);
                if (!product) return;

                // 選択されたカテゴリ/サブカテゴリに基づいてL1/L2オプションを特定
                const activeCatTab = categoryTabsContainer.querySelector('.active');
                const activeSubCatTab = subCategoryTabsContainer.querySelector('.active');
                const categoryName = activeCatTab.dataset.category;
                const subCategoryName = activeSubCatTab ? activeSubCatTab.dataset.subcategory : null;

                const l1Option = product.options.find(o => o.name === categoryName);
                const l2Option = subCategoryName ? l1Option?.subOptions.find(o => o.name === subCategoryName) : null;
                
                // L3（モータ出力）の選択値を取得
                const outputSelect = row.querySelector('.quick-select-output');
                const selectedOutputValue = outputSelect ? outputSelect.value : null;
                let l3Option = null;
                if (l2Option && l2Option.additionalSubOptions && selectedOutputValue) {
                    l3Option = l2Option.additionalSubOptions.find(o => o.modelPart === selectedOutputValue);
                }

                // 規格と用途の選択値を取得
                const regulationSelect = row.querySelector('.quick-select-regulation');
                const selectedRegulationValue = regulationSelect ? regulationSelect.value : null;
                
                // ★修正: 用途はモーダルのトグルから取得
                const activeUsageBtn = usageToggleContainer.querySelector('.quick-select-usage-btn.active');
                const usageValue = activeUsageBtn ? activeUsageBtn.dataset.usageValue : 'S'; // デフォルトはS


                // currentModelを更新
                currentModel = {
                    base: selectedData.series,
                    id: selectedData.series,
                    chartSelection: selectedData.pumpModel,
                    optionL1: l1Option ? { ...l1Option, optionIndex: product.options.findIndex(o => o.name === categoryName) } : null,
                    optionL2: l2Option ? { ...l2Option, optionIndex: l1Option?.subOptions.findIndex(o => o.name === subCategoryName) } : null,
                    optionL3: l3Option || null,
                    usage: usageValue,
                    optionL4_Axis: "S", // デフォルト
                    optionL4_Rotation: "S", // デフォルト
                    optionL4_Seal: "S", // デフォルト
                    optionL4_Relief: "N", // デフォルト
                    optionL4_Regulation: selectedRegulationValue // ★ 規格を追加
                };

                closeModal();

                // 新しいUI同期関数を呼び出す
                setActiveWithOptions();
            }
        });
    }

    // --- 初期化処理 ---
    generateProductColumns();
    setupEventListeners();
    setupQuickSelectModal(); // ★新規: モーダルのセットアップ関数を呼び出し
    setupModelViewerModal(); // ★新規: 3Dビューアモーダルのセットアップ

});