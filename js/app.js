/**
 * @file FTP選定ツール アプリケーションロジック
 * このファイルは、アプリケーションの起動処理、API通信、状態管理を統合して担当します。
 */

// 必要なモジュールをインポート
import { setupEventListeners } from './events.js';
import { generateProductColumns, setupQuickSelectModal, setupModelViewerModal } from './ui.js';

// ===================================================================================
// #region State Management (旧 state.js)
// アプリケーションの状態と定数を一元管理します。
// ===================================================================================

export const CONSTANTS = {
    OPTION_TYPE: {
        PUMP_ONLY: "ポンプ単体",
        MOTOR_SET: "ポンプ・モータ 一体型",
        BASE_COUPLING: "ベースカップリング取付型"
    },
    MAIN_CHART_LABELS: {
        label: "ご希望の性能に適した型式を選択してください",
        xAxisLabel: "最大吐出量(L/min)",
        yAxisLabel: "最大吐出圧力(MPa)"
    },
    DETAIL_CHART_LABELS: {
        FLOW: {
            xAxisLabel: "圧力(MPa)",
            yAxisLabel: "吐出量(L/min)"
        },
        POWER: {
            xAxisLabel: "圧力(MPa)",
            yAxisLabel: "軸電力(W)"
        }
    },
    QUICK_SELECT_OPTIONS: {
        usage: { "S": "標準", "WO": "燃料油・クーラント用" },
        axis: { "S": "標準(平割り)", "M": "M(Dカット)" },
        rotation: { "S": "標準(反時計)", "R": "R(時計)" },
        seal: { "S": "標準(-5～40℃)", "VF": "VF(120℃)" },
        relief: { "N": "なし", "VB": "VB(あり)" }
    }
};

export let currentModel = {};
let productData = [];
let quickSelectData = {};

export function getProductData() { return productData; }
function setProductData(data) { productData = data; }
export function getQuickSelectData() { return quickSelectData; }
function setQuickSelectData(data) { quickSelectData = data; }

export function resetCurrentModel() {
    currentModel = {
        base: null, id: null, chartSelection: null,
        optionL1: null, optionL2: null, optionL3: null,
        usage: "S",
        rpm: 1500,
        optionL4_Axis: "S",
        optionL4_Rotation: "S",
        optionL4_Seal: "S",
        optionL4_Relief: "N"
    };
}

resetCurrentModel();

// #endregion

// ===================================================================================
// #region API (旧 api.js)
// 外部リソースとのデータ通信を担当します。
// ===================================================================================

async function loadData() {
    try {
        const [productRes, quickSelectRes] = await Promise.all([
            fetch('productData.json'),
            fetch('quickSelectData.json')
        ]);
        if (!productRes.ok || !quickSelectRes.ok) {
            throw new Error('データの読み込みに失敗しました。');
        }
        const productData = await productRes.json();
        const quickSelectData = await quickSelectRes.json();
        return { productData, quickSelectData };
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('header-title').textContent = 'エラー: データを読み込めませんでした。ページを再読み込みしてください。';
        return { productData: null, quickSelectData: null };
    }
}

// #endregion

// ===================================================================================
// #region Application Entry Point (旧 app.js)
// アプリケーションの初期化と起動処理を行います。
// ===================================================================================

// --- DOM読み込み後の処理 ---
document.addEventListener('DOMContentLoaded', async () => {
    async function initializeApp() {
        const { productData, quickSelectData } = await loadData();
        if (!productData) return;
        
        setProductData(productData);
        setQuickSelectData(quickSelectData);

        generateProductColumns();

        setupEventListeners();
        setupQuickSelectModal();
        setupModelViewerModal();
    }

    initializeApp();
});

// #endregion