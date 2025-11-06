// --- 製品データ ---
const CONSTANTS = {
    OPTION_TYPE: {
        PUMP_ONLY: "ポンプ単体",
        MOTOR_SET: "ポンプ・モータ 一体型",
        BASE_COUPLING: "ベースカップリング取付型"
    }
};

const productData = [
    {
        id: "1RA",
        name: "1RA",
        imageSrc: "https://lh3.googleusercontent.com/d/1_7E2FnO12mlbeT3WG9U8zDKjI4vLFn3U",
        colorClass: "text-pump-lighterBlue",
        ringColor: "#cce7ff",
        capacitySpec: "4.5L まで",
        capacityPercent: "20%",
        charts: {
            chart1: {
                label: "ご希望の性能に適した型式を選択してください", 
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [
                    {
                        label: "100",
                        data: [{x: 0, y: 0.5}, {x: 2.0, y: 0.5}], 
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: "200",
                        data: [{x: 2.0, y: 0.5}, {x: 3.2, y: 0.5}], 
                        borderColor: 'rgb(234, 179, 8)',
                        backgroundColor: 'rgba(234, 179, 8, 0.2)',
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: "300",
                        data: [{x: 3.2, y: 0.5}, {x: 4.5, y: 0.5}], 
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        fill: true,
                        tension: 0.1
                    }
                ]
            }
        },
        options: [],
        // 1RAの詳細データ
        details: {
            dimensionImageSrc: "https://lh3.googleusercontent.com/d/17sH1rf-gis2HNazVn-J9i2wSlGthrIvG", // 1RA 図面
            specTable: [
                { model: "100", volume: 1.16, flow1500: 1.74, flow1800: 2.08, pressure: 0.5, speed: 2000, weight: 1.1 },
                { model: "200", volume: 1.80, flow1500: 2.70, flow1800: 3.24, pressure: 0.5, speed: 2000, weight: 1.2 },
                { model: "300", volume: 2.50, flow1500: 3.75, flow1800: 4.50, pressure: 0.5, speed: 2000, weight: 1.3 }
            ],
            flowChart: { 
                label: "流量特性 (1500min-1)",
                xAxisLabel: "圧力(MPa)",
                yAxisLabel: "吐出量(L/min)",
                datasets: [
                    { label: "100", data: [{x: 0.1, y: 1.69}, {x: 0.2, y: 1.67}, {x: 0.3, y: 1.64}, {x: 0.4, y: 1.62}, {x: 0.5, y: 1.59}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                    { label: "200", data: [{x: 0.1, y: 2.72}, {x: 0.2, y: 2.70}, {x: 0.3, y: 2.67}, {x: 0.4, y: 2.65}, {x: 0.5, y: 2.62}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                    { label: "300", data: [{x: 0.1, y: 3.71}, {x: 0.2, y: 3.69}, {x: 0.3, y: 3.68}, {x: 0.4, y: 3.66}, {x: 0.5, y: 3.64}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false } 
                ]
            },
            powerChart: { 
                label: "所要電力 (1500min-1)",
                xAxisLabel: "圧力(MPa)",
                yAxisLabel: "軸電力(W)",
                datasets: [
                    { label: "100", data: [{x: 0.1, y: 25}, {x: 0.2, y: 34}, {x: 0.3, y: 44}, {x: 0.4, y: 54}, {x: 0.5, y: 63}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                    { label: "200", data: [{x: 0.1, y: 29}, {x: 0.2, y: 40}, {x: 0.3, y: 51}, {x: 0.4, y: 63}, {x: 0.5, y: 75}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                    { label: "300", data: [{x: 0.1, y: 36}, {x: 0.2, y: 49}, {x: 0.3, y: 63}, {x: 0.4, y: 77}, {x: 0.5, y: 91}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false } 
                ]
            }
        }
    },
    { 
        id: "1A",
        name: "1A",
        imageSrc: "https://lh3.googleusercontent.com/d/1AyvbUYDkMSd0yGd5_lhlQpX2a7Zo-S2C",
        colorClass: "text-pump-lightBlue",
        ringColor: "#add8e6",
        capacitySpec: "8.1L まで",
        capacityPercent: "35%",
        charts: { 
            chart1: {
                label: "ご希望の性能に適した型式を選択してください",
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [
                    { label: "10", data: [{x: 0, y: 0.5}, {x: 1.4, y: 0.5}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true },
                    { label: "11", data: [{x: 1.4, y: 0.5}, {x: 2.7, y: 0.5}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: true },
                    { label: "12", data: [{x: 2.7, y: 0.5}, {x: 4.5, y: 0.5}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true },
                    { label: "13", data: [{x: 4.5, y: 0.5}, {x: 8.1, y: 0.5}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true }
                ]
            }
        },
        options: [ 
            { 
                name: CONSTANTS.OPTION_TYPE.PUMP_ONLY, 
                enabled: true, 
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [], // L2 オプションはなし
                imageSrc: "https://lh3.googleusercontent.com/d/1AyvbUYDkMSd0yGd5_lhlQpX2a7Zo-S2C", 
                // ★ 新規: L4オプション用の詳細データを定義
                l4_details: {
                    Relief: { // リリーフバルブ
                        VB: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/12MeCSg6gpCdz49odXqKKeB7Rbcm0tdq4" }
                    },
                    Rotation: { // ★ 新規: 回転方向
                        R: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/1S78oib2w72nmmZ9vT8HlYRoLnjYKtfAp" }
                    }
                },
                details: { // ★ 1A ポンプ単体の詳細
                    dimensionImageSrc: "https://lh3.googleusercontent.com/d/1WZvsqbh6VYjR4eKFlSbNAt6ukA_h9rvc", // 1A ポンプ単体 図面 (仮)
                    specTable: [
                        { model: "10", volume: 0.8, flow1500: 1.2, flow1800: 1.4, pressure: 0.5, speed: 3000, weight: 0.5 },
                        { model: "11", volume: 1.5, flow1500: 2.2, flow1800: 2.7, pressure: 0.5, speed: 2000, weight: 0.51 },
                        { model: "12", volume: 2.5, flow1500: 3.7, flow1800: 4.5, pressure: 0.5, speed: 1800, weight: 0.57 },
                        { model: "13", volume: 4.5, flow1500: 6.7, flow1800: 8.1, pressure: 0.5, speed: 1800, weight: 0.76 }
                    ],
                    flowChart: { 
                        label: "流量特性 (1450min-1)", xAxisLabel: "圧力(MPa)", yAxisLabel: "吐出量(L/min)",
                        datasets: [
                            { label: "10", data: [{x: 0.1, y: 1.18}, {x: 0.2, y: 1.17}, {x: 0.3, y: 1.17}, {x: 0.4, y: 1.16}, {x: 0.5, y: 1.16}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                            { label: "11", data: [{x: 0.1, y: 2.21}, {x: 0.2, y: 2.16}, {x: 0.3, y: 2.12}, {x: 0.4, y: 2.07}, {x: 0.5, y: 2.03}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                            { label: "12", data: [{x: 0.1, y: 3.58}, {x: 0.2, y: 3.50}, {x: 0.3, y: 3.43}, {x: 0.4, y: 3.36}, {x: 0.5, y: 3.29}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false }, 
                            { label: "13", data: [{x: 0.1, y: 6.68}, {x: 0.2, y: 6.55}, {x: 0.3, y: 6.43}, {x: 0.4, y: 6.31}, {x: 0.5, y: 6.19}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: false } 
                        ]
                    },
                    powerChart: { 
                        label: "所要電力 (1450min-1)", xAxisLabel: "圧力(MPa)", yAxisLabel: "軸電力(W)",
                        datasets: [
                            { label: "10", data: [{x: 0.1, y: 37}, {x: 0.2, y: 41}, {x: 0.3, y: 45}, {x: 0.4, y: 49}, {x: 0.5, y: 52}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                            { label: "11", data: [{x: 0.1, y: 43}, {x: 0.2, y: 48}, {x: 0.3, y: 52}, {x: 0.4, y: 57}, {x: 0.5, y: 62}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                            { label: "12", data: [{x: 0.1, y: 50}, {x: 0.2, y: 59}, {x: 0.3, y: 68}, {x: 0.4, y: 77}, {x: 0.5, y: 88}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false }, 
                            { label: "13", data: [{x: 0.1, y: 52}, {x: 0.2, y: 75}, {x: 0.3, y: 89}, {x: 0.4, y: 103}, {x: 0.5, y: 117}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: false } 
                        ]
                    },
                },
                notes: "単体"
            },
            { 
                name: CONSTANTS.OPTION_TYPE.MOTOR_SET, 
                enabled: true,
                imageSrc: "https://lh3.googleusercontent.com/d/1lJAwYdMuN7wcoDxOMPfvCoXD-Ai2kqDY", // L1ダミー画像
                modelConfig: { part3: null, part4: "S", part5: null, part6: "A", part7: "M", part8: null, part9: null, part11: null },
                subOptions: [ // L2
                    { 
                        name: "単相モータ", 
                        type: "motor",
                        modelConfig: { part3: "1ME", part4: null }, 
                        imageSrc: "https://lh3.googleusercontent.com/d/1lJAwYdMuN7wcoDxOMPfvCoXD-Ai2kqDY", 
                        details: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/1lJAwYdMuN7wcoDxOMPfvCoXD-Ai2kqDY", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ // L3 (モータ出力)
                            { name: "75", modelPart: "75" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "三相モータ", 
                        type: "motor",
                        modelConfig: { part3: "1E", part4: null }, 
                        imageSrc: "https://lh3.googleusercontent.com/d/1mS2hee3AG9t6ExVHBQi9mBUySCQn_q_K", 
                        details: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/1mS2hee3AG9t6ExVHBQi9mBUySCQn_q_K", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "各国規制対応", 
                        type: "motor",
                        modelConfig: { part3: "1E", part4: null }, 
                        imageSrc: "https://placehold.co/800x600/888888/ffffff?text=1A+REGULATION", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/888888/ffffff?text=1A+REGULATION+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    }
                ],
                notes: "一体型"
            },
            { 
                name: CONSTANTS.OPTION_TYPE.BASE_COUPLING, 
                enabled: true,
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [], 
                imageSrc: "https://placehold.co/800x600/add8e6/00008b?text=1A+BASE+COUPLING", // ★ ダミー画像
                details: { dimensionImageSrc: "https://placehold.co/800x400/add8e6/00008b?text=1A+BASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null },
                notes: "ベースカップリング取付型"
            }
        ],
        details: null 
    },
    {
        id: "2A",
        name: "2A",
        imageSrc: "https://lh3.googleusercontent.com/d/1bb1Ne5IkZxEliA29xWxNoJE3BeMCfg-d",
        colorClass: "text-pump-lightGreen",
        ringColor: "#90ee90",
        capacitySpec: "36L まで",
        capacityPercent: "50%",
        charts: {
            chart1: {
                label: "ご希望の性能に適した型式を選択してください", 
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [{ 
                    label: "2A",
                    data: [{x: 0, y: 1.2}, {x: 20, y: 1.0}, {x: 30, y: 0.8}, {x: 40, y: 0.5}],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            }
        },
        options: [ 
            { 
                name: CONSTANTS.OPTION_TYPE.PUMP_ONLY, 
                enabled: true, 
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [],
                imageSrc: "https://placehold.co/800x600/90ee90/006400?text=2A+PUMP+ONLY", 
                details: "USE_1RA_DETAILS", 
                notes: "単体"
            },
            { 
                name: CONSTANTS.OPTION_TYPE.MOTOR_SET, 
                enabled: true,
                imageSrc: "https://placehold.co/800x600/90ee90/006400?text=2A+MOTOR+SET",
                modelConfig: { part3: null, part4: "S", part5: null, part6: "A", part7: "M", part8: null, part9: null, part11: null },
                subOptions: [
                    { 
                        name: "単相モータ", 
                        type: "motor",
                        modelConfig: { part3: "2ME", part4: null },
                        imageSrc: "https://placehold.co/800x600/cccccc/000000?text=2A+SINGLE+PHASE", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/cccccc/000000?text=2A+SINGLE+PHASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "三相モータ", 
                        type: "motor",
                        modelConfig: { part3: "2E", part4: null },
                        imageSrc: "https://placehold.co/800x600/aaaaaa/ffffff?text=2A+THREE+PHASE", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/aaaaaa/ffffff?text=2A+THREE+PHASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "各国規制対応", 
                        type: "motor",
                        modelConfig: { part3: "2E", part4: null },
                        imageSrc: "https://placehold.co/800x600/888888/ffffff?text=2A+REGULATION", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/888888/ffffff?text=2A+REGULATION+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    }
                ],
                notes: "一体型"
            },
            { 
                name: CONSTANTS.OPTION_TYPE.BASE_COUPLING, 
                enabled: true,
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [], 
                imageSrc: "https://placehold.co/800x600/90ee90/006400?text=2A+BASE+COUPLING",
                details: { dimensionImageSrc: "https://placehold.co/800x400/90ee90/006400?text=2A+BASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null },
                notes: "ベースカップリング取付型"
            }
        ],
        details: null 
    },
    {
        id: "3F",
        name: "3F (A/B)",
        imageSrc: "https://lh3.googleusercontent.com/d/135LDHJhsQNJykVvSF5jtF_XccXSfMz0z",
        colorClass: "text-pump-purple",
        ringColor: "#d8b4fe",
        capacitySpec: "93.6L まで",
        capacityPercent: "75%",
        charts: {
            chart1: {
                label: "ご希望の性能に適した型式を選択してください", 
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [{ 
                    label: "3F",
                    data: [{x: 0, y: 1.5}, {x: 40, y: 1.2}, {x: 70, y: 1.0}, {x: 95, y: 0.7}],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            }
        },
        options: [ 
            { 
                name: CONSTANTS.OPTION_TYPE.PUMP_ONLY, 
                enabled: true, 
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [],
                imageSrc: "https://placehold.co/800x600/d8b4fe/581c87?text=3F+PUMP+ONLY", 
                details: "USE_1RA_DETAILS", 
                notes: "単体"
            },
            { 
                name: CONSTANTS.OPTION_TYPE.MOTOR_SET, 
                enabled: true,
                imageSrc: "https://placehold.co/800x600/d8b4fe/581c87?text=3F+MOTOR+SET",
                modelConfig: { part3: null, part4: "S", part5: null, part6: "A", part7: "M", part8: null, part9: null, part11: null },
                subOptions: [
                    { 
                        name: "単相モータ", 
                        type: "motor",
                        modelConfig: { part3: "3ME", part4: null },
                        imageSrc: "https://placehold.co/800x600/cccccc/000000?text=3F+SINGLE+PHASE", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/cccccc/000000?text=3F+SINGLE+PHASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "三相モータ", 
                        type: "motor",
                        modelConfig: { part3: "3E", part4: null },
                        imageSrc: "https://placehold.co/800x600/aaaaaa/ffffff?text=3F+THREE+PHASE", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/aaaaaa/ffffff?text=3F+THREE+PHASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "各国規制対応", 
                        type: "motor",
                        modelConfig: { part3: "3E", part4: null },
                        imageSrc: "https://placehold.co/800x600/888888/ffffff?text=3F+REGULATION", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/888888/ffffff?text=3F+REGULATION+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    }
                ],
                notes: "一体型"
            },
            { 
                name: CONSTANTS.OPTION_TYPE.BASE_COUPLING, 
                enabled: true,
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [], 
                imageSrc: "https://placehold.co/800x600/d8b4fe/581c87?text=3F+BASE+COUPLING",
                details: { dimensionImageSrc: "https://placehold.co/800x400/d8b4fe/581c87?text=3F+BASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null },
                notes: "ベースカップリング取付型"
            }
        ],
        details: null 
    },
    {
        id: "3H",
        name: "3H",
        imageSrc: "https://lh3.googleusercontent.com/d/1hwGdOkkK47VOcf9sGw4Gm14P_Y2j8OXh",
        colorClass: "text-pump-blue",
        ringColor: "#2563eb",
        capacitySpec: "117L まで",
        capacityPercent: "100%",
        charts: {
            chart1: {
                label: "ご希望の性能に適した型式を選択してください", 
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [{ 
                    label: "3H",
                    data: [{x: 0, y: 2.0}, {x: 50, y: 1.8}, {x: 80, y: 1.5}, {x: 110, y: 1.0}],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            }
        },
        options: [ 
            { 
                name: CONSTANTS.OPTION_TYPE.PUMP_ONLY, 
                enabled: true, 
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [],
                imageSrc: "https://placehold.co/800x600/2563eb/ffffff?text=3H+PUMP+ONLY", 
                details: "USE_1RA_DETAILS", 
                notes: "単体"
            },
            { 
                name: CONSTANTS.OPTION_TYPE.MOTOR_SET, 
                enabled: true,
                imageSrc: "https://placehold.co/800x600/2563eb/ffffff?text=3H+MOTOR+SET",
                modelConfig: { part3: null, part4: "S", part5: null, part6: "A", part7: "M", part8: null, part9: null, part11: null },
                subOptions: [
                    { 
                        name: "単相モータ", 
                        type: "motor",
                        modelConfig: { part3: "3HME", part4: null },
                        imageSrc: "https://placehold.co/800x600/cccccc/000000?text=3H+SINGLE+PHASE", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/cccccc/000000?text=3H+SINGLE+PHASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "三相モータ", 
                        type: "motor",
                        modelConfig: { part3: "3HE", part4: null },
                        imageSrc: "https://placehold.co/800x600/aaaaaa/ffffff?text=3H+THREE+PHASE", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/aaaaaa/ffffff?text=3H+THREE+PHASE+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    },
                    { 
                        name: "各国規制対応", 
                        type: "motor",
                        modelConfig: { part3: "3HE", part4: null },
                        imageSrc: "https://placehold.co/800x600/888888/ffffff?text=3H+REGULATION", 
                        details: { dimensionImageSrc: "https://placehold.co/800x400/888888/ffffff?text=3H+REGULATION+DIM", specTable: "USE_1RA_SPEC_TABLE_ONLY", flowChart: null, powerChart: null }, 
                        additionalSubOptions: [ 
                            { name: "75", modelPart: "75" },
                            { name: "100", modelPart: "100" },
                            { name: "200", modelPart: "200" }
                        ]
                    }
                ],
                notes: "一体型"
            }
        ],
        details: null 
    }
];