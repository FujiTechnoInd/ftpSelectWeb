/**
 * @file イベントリスナー管理
 * このファイルは、ユーザーのインタラクション（クリック、入力など）を処理する
 * すべてのイベントリスナーを管理します。
 * UIからのイベントを検知し、stateを更新し、ui/chartモジュールの関数を呼び出して
 * 表示の更新を指示する「司令塔」の役割を担います。
 */

import { currentModel, getProductData, resetCurrentModel } from './app.js';
import {
    updateDescription,
    updateUI,
    clearProductDetails,
    renderSubOptions,
    updateProductImage,
    resetAllColumns,
    renderProductDetails,
    getDetailsData,
    openModelDropdown,
    closeModelDropdown
} from './ui.js';
import { renderProductCharts, destroyMainSvgCharts } from './chart.js';

/**
 * 製品カラム（写真部分）がクリックされたときの処理を担うハンドラ。
 * @param {HTMLElement} column - クリックされた製品カラム要素。
 */
function handleProductColumnClick(column) {
    const isAlreadyActive = column.classList.contains('column-active');

    // 状態とUIを一旦リセット
    resetCurrentModel();
    resetAllColumns();
    destroyMainSvgCharts();

    // 非アクティブなカラムがクリックされた場合、それをアクティブにする
    if (!isAlreadyActive) {
        column.classList.add('column-active');
        document.getElementById('product-container').classList.add('has-active');

        // 選択された製品のIDを`currentModel`に保存
        const button = column.querySelector('.product-button');
        if (button) {
            currentModel.base = button.dataset.modelBase;
            currentModel.id = button.dataset.modelId;
        }

        // ヘッダーを「戻る」表示に変更し、性能グラフを描画
        const headerTitle = document.getElementById('header-title');
        headerTitle.textContent = '＜　 シリーズ一覧に戻る';
        headerTitle.classList.add('cursor-pointer', 'hover:text-blue-600');
        renderProductCharts(column);

        setTimeout(() => {
            headerTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    // UIを更新
    updateUI(false);
}

/**
 * L1オプションボタン（製品構成）がクリックされたときの処理。
 * @param {HTMLButtonElement} l1Button - クリックされたL1ボタン要素。
 * @param {object} product - 現在選択中の製品データオブジェクト。
 * @param {HTMLElement} currentActiveColumn - 現在アクティブな製品カラム要素。
 */
function handleL1ButtonClick(l1Button, product, currentActiveColumn) {
    const optionIndex = parseInt(l1Button.dataset.optionIndex, 10);
    const selectedOption = { ...product.options[optionIndex], optionIndex };
    const isActive = l1Button.classList.contains('active');

    currentActiveColumn.querySelectorAll('.option-level-1-button').forEach(btn => btn.classList.remove('active'));

    // L2, L3オプションの表示をクリア
    const subOptionsContainer = currentActiveColumn.querySelector('.sub-options-container');
    if(subOptionsContainer) {
        currentActiveColumn.querySelector('.options-level-2').innerHTML = '';
        currentActiveColumn.querySelector('.options-level-3').innerHTML = '';
        subOptionsContainer.classList.remove('show');
    }

    clearProductDetails(currentModel.id);
    // L4オプションの選択状態と表示をリセット
    currentModel.optionL4_Axis = "S";
    currentModel.optionL4_Rotation = "S";
    currentModel.optionL4_Seal = "S";
    currentModel.optionL4_Relief = "N";
    const l4Container = currentActiveColumn.querySelector('.options-level-4-container');
    if (l4Container) {
        l4Container.querySelectorAll('.l4-dropdown-button span').forEach(span => {
            const defaultItem = span.closest('.l4-dropdown-wrapper')?.querySelector('.l4-dropdown-item[data-value="S"], .l4-dropdown-item[data-value="N"]');
            if (defaultItem) span.textContent = defaultItem.textContent;
        });
        l4Container.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
        l4Container.querySelectorAll('.l4-dropdown-item[data-value="S"]').forEach(item => item.classList.add('active'));
        l4Container.querySelectorAll('.l4-dropdown-item[data-value="N"]').forEach(item => item.classList.add('active'));
    }
    // L1, L2, L3の選択状態をリセット
    currentModel.optionL1 = null;
    currentModel.optionL2 = null;
    currentModel.optionL3 = null;

    // ボタンが非アクティブだった場合（新規選択）
    if (!isActive) {
        l1Button.classList.add('active');
        currentModel.optionL1 = selectedOption;
        if (selectedOption.subOptions && selectedOption.subOptions.length > 0) {
            renderSubOptions(currentActiveColumn, selectedOption, 'L2');
        }
    }
    updateUI(true);
}

/**
 * L2オプションボタン（モータ種別など）がクリックされたときの処理。
 * @param {HTMLButtonElement} l2Button - クリックされたL2ボタン要素。
 * @param {HTMLElement} currentActiveColumn - 現在アクティブな製品カラム要素。
 */
function handleL2ButtonClick(l2Button, currentActiveColumn) {
    const subOptionIndex = parseInt(l2Button.dataset.subOptionIndex, 10);
    const selectedL1Option = currentModel.optionL1;
    if (!selectedL1Option) return;

    // L3の選択状態を保持しておく
    const previousL3Selection = currentModel.optionL3;

    const selectedL2Option = { ...selectedL1Option.subOptions[subOptionIndex], optionIndex: subOptionIndex };
    const isActive = l2Button.classList.contains('active');

    // L2, L3の選択状態と表示をリセット
    l2Button.closest('.options-level-2').querySelectorAll('.option-L2-button').forEach(btn => btn.classList.remove('active'));
    currentActiveColumn.querySelector('.options-level-3').innerHTML = '';
    currentModel.optionL2 = null;
    currentModel.optionL3 = null;

    if (!isActive) {
        l2Button.classList.add('active');
        currentModel.optionL2 = selectedL2Option;
        if (selectedL2Option.additionalSubOptions && selectedL2Option.additionalSubOptions.length > 0) {
            renderSubOptions(currentActiveColumn, selectedL2Option, 'L3');

            if (previousL3Selection) {
                const matchingL3Index = selectedL2Option.additionalSubOptions.findIndex(opt => opt.modelPart === previousL3Selection.modelPart);
                if (matchingL3Index !== -1) {
                    currentModel.optionL3 = selectedL2Option.additionalSubOptions[matchingL3Index];
                    const l3ButtonToActivate = currentActiveColumn.querySelector(`.option-L3-button[data-sub-option-index="${matchingL3Index}"]`);
                    if (l3ButtonToActivate) {
                        l3ButtonToActivate.classList.add('active');
                    }
                }
            }
        }
    }
    updateUI(true);
}

/**
 * L3オプションボタン（モータ出力）がクリックされたときの処理。
 * @param {HTMLButtonElement} l3Button - クリックされたL3ボタン要素。
 */
function handleL3ButtonClick(l3Button) {
    const subOptionIndex = parseInt(l3Button.dataset.subOptionIndex, 10);
    const isActive = l3Button.classList.contains('active');
    const selectedL2Option = currentModel.optionL2;
    if (!selectedL2Option || !selectedL2Option.additionalSubOptions) return;

    const selectedL3Option = selectedL2Option.additionalSubOptions[subOptionIndex];
    l3Button.closest('.options-level-3').querySelectorAll('.option-L3-button').forEach(btn => btn.classList.remove('active'));
    currentModel.optionL3 = null;

    if (!isActive) {
        l3Button.classList.add('active');
        currentModel.optionL3 = selectedL3Option;
    }
    updateUI(false);
}

/**
 * 用途トグルボタンがクリックされたときの処理。
 * @param {HTMLButtonElement} usageButton - クリックされた用途ボタン要素。
 */
function handleUsageToggleClick(usageButton) {
    const newValue = usageButton.dataset.value;
    currentModel.usage = newValue;

    const wrapper = usageButton.closest('.usage-toggle-buttons-wrapper');
    wrapper.querySelectorAll('.usage-toggle-button').forEach(btn => btn.classList.remove('active'));
    usageButton.classList.add('active');

    updateUI(false);
}

/**
 * L4ドロップダウンのアイテムがクリックされたときの処理。
 * @param {HTMLButtonElement} l4Item - クリックされたL4ドロップダウンアイテム要素。
 */
function handleL4DropdownItemClick(l4Item) {
    const value = l4Item.dataset.value;
    const wrapper = l4Item.closest('.l4-dropdown-wrapper');
    const button = wrapper.querySelector('.l4-dropdown-button');
    const type = button.dataset.l4Type;

    currentModel[`optionL4_${type}`] = value;

    // --- ここから追加: 排他処理ロジック ---
    // リリーフバルブ(VB)と回転方向(R)は同時選択できない
    if (type === 'Relief' && value === 'VB' && currentModel.optionL4_Rotation === 'R') {
        // VBが選択されたので、回転方向を標準(S)に戻す
        currentModel.optionL4_Rotation = 'S';
        // UI表示も更新する
        const rotationWrapper = document.querySelector('.l4-dropdown-button[data-l4-type="Rotation"]')?.closest('.l4-dropdown-wrapper');
        if (rotationWrapper) {
            rotationWrapper.querySelector('.l4-dropdown-button span').textContent = '標準(反時計)';
            rotationWrapper.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
            rotationWrapper.querySelector('.l4-dropdown-item[data-value="S"]').classList.add('active');
        }
    } else if (type === 'Rotation' && value === 'R' && currentModel.optionL4_Relief === 'VB') {
        // Rが選択されたので、リリーフバルブを なし(N) に戻す
        currentModel.optionL4_Relief = 'N';
        // UI表示も更新する
        const reliefWrapper = document.querySelector('.l4-dropdown-button[data-l4-type="Relief"]')?.closest('.l4-dropdown-wrapper');
        if (reliefWrapper) {
            reliefWrapper.querySelector('.l4-dropdown-button span').textContent = 'なし';
            reliefWrapper.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
            reliefWrapper.querySelector('.l4-dropdown-item[data-value="N"]').classList.add('active');
        }
    }
    // --- ここまで追加 ---

    button.querySelector('span').textContent = l4Item.textContent;
    wrapper.querySelectorAll('.l4-dropdown-item').forEach(item => item.classList.remove('active'));
    l4Item.classList.add('active');
    if (l4Item.closest('.l4-dropdown-list')) {
        l4Item.closest('.l4-dropdown-list').classList.remove('show');
    }

    updateUI(false);
}

/**
 * アプリケーション全体のイベントリスナーを設定します。
 * イベント委任（Event Delegation）を活用し、動的に生成される要素にも対応します。
 */
export function setupEventListeners() {
    const productContainer = document.getElementById('product-container');
    const headerTitle = document.getElementById('header-title');

    // --- (A) productContainerへの集約リスナー ---
    // 製品選択エリア内のクリックイベントをすべてここで捕捉します。
    productContainer.addEventListener('click', (e) => {

        // (A-1) 製品カラム（写真）のクリック
        const clickableArea = e.target.closest('.product-button-wrapper');
        const productColumn = clickableArea?.closest('.capacity-column');
        if (productColumn) {
            handleProductColumnClick(productColumn);
            return;
        }

        // (A-2) 3Dビューアボタンのクリック
        const view3dButton = e.target.closest('.view-3d-button');
        if (view3dButton) {
            const modelSrc = view3dButton.dataset.modelSrc;
            const modal = document.getElementById('model-viewer-modal');
            if (modal && modal.open) {
                modal.open(modelSrc);
            }
            return;
        }

        // --- (A-3) オプション関連のクリック ---
        const currentActiveColumn = document.querySelector('.capacity-column.column-active');
        if (!currentActiveColumn) return;

        const product = getProductData().find(p => p.id === currentModel.id);
        if (!product) return;

        // (A-3-1) 用途トグルボタン
        const usageButton = e.target.closest('.usage-toggle-button');
        if (usageButton) {
            handleUsageToggleClick(usageButton);
            return;
        }

        // (A-3-2) L1オプションボタン
        const l1Button = e.target.closest('.option-level-1-button');
        if (l1Button) {
            handleL1ButtonClick(l1Button, product, currentActiveColumn);
            return;
        }

        // (A-3-3) L2オプションボタン
        const l2Button = e.target.closest('.option-L2-button[data-level="L2"]');
        if (l2Button) {
            handleL2ButtonClick(l2Button, currentActiveColumn);
            return;
        }

        // (A-3-4) L3オプションボタン
        const l3Button = e.target.closest('.option-L3-button[data-level="L3"]');
        if (l3Button) {
            handleL3ButtonClick(l3Button);
            return;
        }

        // (A-3-5) L4ドロップダウンの開閉ボタン
        const l4Button = e.target.closest('.l4-dropdown-button');
        if (l4Button) {
            // 他のドロップダウンを閉じる
            currentActiveColumn.querySelectorAll('.l4-dropdown-list').forEach(list => {
                if (list !== l4Button.nextElementSibling) list.classList.remove('show');
            });
            const list = l4Button.nextElementSibling;
            list.classList.toggle('show');
            return;
        }

        // (A-3-6) L4ドロップダウンのアイテム
        const l4Item = e.target.closest('.l4-dropdown-item');
        if (l4Item) {
            handleL4DropdownItemClick(l4Item);
            return;
        }
    });

    // --- (B) documentへの集約リスナー ---
    // 動的に生成される要素（製品詳細エリア内のボタンなど）のイベントを捕捉します。
    document.addEventListener('click', (e) => {
        const rpmButton = e.target.closest('.rpm-toggle-button'); // 回転数トグルボタン
        if (rpmButton) {
            const newRpm = parseInt(rpmButton.dataset.rpm, 10);
            if (newRpm === currentModel.rpm) return;
            currentModel.rpm = newRpm;
            const detailsData = getDetailsData(currentModel.id, currentModel.optionL1, currentModel.optionL2);
            if (detailsData) {
                renderProductDetails(detailsData, currentModel.chartSelection);
            }
        }
    });

    // --- (C) ヘッダークリック（シリーズ一覧に戻る） ---
    headerTitle.addEventListener('click', () => {
        if (!productContainer.classList.contains('has-active')) return;
        resetCurrentModel();
        resetAllColumns();
        destroyMainSvgCharts();
        updateUI(false);
    });

    // --- (D) フッタークリック（簡易型式選択モーダル起動） ---
    document.getElementById('model-display-clickable').addEventListener('click', openModelDropdown);

    // --- (E) 簡易型式選択モーダル関連のイベント ---
    document.getElementById('model-dropdown-close').addEventListener('click', closeModelDropdown);
    // モーダル外側のクリックで閉じる
    document.getElementById('model-dropdown-modal').addEventListener('click', (e) => {
        if (e.target.id === 'model-dropdown-modal') closeModelDropdown();
    });
    // モーダル内の型式アイテムクリック
    document.getElementById('model-dropdown-list').addEventListener('click', (e) => {
        const button = e.target.closest('.model-dropdown-item');
        if (!button) return;
        currentModel.chartSelection = button.dataset.model;
        closeModelDropdown();
        const column = document.querySelector(`.col-${currentModel.id}`);
        if (column) renderProductCharts(column);
        const detailsContainer = document.getElementById(`product-details-${currentModel.id}`);
        if (detailsContainer?.style.display === 'block') {
            const detailsData = getDetailsData(currentModel.id, currentModel.optionL1, currentModel.optionL2);
            if (detailsData) renderProductDetails(detailsData, button.dataset.model);
        }
        updateUI(false);
    });

    // --- (F) L4ドロップダウン外側クリックで閉じる ---
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.l4-dropdown-wrapper')) {
            document.querySelectorAll('.l4-dropdown-list').forEach(list => list.classList.remove('show'));
        }
    });
}