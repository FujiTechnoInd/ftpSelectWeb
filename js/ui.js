// state.jsとchart.jsから定数や関数をインポート
import { CONSTANTS, currentModel, getProductData, getQuickSelectData, resetCurrentModel } from './app.js';
import { renderDetailsChartJs, destroyDetailCharts, renderProductCharts } from './chart.js';

// DOM要素の取得
const productContainer = document.getElementById('product-container');
const modelFooterContainer = document.getElementById('model-footer-container');
const modelParts = Array.from({ length: 11 }, (_, i) => document.getElementById(`model-part-${i + 1}`));

/**
 * 1つの製品シリーズ（カラム）のHTML文字列を生成します。
 * @param {object} product - state.jsの製品データオブジェクト
 * @returns {string} 製品カラムのHTML文字列
 */
function createProductColumnHTML(product) {
    const showOptions = product.options.length > 0;
    const optionsClass = showOptions ? 'has-options-true' : 'has-options-false';
    const chartContainerId = `chart-container-${product.id}`;
    const chartTitle = CONSTANTS.MAIN_CHART_LABELS.label;
    const initialDescription = product.description || ''; // トップレベルのdescriptionのみを初期値として使用

    // 製品構成（ポンプ単体、モータセットなど）のボタンを生成
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

    // カラム全体のHTMLを構築
    return `
    <div class="capacity-column col-${product.id} border-b border-gray-200 ${optionsClass}">
        <div class="product-button-wrapper">
            <button class="product-button group" style="--tw-ring-color: ${product.ringColor};"
            data-model-base="${product.id}" data-model-id="${product.id}">
                <img src="${product.imageSrc}" alt="${product.name} 製品写真" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all"></div>
                <span class="absolute bottom-4 left-4 text-2xl font-bold text-white ${product.colorClass}">${product.name}</span>
            </button>
        </div>
        <!-- 吐出量を示すバー -->
        <div class="capacity-bar-container">
            <div class="capacity-bar-fill" style="width: ${product.capacityPercent};"></div>
            <span class="capacity-spec-text">${product.capacitySpec}</span>
        </div>
        <div class="new-menu-item new-menu-column-wrapper">
            <!-- オプション選択エリア (製品構成、モータ種類など) -->
            ${showOptions ? `
            <div class="options-area-wrapper p-4 border-b border-gray-200">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">製品構成を選択</h3>
                <div class="flex flex-col gap-4">
                    <div class="options-level-1 flex flex-row gap-2">
                        ${optionsL1HTML}
                    </div>
                    <div class="sub-options-container">
                        <div class="options-level-2"></div>
                        <div class="options-level-3"></div>
                    </div>
                </div>
            </div>
            ` : ''}
            <!-- メインの性能グラフ表示エリア -->
            <div class="graphs-area-wrapper p-4"> 
                <div id="${chartContainerId}" class="chart-wrapper bg-white rounded-lg shadow-lg">
                        <h4 class="chart-title">${chartTitle}</h4>
                </div>
            </div>
        </div>
        <div class="product-description-wrapper" data-product-id="${product.id}">
            <div class="product-description-text-container">
                <span class="product-description-text">${initialDescription}</span>
            </div>
        </div>
        <!-- 詳細オプション(L4)エリア: 用途、軸端形状など -->
        ${showOptions ? `
        <div class="options-level-4-container" data-product-id="${product.id}">
            ${product.id !== '1RA' ? `
                <h4 class="options-level-4-title">オプション</h4>
                <label class="l4-label">用途</label>
                <div class="usage-toggle-buttons-wrapper mb-4" data-product-id="${product.id}">
                    <button class="usage-toggle-button active" data-value="S">標準</button>
                    <button class="usage-toggle-button" data-value="WO">燃料油・クーラント用</button>
                    ${['2A', '3H'].includes(product.id) ? `
                        <button class="usage-toggle-button" data-value="PL">液封仕様</button>
                    ` : ''}
                </div>
            
                <div class="grid grid-cols-2 gap-4">
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-label">軸端形状</label>
                        <button class="l4-dropdown-button" data-l4-type="Axis">
                            <span data-l4-value="S">標準(平割り)</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list";">
                            <button class="l4-dropdown-item active" data-value="S">標準(平割り)</button>
                            <button class="l4-dropdown-item" data-value="M">M(Dカット)</button>
                        </div>
                    </div>
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-label">回転方向</label>
                        <button class="l4-dropdown-button" data-l4-type="Rotation">
                            <span data-l4-value="S">標準(反時計)</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list">
                            <button class="l4-dropdown-item active" data-value="S">標準(反時計)</button>
                            <button class="l4-dropdown-item" data-value="R">R(時計)</button>
                        </div>
                    </div>
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-label">シール材質</label>
                        <button class="l4-dropdown-button" data-l4-type="Seal">
                            <span data-l4-value="S">標準(-5～40℃)</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list">
                            <button class="l4-dropdown-item active" data-value="S">標準(-5～40℃)</button>
                            <button class="l4-dropdown-item" data-value="VF">VF(120℃)</button>
                        </div>
                    </div>
                    <div class="l4-dropdown-wrapper">
                        <label class="l4-label">リリーフバルブ</label>
                        <button class="l4-dropdown-button" data-l4-type="Relief">
                            <span data-l4-value="N">なし</span>
                            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="l4-dropdown-list">
                            <button class="l4-dropdown-item active" data-value="N">なし</button>
                            <button class="l4-dropdown-item" data-value="VB">VB(あり)</button>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
        ` : ''}
        <div id="product-details-${product.id}" class="product-details-container"></div>
    </div>
    `;
}

/**
 * 全ての製品カラムをDOMにレンダリングします。
 */
export function generateProductColumns() {
    const allProductsHTML = getProductData().map(createProductColumnHTML).join('');
    productContainer.innerHTML = allProductsHTML;
}

/**
 * フッターの型式表示用のプレースホルダー要素を作成します。
 * @param {string} [content='□'] - プレースホルダーのテキスト
 * @param {string} [className=''] - 追加するCSSクラス
 * @returns {HTMLElement} span要素
 */
function createPlaceholder(content = '□', className = '') {
    const span = document.createElement('span');
    span.className = `model-placeholder ${className}`.trim();
    span.textContent = content;
    return span;
}

/**
 * フッターの型式表示用の値要素を作成します。
 * @param {string} content - 表示する値
 * @returns {HTMLElement} span要素
 */
function createValue(content) {
    const span = document.createElement('span');
    span.className = 'model-value';
    span.textContent = content;
    return span;
}

/**
 * フッターの型式表示用の静的テキスト要素（ハイフンなど）を作成します。
 * @param {string} text - 表示するテキスト
 * @returns {HTMLElement} span要素
 */
function createStaticText(text) {
    const span = document.createElement('span');
    span.className = 'model-static';
    span.textContent = text;
    return span;
}

/**
 * 現在の選択状態(`currentModel`)に基づいて、フッターに表示する型式文字列のパーツ配列を構築します。
 * @returns {HTMLElement[]} 型式を構成するspan要素の配列
 */
export function buildModelStringParts() {
    const parts = [];
    const { id, chartSelection, optionL1, optionL2, optionL3, usage, optionL4_Axis, optionL4_Rotation, optionL4_Seal, optionL4_Relief } = currentModel;

    // シリーズIDに応じて型式構成ロジックを分岐
    if (id === "1RA") {
        parts.push(createValue(id));
        parts.push(createStaticText("-"));
        parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
    } else if (["1A", "2A", "3F", "3H"].includes(id)) {
        // ポンプ単体の場合
        if (optionL1?.name === CONSTANTS.OPTION_TYPE.PUMP_ONLY) {
            parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
            if (["WO", "PL"].includes(usage)) parts.push(createValue(usage));
            if (optionL4_Axis === "M") parts.push(createValue("M"));
            if (optionL4_Rotation === "R") parts.push(createValue("R"));
            if (optionL4_Seal === "VF") parts.push(createValue("VF"));
            if (optionL4_Relief === "VB") parts.push(createValue("-VB"));
        }
        // モータセットの場合
        else if (optionL1?.name === CONSTANTS.OPTION_TYPE.MOTOR_SET) {
            if (optionL2?.modelConfig) {
                parts.push(createValue(optionL2.modelConfig.part3));
                parts.push(optionL3 ? createValue(optionL3.modelPart) : createPlaceholder("□"));
                if (id !== '1A') parts.push(createStaticText("-"));
                parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
                if (["WO", "PL"].includes(usage)) parts.push(createValue(usage));
            } else {
                // L2/L3が未選択でも、ポンプ型式を先に表示し、その後にモータ部分のプレースホルダーを置く
                // → 修正: モータ情報のプレースホルダーを先に表示する
                parts.push(createPlaceholder("□"));
                parts.push(createPlaceholder("□"));
                if (id !== '1A') parts.push(createStaticText("-"));
                parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
                if (["WO", "PL"].includes(usage)) parts.push(createValue(usage));
            }
            if (optionL4_Axis === "M") parts.push(createValue("M"));
            if (optionL4_Rotation === "R") parts.push(createValue("R"));
            if (optionL4_Seal === "VF") parts.push(createValue("VF"));
            if (optionL4_Relief === "VB") parts.push(createValue("-VB"));
        }
        // ベースカップリングの場合
        else if (optionL1?.name === CONSTANTS.OPTION_TYPE.BASE_COUPLING) {
            parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
            if (["WO", "PL"].includes(usage)) parts.push(createValue(usage));
            if (optionL4_Axis === "M") parts.push(createValue("M"));
            if (optionL4_Rotation === "R") parts.push(createValue("R"));
            if (optionL4_Seal === "VF") parts.push(createValue("VF"));
            if (optionL4_Relief === "VB") parts.push(createValue("-VB"));
        } else {
            // 未選択状態のプレースホルダー
            parts.push(chartSelection ? createValue(chartSelection) : createPlaceholder("□"));
            if (["WO", "PL"].includes(usage)) parts.push(createValue(usage));
            parts.push(createPlaceholder("□"));
            parts.push(createPlaceholder("□"));
            parts.push(createPlaceholder("□"));
        }
    }
    return parts;
}

/**
 * 選択されたオプションに基づいて、表示すべき詳細データ（仕様表、グラフデータなど）を取得します。
 * @param {string} productId - 製品ID (e.g., '1A')
 * @param {object} optionL1 - 選択されたL1オプションオブジェクト
 * @param {object} optionL2 - 選択されたL2オプションオブジェクト
 * @returns {object|null} 詳細データオブジェクト、またはnull
 */
export function getDetailsData(productId, optionL1, optionL2) {
    const productData = getProductData();
    let detailsData = optionL2?.details || optionL1?.details || (productId === '1RA' ? productData.find(p => p.id === '1RA').details : null);
    if (detailsData === "USE_1RA_DETAILS") {
        return productData.find(p => p.id === '1RA').details;
    } else if (detailsData?.specTable === "USE_1RA_SPEC_TABLE_ONLY") {
        return { ...productData.find(p => p.id === '1RA').details, flowChart: null, powerChart: null, dimensionImageSrc: detailsData.dimensionImageSrc };
    }
    return detailsData;
}

/**
 * 指定された製品IDの製品詳細表示エリアをクリアします。
 * @param {string} productId - 製品ID
 */
export function clearProductDetails(productId) {
    const detailsContainer = document.getElementById(`product-details-${productId}`);
    if (detailsContainer) {
        detailsContainer.innerHTML = '';
        detailsContainer.classList.remove('show');
    }
    destroyDetailCharts();
}

/**
 * 製品詳細（寸法図、仕様表、詳細グラフ）をレンダリングします。
 * @param {object} detailsData - 表示する詳細データ
 * @param {string} selectedModel - グラフで選択されているモデル
 */
export function renderProductDetails(detailsData, selectedModel) {
    const detailsContainer = document.getElementById(`product-details-${currentModel.id}`);
    if (!detailsContainer || !detailsData) return;

    const { specTable, flowChart: flowChartData, powerChart: powerChartData, dimensionImageSrc } = detailsData;
    const selectedSpec = specTable.find(s => s.model === selectedModel);
    // 選択されたモデルが仕様表に存在する場合、その行をハイライト。なければ先頭行をハイライト。
    const highlightedModel = selectedSpec ? selectedModel : specTable[0].model;

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
    // 仕様表の各行を生成
    const tableBody = specTable.map(row => `
        <tr class="${row.model === highlightedModel ? 'highlight' : ''}">
            <td>${row.model}</td>
            <td>${row.volume.toFixed(2)}</td>
            <td class="flow-cell" data-flow-1500="${row.flow1500?.toFixed(2) || 'N/A'}" data-flow-1800="${row.flow1800?.toFixed(2) || 'N/A'}">
                ${currentModel.rpm === 1800 ? (row.flow1800?.toFixed(2) || 'N/A') : (row.flow1500?.toFixed(2) || 'N/A')}
            </td>
            <td>${row.pressure.toFixed(1)}</td>
            <td>${row.speed}</td>
            <td>${typeof row.weight === 'number' ? row.weight.toFixed(1) : row.weight}</td>
        </tr>
    `).join('');

    // 詳細エリア全体のHTMLを構築
    detailsContainer.innerHTML = `
        <h2>${currentModel.id} - ${currentModel.chartSelection} 製品詳細</h2>
        <div class="flex justify-between items-center">
            <h3>寸法図面</h3>
            ${detailsData.model3dSrc ? `
                <button class="view-3d-button" data-model-src="${detailsData.model3dSrc}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fill-rule="evenodd" d="M.458 10C3.732 4.943 10 3.5 10 3.5s6.268 1.443 9.542 6.5c-1.33 2.165-3.303 3.788-5.542 4.582A.5.5 0 0113.5 15.5a.5.5 0 01-.458-.418C11.542 14.29 10 13.5 10 13.5s-1.542.79-3.042 1.582A.5.5 0 016.5 15.5a.5.5 0 01-.458-.418C3.759 14.288 1.786 12.665.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                    3Dで確認
                </button>
            ` : ''}
        </div>
        <!-- 寸法図 -->
        <div class="p-4 border border-slate-300 rounded-lg bg-white">
            <img src="${dimensionImageSrc || 'https://placehold.co/800x400/e2e8f0/9ca3b8?text=IMAGE+NOT+FOUND'}" alt="寸法図面" class="w-full h-auto object-contain" onerror="this.src='https://placehold.co/800x400/e2e8f0/9ca3b8?text=IMAGE+NOT+FOUND'">
        </div>
        <div class="mt-6 relative">
            <!-- 仕様表と回転数切り替えボタン -->
            <h3>仕様</h3>
            <div class="absolute top-0 right-0">
                <button class="rpm-toggle-button ${currentModel.rpm === 1500 ? 'active' : ''}" data-rpm="1500">1500min-1</button>
                <button class="rpm-toggle-button ${currentModel.rpm === 1800 ? 'active' : ''}" data-rpm="1800">1800min-1</button>
            </div>
            <table class="spec-table mt-4">
                ${tableHeader}
                <tbody>${tableBody}</tbody>
            </table>
            <p class="spec-table-note">※最大吐出圧力は試供油をISO-VG46 油温40度とした値です(粘度・温度によりことなります)</p>
            <!-- 流量特性グラフ -->
            ${flowChartData ? `
            <h3 class="mt-6">流量特性</h3>
            <div id="flow-chart-${currentModel.id}" class="chart-wrapper bg-white rounded-lg shadow-lg" style="height: 300px;">
                    <h4 class="chart-title">${flowChartData.label}</h4>
            </div>
            ` : ''}
            ${powerChartData ? `
            <!-- 所要動力グラフ -->
            <h3 class="mt-6">所要電力</h3>
            <div id="power-chart-${currentModel.id}" class="chart-wrapper bg-white rounded-lg shadow-lg" style="height: 300px;">
                    <h4 class="chart-title">${powerChartData.label}</h4>
            </div>
            ` : ''}
        </div>
    `;

    detailsContainer.classList.add('show');

    // 詳細グラフを描画
    // ★変更: グラフ描画時に、state.jsで定義した軸ラベルを結合し、回転数に応じたデータセットを渡す
    if (flowChartData) {
        const datasetsForRpm = flowChartData.datasets[currentModel.rpm];
        if (datasetsForRpm) {
            const chartData = { 
                ...flowChartData, 
                datasets: datasetsForRpm,
                ...CONSTANTS.DETAIL_CHART_LABELS.FLOW 
            };
            renderDetailsChartJs(`flow-chart-${currentModel.id}`, chartData, highlightedModel);
        }
    }
    if (powerChartData) {
        const datasetsForRpm = powerChartData.datasets[currentModel.rpm];
        if (datasetsForRpm) {
            const chartData = { ...powerChartData, datasets: datasetsForRpm, ...CONSTANTS.DETAIL_CHART_LABELS.POWER };
            renderDetailsChartJs(`power-chart-${currentModel.id}`, chartData, highlightedModel);
        }
    }
}

/**
 * 選択されたオプションに応じて寸法図の画像を更新します。
 */
export function updateDimensionImage() {
    const detailsContainer = document.getElementById(`product-details-${currentModel.id}`);
    if (!detailsContainer || !detailsContainer.classList.contains('show')) return;

    const img = detailsContainer.querySelector('img[alt="寸法図面"]');
    if (!img) return;

    let newSrc = "https://placehold.co/800x400/e2e8f0/9ca3b8?text=IMAGE+NOT+FOUND";

    // オプション(L4)の選択状態を優先して画像ソースを決定
    const l4ReliefSrc = currentModel.optionL1?.l4_details?.Relief?.[currentModel.optionL4_Relief]?.dimensionImageSrc;
    const l4RotationSrc = currentModel.optionL1?.l4_details?.Rotation?.[currentModel.optionL4_Rotation]?.dimensionImageSrc;

    if (currentModel.optionL4_Relief === 'VB' && l4ReliefSrc) {
        // リリーフバルブ付きの画像があればそれを使用
        newSrc = l4ReliefSrc;
    } else if (currentModel.optionL4_Rotation === 'R' && l4RotationSrc) {
        newSrc = l4RotationSrc;
    } else if (currentModel.optionL2 && currentModel.optionL2.details?.dimensionImageSrc) {
        newSrc = currentModel.optionL2.details.dimensionImageSrc;
    } else if (currentModel.optionL1 && currentModel.optionL1.details?.dimensionImageSrc) {
        newSrc = currentModel.optionL1.details.dimensionImageSrc;
    } else if (currentModel.id === '1RA') {
        newSrc = getProductData().find(p => p.id === '1RA').details.dimensionImageSrc;
    }

    img.src = newSrc;
}

/**
 * サブオプション（L2, L3）のボタンを動的にレンダリングします。
 * @param {HTMLElement} column - 対象となる製品カラムの要素
 * @param {object} parentOption - 親オプションのデータオブジェクト
 * @param {string} level - レンダリングするオプションのレベル ('L2' or 'L3')
 */
export function renderSubOptions(column, parentOption, level) {
    const subOptionsContainer = column.querySelector('.sub-options-container');
    let targetDiv, optionsToRender = [], titleHTML = '';

    if (level === 'L2') {
        targetDiv = column.querySelector('.options-level-2');
        optionsToRender = parentOption.subOptions;
        column.querySelector('.options-level-3').innerHTML = '';
        currentModel.optionL3 = null;
    } else if (level === 'L3') {
        targetDiv = column.querySelector('.options-level-3');
        optionsToRender = parentOption.additionalSubOptions;
        if (optionsToRender && optionsToRender.length > 0) {
            titleHTML = '<h4 class="options-level-3-title">モータ出力</h4>';
        }
    }

    targetDiv.innerHTML = '';

    if (optionsToRender && optionsToRender.length > 0) {
        const subOptionsHTML = optionsToRender.map((opt, index) => `
            <button 
                class="option-button option-${level}-button" 
                data-option-index="${parentOption.optionIndex}" 
                data-sub-option-index="${index}"
                data-level="${level}">
                ${opt.name}
            </button>
        `).join('');
        targetDiv.innerHTML = titleHTML + subOptionsHTML;
    } else {
        targetDiv.innerHTML = '';
    }

    const l2Content = column.querySelector('.options-level-2').innerHTML;
    const l3Content = column.querySelector('.options-level-3').innerHTML;
    // L2またはL3に何かしらコンテンツがあればコンテナを表示する
    if (!l2Content && !l3Content) {
        subOptionsContainer.classList.remove('show');
    } else {
        subOptionsContainer.classList.add('show');
    }
}

/**
 * 型式選択ドロップダウンモーダルを開きます。
 */
export function openModelDropdown() {
    const product = getProductData().find(p => p.id === currentModel.id);
    if (!product) return;

    const modelList = product.charts.chart1.datasets.map(ds => ds.label);
    const listContainer = document.getElementById('model-dropdown-list');
    listContainer.innerHTML = modelList.map(model => `
        <button 
            class="model-dropdown-item ${model === currentModel.chartSelection ? 'active' : ''}" 
            data-model="${model}">
            ${model}
        </button>
    `).join('');

    document.getElementById('model-dropdown-title').textContent = `${currentModel.id} の型式を選択`;
    document.getElementById('model-dropdown-modal').classList.add('show');
}

/**
 * 型式選択ドロップダウンモーダルを閉じます。
 */
export function closeModelDropdown() {
    document.getElementById('model-dropdown-modal').classList.remove('show');
}

/**
 * 製品カラムのメイン画像を更新します。
 * @param {HTMLElement} column - 対象となる製品カラムの要素
 * @param {string} newSrc - 新しい画像のURL
 */
export function updateProductImage(column, newSrc) {
    const img = column.querySelector('.product-button img');
    if (img && newSrc) {
        img.src = newSrc;
    }
}

/**
 * 全ての製品カラムの選択状態をリセットし、初期表示に戻します。
 */
export function resetAllColumns() {
    const headerTitle = document.getElementById('header-title');
    const originalTitleText = "ご希望の最大吐出量に適したシリーズを選択してください。";

    // 各カラムの選択状態を解除
    document.querySelectorAll('.capacity-column').forEach(col => {
        col.classList.remove('column-active');
        col.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));

        const subOptionsContainer = col.querySelector('.sub-options-container');
        if (subOptionsContainer) subOptionsContainer.classList.remove('show');

        const l4Container = col.querySelector('.options-level-4-container');
        if (l4Container) l4Container.classList.remove('show');

        // ★追加: 説明文のコンテナを非表示にする
        const descriptionWrapper = col.querySelector('.product-description-wrapper');
        if (descriptionWrapper) {
            descriptionWrapper.classList.remove('has-content'); // 状態クラスもリセット
        }

        const productId = col.querySelector('.product-button')?.dataset.modelId;
        if (productId) {
            // 詳細表示をクリアし、画像を初期状態に戻す
            clearProductDetails(productId);
            const originalProduct = getProductData().find(p => p.id === productId);
            if (originalProduct) updateProductImage(col, originalProduct.imageSrc);
        }
    });
    productContainer.classList.remove('has-active');
    headerTitle.textContent = originalTitleText;
    headerTitle.classList.remove('cursor-pointer', 'hover:text-blue-600');
}

/**
 * 現在の選択状態(`currentModel`)に基づいて、メインの製品カラムの画像を更新します。
 * `imageSrc`がオブジェクトの場合、`usage`キーに基づいて適切な画像を選択します。
 */
function updateMainProductImage() {
    if (!currentModel.id) return;

    const column = document.querySelector(`.col-${currentModel.id}`);
    const product = getProductData().find(p => p.id === currentModel.id);
    if (!column || !product) return;

    let imageSrc = product.imageSrc; // デフォルトは製品トップの画像

    if (currentModel.optionL1?.imageSrc) {
        const src = currentModel.optionL1.imageSrc;
        // imageSrcがオブジェクトなら、usageに基づいて画像を選択
        imageSrc = (typeof src === 'object' && src !== null) ? (src[currentModel.usage] || src['S']) : src;
    }

    updateProductImage(column, imageSrc);
}

/**
 * `currentModel`の状態に基づいてUI全体（フッター、詳細表示など）を更新します。
 * @param {boolean} [scrollToFooter=false] - 更新後にフッターにスクロールするかどうか
 */
export function updateUI(scrollToFooter = false) {
    // ★追加: UI更新の起点で必ずdescriptionを更新する
    if (currentModel.id) {
        updateDescription(currentModel.id);
    }
    updateMainProductImage(); // ★追加: UI更新時に常にメイン画像をチェック・更新する

    // フッターを表示すべきか判定
    // ポンプ型式(chartSelection)が選択されたらフッターを表示する、というシンプルなルールに統一
    const shouldShowFooter = !!currentModel.chartSelection;

    // フッターが不要な場合は非表示にし、関連するUIをクリアして処理を終了
    if (!shouldShowFooter) {
        modelFooterContainer.classList.remove('show');
        if (currentModel.id) {
            clearProductDetails(currentModel.id);
            const l4Container = document.querySelector(`.col-${currentModel.id} .options-level-4-container`);
            if (l4Container) l4Container.classList.remove('show');
        }
        return;
    }

    // 詳細オプション(L4)と製品詳細を表示すべきか判定
    let showL4AndDetails = false;
    if (currentModel.id === '1RA' && currentModel.chartSelection) {
        showL4AndDetails = true;
    } else if (currentModel.optionL1) {
        if (currentModel.optionL1.name === CONSTANTS.OPTION_TYPE.MOTOR_SET) {
            if (currentModel.optionL2 && currentModel.optionL3 && currentModel.chartSelection) {
                showL4AndDetails = true;
            }
        } else {
            if (currentModel.chartSelection) {
                showL4AndDetails = true;
            }
        }
    }

    // L4コンテナの表示/非表示を切り替え
    const l4Container = document.querySelector(`.col-${currentModel.id} .options-level-4-container`);
    if (l4Container) {
        l4Container.classList.toggle('show', showL4AndDetails);
    }

    // 製品詳細コンテナの表示/非表示と内容のレンダリングを制御
    const detailsContainer = document.getElementById(`product-details-${currentModel.id}`);
    if (detailsContainer) {
        if (showL4AndDetails) {
            if (!detailsContainer.classList.contains('show') || detailsContainer.innerHTML.trim() === '') {
                const detailsData = getDetailsData(currentModel.id, currentModel.optionL1, currentModel.optionL2);
                if (detailsData) {
                    renderProductDetails(detailsData, currentModel.chartSelection);
                }
            }
            updateDimensionImage();
        } else {
            clearProductDetails(currentModel.id);
        }
    }

    // フッターの型式表示を一旦クリア
    modelParts.forEach(part => {
        if (part) part.innerHTML = '';
    });

    // フッターが非表示だった場合は表示する
    modelFooterContainer.classList.add('show');

    // 型式文字列を構築してフッターに表示
    const partsToRender = buildModelStringParts();
    partsToRender.forEach((part, index) => {
        if (modelParts[index]) modelParts[index].appendChild(part);
    });

    if (scrollToFooter) {
        setTimeout(() => {
            modelFooterContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 300);
    }
}

/**
 * 製品説明文を現在の選択状態に基づいて更新します。
 * @param {string} productId - 製品ID
 */
export function updateDescription(productId) {
    const product = getProductData().find(p => p.id === productId);
    if (!product) return;

    const descriptionWrapper = document.querySelector(`.col-${productId} .product-description-wrapper`);
    if (!descriptionWrapper) return;

    const descriptionTextEl = descriptionWrapper.querySelector('.product-description-text');
    if (!descriptionTextEl) return;

    let newDescription = product.description || ''; // デフォルトはトップレベル

    if (currentModel.optionL2 && currentModel.optionL2.description) {
        newDescription = currentModel.optionL2.description;
    } else if (currentModel.optionL1 && currentModel.optionL1.description) {
        const desc = currentModel.optionL1.description;
        if (typeof desc === 'object') {
            newDescription = desc[currentModel.usage] || desc['S'] || '';
        } else {
            newDescription = desc;
        }
    }

    // 説明文の有無に応じてクラスをトグルし、表示制御はCSSに委ねる
    descriptionWrapper.classList.toggle('has-content', !!newDescription);

    // 現在の表示内容と新しい内容が同じ場合は、アニメーションをリセットせずに処理を終了
    if (descriptionTextEl.textContent === newDescription) {
        return;
    }
    
    // アニメーションをリセットして先頭から開始させる
    descriptionTextEl.style.animation = 'none'; // 一旦アニメーションを無効化
    // DOMの再計算を強制的にトリガーする（リフロー）
    void descriptionTextEl.offsetWidth;
    // アニメーションを再適用（style属性を削除し、CSSクラスの定義に戻す）
    descriptionTextEl.style.animation = '';

    descriptionTextEl.textContent = newDescription;
}
/**
 * 3Dビューアモーダルのセットアップとイベントリスナーを設定します。
 */
export function setupModelViewerModal() {
    const modal = document.getElementById('model-viewer-modal');
    const closeBtn = document.getElementById('model-viewer-close');
    const viewerContainer = document.getElementById('model-viewer-container');
    const dimensionToggle = document.getElementById('ar-mode-toggle');
    const qrModal = document.getElementById('qr-code-modal'); // この変数は未使用のようです
    const qrCloseBtn = document.getElementById('qr-code-close-btn');
    const qrImage = document.getElementById('qr-code-image');
    const qrLink = document.getElementById('qr-code-link');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let currentModelSrc = '';

    // モーダルを開き、3Dモデルをレンダリングする関数
    const openModelViewer = (src) => {
        currentModelSrc = src;
        dimensionToggle.checked = false;
        renderModelViewer();
        modal.classList.add('show');
    };

    // `<model-viewer>`要素を動的に生成・挿入する関数
    const renderModelViewer = () => {
        const bgColor = 'transparent';
        viewerContainer.innerHTML = `
            <model-viewer 
                id="main-viewer"
                src="${currentModelSrc}" 
                alt="3D model"
                ar ar-modes="webxr scene-viewer quick-look" ar-placement="floor"
                camera-controls auto-rotate shadow-intensity="1"                    
                style="position: relative; z-index: 2; width: 100%; height: 100%; background-color: transparent; --model-viewer-background-color: ${bgColor}; --progress-bar-color: #3b82f6;">
                ${isMobile ?
                `<button slot="ar-button" class="ar-button">ARで見る</button>` :
                `<button id="pc-ar-button" class="ar-button" style="z-index: 3;">ARで見る</button>`
            }
            </model-viewer>
        `;
    };

    // モーダルを閉じ、中身を空にする関数
    const closeModelViewer = () => {
        modal.classList.remove('show');
        viewerContainer.innerHTML = ''; // 3DモデルをDOMから削除
    };

    // 閉じるボタンやモーダル外のクリックでモーダルを閉じる
    closeBtn.addEventListener('click', closeModelViewer);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModelViewer(); });

    // PCでのARボタンクリック時にQRコードモーダルを表示
    viewerContainer.addEventListener('click', (e) => {
        if (e.target.id === 'pc-ar-button') {
            const arUrl = new URL(window.location.href);
            arUrl.searchParams.set('model', currentModelSrc);
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(arUrl.href)}`;
            const qrCodeModal = document.getElementById('qr-code-modal');
            qrImage.src = qrCodeUrl;
            qrLink.href = arUrl.href;
            if (qrCodeModal) qrCodeModal.style.display = 'flex'; // QRモーダルは特別な制御
        }
    });

    // QRコードモーダルを閉じる処理
    const closeQrModal = () => { document.getElementById('qr-code-modal').style.display = 'none'; };
    qrCloseBtn.addEventListener('click', closeQrModal);
    document.getElementById('qr-code-modal').addEventListener('click', (e) => { if (e.target.id === 'qr-code-modal') closeQrModal(); });

    // 寸法表示トグルの処理
    dimensionToggle.addEventListener('change', () => {
        const viewer = viewerContainer.querySelector('model-viewer');
        if (viewer && !viewer.arActive) {
            viewer.toggleAttribute('show-dimensions', dimensionToggle.checked);
        }
    });

    // URLパラメータにモデルが指定されている場合、ページ読み込み時に3Dビューアを直接開く
    const urlParams = new URLSearchParams(window.location.search);
    const modelToLoad = urlParams.get('model');
    if (modelToLoad) {
        openModelViewer(modelToLoad);
    }

    modal.open = openModelViewer;
}

/**
 * 「型式一覧から選択」モーダルのセットアップとイベントリスナーを設定します。
 */
export function setupQuickSelectModal() {
    const openBtn = document.getElementById('quick-select-btn');
    const closeBtn = document.getElementById('quick-select-modal-close');
    const modal = document.getElementById('quick-select-modal');
    const tableBody = document.getElementById('quick-select-table-body');
    const categoryTabsContainer = document.getElementById('quick-select-category-tabs');
    const subCategoryTabsContainer = document.getElementById('quick-select-subcategory-tabs');
    const filterInput = document.getElementById('quick-select-filter-input');
    const usageToggleContainer = document.getElementById('quick-select-usage-toggle');

    // マウスホバー時に製品画像プレビューを表示するための要素を作成
    const imagePreview = document.createElement('div');
    imagePreview.id = 'quick-select-image-preview';
    imagePreview.className = 'hidden absolute z-50 bg-white border border-gray-300 rounded-lg shadow-xl pointer-events-none flex items-center justify-center';
    imagePreview.style.setProperty('width', '150px', 'important');
    imagePreview.style.setProperty('height', '150px', 'important');
    imagePreview.style.setProperty('padding', '0.5rem', 'important');
    imagePreview.innerHTML = `<img src="" alt="Product Preview" style="width: 100%; height: 100%; object-fit: contain;">`;
    modal.appendChild(imagePreview);
    const imagePreviewImg = imagePreview.querySelector('img');

    let currentTableData = [];

    // モーダルを開く
    openBtn.addEventListener('click', () => {
        const modalContent = modal.querySelector('.quick-select-modal-content');
        if (modalContent) {
            modalContent.style.width = '1200px';
            modalContent.style.height = '80vh';
        }
        initializeModalView();
        modal.classList.add('show');
    });

    // モーダルを閉じる
    const closeModal = () => {
        modal.classList.remove('show');
        imagePreview.classList.add('hidden');
    };
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // モーダルを開いたときの初期化処理
    function initializeModalView() {
        const quickSelectData = getQuickSelectData();
        categoryTabsContainer.innerHTML = Object.keys(quickSelectData).map(cat =>
            `<button class="quick-select-tab-btn" data-category="${cat}">${cat}</button>`
        ).join('');
        subCategoryTabsContainer.innerHTML = '';
        subCategoryTabsContainer.classList.remove('show');
        tableBody.innerHTML = '';
        filterInput.value = '';
        resetUsageToggle();

        const firstTab = categoryTabsContainer.querySelector('.quick-select-tab-btn');
        if (firstTab) firstTab.click();
    }

    // 用途トグルボタンを初期状態（標準）に戻す
    function resetUsageToggle() {
        usageToggleContainer.querySelectorAll('.quick-select-usage-btn').forEach(btn => btn.classList.remove('active'));
        usageToggleContainer.querySelector('.quick-select-usage-btn[data-usage-value=""]').classList.add('active');
    }

    categoryTabsContainer.addEventListener('click', e => {
        // メインカテゴリタブがクリックされたときの処理
        if (!e.target.classList.contains('quick-select-tab-btn')) return;
        const quickSelectData = getQuickSelectData();
        const category = e.target.dataset.category;
        const data = quickSelectData[category];
        filterInput.value = '';
        categoryTabsContainer.querySelectorAll('.quick-select-tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        if (Array.isArray(data)) {
            // サブカテゴリがない場合
            subCategoryTabsContainer.classList.remove('show');
            populateQuickSelectTable(data);
        } else {
            // サブカテゴリがある場合
            subCategoryTabsContainer.innerHTML = Object.keys(data).map(subCat =>
                `<button class="quick-select-tab-btn" data-category="${category}" data-subcategory="${subCat}">${subCat}</button>`
            ).join('');
            subCategoryTabsContainer.classList.add('show');
            const firstSubTab = subCategoryTabsContainer.querySelector('.quick-select-tab-btn');
            if (firstSubTab) firstSubTab.click();
        }
    });

    subCategoryTabsContainer.addEventListener('click', e => {
        // サブカテゴリタブがクリックされたときの処理
        if (!e.target.classList.contains('quick-select-tab-btn')) return;
        const quickSelectData = getQuickSelectData();
        const category = e.target.dataset.category;
        const subcategory = e.target.dataset.subcategory;
        const data = quickSelectData[category][subcategory];
        filterInput.value = '';
        subCategoryTabsContainer.querySelectorAll('.quick-select-tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        populateQuickSelectTable(data);
    });

    // フィルターやトグルの変更時にテーブルを再描画する
    const rePopulateTable = () => {
        const quickSelectData = getQuickSelectData();
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
    };

    filterInput.addEventListener('input', rePopulateTable);
    usageToggleContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-select-usage-btn')) {
            usageToggleContainer.querySelectorAll('.quick-select-usage-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            rePopulateTable();
        }
    });

    /**
     * 渡されたデータ配列に基づいて型式一覧テーブルを生成・表示します。
     * @param {Array} dataArray - 表示する製品データの配列
     */
    function populateQuickSelectTable(dataArray) {
        const tableHeader = document.getElementById('quick-select-table-header');
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';

        if (!dataArray || dataArray.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-gray-500 py-4">該当する型式はありません。</td></tr>`;
            return;
        }

        // 現在のフィルターと用途の選択値を取得
        const activeUsageBtn = usageToggleContainer.querySelector('.quick-select-usage-btn.active');
        const usageValue = activeUsageBtn ? activeUsageBtn.dataset.usageValue : '';
        const filterText = filterInput.value.toLowerCase();

        // データを用途とフィルターテキストで絞り込み
        const filteredData = dataArray.filter(item => {
            if (usageValue && !item.code.includes('[用途]')) return false;
            if (usageValue === 'PL' && !['2A', '3H'].includes(item.series)) return false;
            const tempCodeForFiltering = item.code.replace(/\[用途\]/g, usageValue);
            return tempCodeForFiltering.toLowerCase().includes(filterText);
        });

        currentTableData = filteredData;

        // データに'output'や'regulation'列があるか確認し、テーブルヘッダーを動的に生成
        const hasOutputColumn = filteredData.some(item => item.output && item.output.length > 0);
        const hasRegulationColumn = filteredData.some(item => item.regulation && item.regulation.length > 0);

        // テーブルヘッダーのHTMLを構築
        let headerHTML = `<th class="w-1/12">シリーズ</th><th class="w-2/12">ポンプ型式</th><th class="w-3/12">型式表記</th>`;
        if (hasOutputColumn) headerHTML += `<th class="w-2/12">出力</th>`;
        if (hasRegulationColumn) headerHTML += `<th class="w-2/12">規格</th>`;
        headerHTML += `<th class="w-1/12">最大吐出圧力</th><th class="w-1/12">最大吐出量</th><th class="w-1/12"></th>`;
        tableHeader.innerHTML = headerHTML;

        filteredData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;

            // 出力や規格の選択肢がある場合はセレクトボックスを生成
            const outputSelect = item.output ? `<select class="quick-select-output">${item.output.map(o => `<option value="${o}">${o}</option>`).join('')}</select>` : 'ー';
            const regulationSelect = item.regulation ? `<select class="quick-select-regulation">${item.regulation.map(r => { const [v, t] = r.split('：'); return `<option value="${v}">${t || v}</option>`; }).join('')}</select>` : 'ー';

            // テーブル行のHTMLを構築
            let rowHTML = `<td>${item.series}</td><td>${item.model}</td><td class="quick-select-code-display"></td>`;
            if (hasOutputColumn) rowHTML += `<td>${outputSelect}</td>`;
            if (hasRegulationColumn) rowHTML += `<td>${regulationSelect}</td>`;
            rowHTML += `<td>${item.pressure}</td><td>${item.flow}</td><td><button class="confirm-selection-btn">選択</button></td>`;
            row.innerHTML = rowHTML;
            tableBody.appendChild(row);
            updateQuickSelectCodeDisplay(row);
        });
    }

    /**
     * テーブル行の「型式表記」セルを、現在の選択に基づいて更新します。
     * @param {HTMLTableRowElement} row - 更新対象の行要素
     */
    function updateQuickSelectCodeDisplay(row) {
        const index = parseInt(row.dataset.index, 10);
        const item = currentTableData[index];
        const codeDisplayCell = row.querySelector('.quick-select-code-display');
        if (!item || !codeDisplayCell) return;

        let code = item.code;
        // プレースホルダーをセレクトボックスやトグルの選択値で置換
        const outputSelect = row.querySelector('.quick-select-output');
        if (outputSelect) code = code.replace(/\[出力\]/g, outputSelect.value);
        const regulationSelect = row.querySelector('.quick-select-regulation');
        if (regulationSelect) code = code.replace(/\[規格\]/g, regulationSelect.value);
        const activeUsageBtn = usageToggleContainer.querySelector('.quick-select-usage-btn.active');
        const usageValue = activeUsageBtn ? activeUsageBtn.dataset.usageValue : '';
        code = code.replace(/\[用途\]/g, usageValue);
        codeDisplayCell.textContent = code;
    }

    // テーブル内のセレクトボックスが変更されたら、型式表記を更新
    tableBody.addEventListener('change', (e) => {
        if (e.target.matches('.quick-select-output, .quick-select-regulation')) {
            updateQuickSelectCodeDisplay(e.target.closest('tr'));
        }
    });

    // マウスホバーで画像プレビューを表示する関数
    const showPreview = (event) => {
        const row = event.target.closest('tr');
        if (!row || !row.dataset.index) { hidePreview(); return; }
        const item = currentTableData[parseInt(row.dataset.index, 10)];
        if (!item) return;
        const product = getProductData().find(p => p.id === item.series);
        if (product && product.imageSrc) {
            imagePreviewImg.src = product.imageSrc;
            imagePreview.classList.remove('hidden');
            movePreview(event);
        }
    };
    // プレビューを非表示にする関数
    const hidePreview = () => imagePreview.classList.add('hidden');

    // マウスの動きに合わせてプレビュー画像を移動させる関数
    const movePreview = (event) => {
        if (imagePreview.classList.contains('hidden')) return;
        const previewWidth = imagePreview.offsetWidth;
        const offset = 100;
        let x = event.clientX + offset;
        let y = event.clientY - offset;
        if (x + previewWidth > window.innerWidth) x = event.clientX - previewWidth - offset;
        imagePreview.style.left = `${x}px`;
        imagePreview.style.top = `${y}px`;
    };

    // 画像プレビュー関連のイベントリスナーを設定
    tableBody.addEventListener('pointerenter', showPreview, true);
    tableBody.addEventListener('pointerleave', hidePreview, true);
    tableBody.addEventListener('pointermove', movePreview, true);

    /**
     * 「型式一覧から選択」モーダルで選択された型式情報をメインのUIに反映させます。
     * `currentModel`を更新し、メイン画面の表示を同期させます。
     */
    function syncUIToCurrentModel() {
        if (!currentModel || !currentModel.id) return;

        document.querySelectorAll('.capacity-column').forEach(col => col.classList.remove('column-active'));
        productContainer.classList.remove('has-active');

        const column = document.querySelector(`.col-${currentModel.id}`);
        if (!column) return;

        // メインUIの状態をリセットし、選択されたシリーズのカラムをアクティブにする
        column.classList.add('column-active');
        productContainer.classList.add('has-active');
        const headerTitle = document.getElementById('header-title');
        headerTitle.textContent = '＜　 シリーズ一覧に戻る';
        headerTitle.classList.add('cursor-pointer', 'hover:text-blue-600');

        // --- UI同期処理 ---
        // currentModelの状態に基づいて、L1, L2, L3のボタンとサブオプション表示を再構築する

        // まずはすべてのボタンとサブオプション表示をクリア
        column.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
        const subOptionsContainer = column.querySelector('.sub-options-container');
        if (subOptionsContainer) subOptionsContainer.classList.remove('show');
        column.querySelector('.options-level-2').innerHTML = '';
        column.querySelector('.options-level-3').innerHTML = '';

        // L1オプションを反映
        if (currentModel.optionL1) {
            const l1Button = column.querySelector(`.option-level-1-button[data-option-index="${currentModel.optionL1.optionIndex}"]`);
            if (l1Button) {
                l1Button.classList.add('active');
                // L2オプションを描画
                renderSubOptions(column, currentModel.optionL1, 'L2');
            }
        }
        // L2オプションを反映
        if (currentModel.optionL2) {
            const l2Button = column.querySelector(`.option-L2-button[data-sub-option-index="${currentModel.optionL2.optionIndex}"]`);
            if (l2Button) {
                l2Button.classList.add('active');
                // L3オプションを描画
                renderSubOptions(column, currentModel.optionL2, 'L3');
            }
        }
        // L3オプションを反映
        if (currentModel.optionL3) {
            const l3Button = column.querySelector(`.option-L3-button[data-sub-option-index="${currentModel.optionL2.additionalSubOptions.findIndex(o => o.modelPart === currentModel.optionL3.modelPart)}"]`);
            if (l3Button) l3Button.classList.add('active');
        }

        // グラフを再描画し、UI全体を更新
        renderProductCharts(column);
        updateUI(true);
    }

    tableBody.addEventListener('click', (e) => {
        // テーブル行の「選択」ボタンがクリックされたときの処理
        if (e.target.classList.contains('confirm-selection-btn')) {
            const row = e.target.closest('tr');
            const index = parseInt(row.dataset.index, 10);
            const selectedData = currentTableData[index];
            const product = getProductData().find(p => p.id === selectedData.series);
            if (!product) return;

            // 選択されたときのカテゴリ、サブカテゴリ名を取得
            const activeCatTab = categoryTabsContainer.querySelector('.active');
            const activeSubCatTab = subCategoryTabsContainer.querySelector('.active');
            const categoryName = activeCatTab.dataset.category;
            const subCategoryName = activeSubCatTab ? activeSubCatTab.dataset.subcategory : null;

            // 対応するL1, L2, L3オプションを特定
            const l1Option = product.options.find(o => o.name === categoryName);
            const l2Option = subCategoryName ? l1Option?.subOptions.find(o => o.name === subCategoryName) : null;

            const outputSelect = row.querySelector('.quick-select-output');
            const selectedOutputValue = outputSelect ? outputSelect.value : null;
            let l3Option = null;
            if (l2Option?.additionalSubOptions && selectedOutputValue) {
                l3Option = l2Option.additionalSubOptions.find(o => o.modelPart === selectedOutputValue);
            }

            const regulationSelect = row.querySelector('.quick-select-regulation');
            const selectedRegulationValue = regulationSelect ? regulationSelect.value : null;

            const preservedRpm = currentModel.rpm; // 現在のRPM設定を保持
            const activeUsageBtn = usageToggleContainer.querySelector('.quick-select-usage-btn.active');
            const usageValue = activeUsageBtn ? activeUsageBtn.dataset.usageValue : 'S';

            resetCurrentModel();
            // 新しい選択内容で`currentModel`を更新
            Object.assign(currentModel, {
                rpm: preservedRpm, // 保持したRPMを復元
                base: selectedData.series,
                id: selectedData.series,
                chartSelection: selectedData.pumpModel,
                optionL1: l1Option ? { ...l1Option, optionIndex: product.options.findIndex(o => o.name === categoryName) } : null,
                optionL2: l2Option ? { ...l2Option, optionIndex: l1Option?.subOptions.findIndex(o => o.name === subCategoryName) } : null,
                optionL3: l3Option || null,
                usage: usageValue,
                optionL4_Regulation: selectedRegulationValue
            });

            // モーダルを閉じ、メインUIを更新
            closeModal();
            syncUIToCurrentModel();
        }
    });
}