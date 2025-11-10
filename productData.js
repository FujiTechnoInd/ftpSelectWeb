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
        capacityPercent: "16%",
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
            model3dSrc: "image/3D/DamagedHelmet.glb",
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
        capacityPercent: "28%",
        charts: { 
            chart1: {
                label: "ご希望の性能に適した型式を選択してください",
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [
                    { label: "10A", data: [{x: 0, y: 0.5}, {x: 1.4, y: 0.5}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true },
                    { label: "11A", data: [{x: 1.4, y: 0.5}, {x: 2.7, y: 0.5}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: true },
                    { label: "12A", data: [{x: 2.7, y: 0.5}, {x: 4.5, y: 0.5}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true },
                    { label: "13A", data: [{x: 4.5, y: 0.5}, {x: 8.1, y: 0.5}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true }
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
                // L4オプション用の詳細データを定義
                l4_details: {
                    Relief: { // リリーフバルブ
                        VB: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/12MeCSg6gpCdz49odXqKKeB7Rbcm0tdq4" }
                    },
                    Rotation: { // 回転方向
                        R: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/1S78oib2w72nmmZ9vT8HlYRoLnjYKtfAp" }
                    }
                },
                details: { // ★ 1A ポンプ単体の詳細
                    dimensionImageSrc: "https://lh3.googleusercontent.com/d/1WZvsqbh6VYjR4eKFlSbNAt6ukA_h9rvc", // 1A ポンプ単体 図面 (仮)
                    specTable: [
                        { model: "10A", volume: 0.8, flow1500: 1.2, flow1800: 1.4, pressure: 0.5, speed: 3000, weight: 0.5 },
                        { model: "11A", volume: 1.5, flow1500: 2.2, flow1800: 2.7, pressure: 0.5, speed: 2000, weight: 0.51 },
                        { model: "12A", volume: 2.5, flow1500: 3.7, flow1800: 4.5, pressure: 0.5, speed: 1800, weight: 0.57 },
                        { model: "13A", volume: 4.5, flow1500: 6.7, flow1800: 8.1, pressure: 0.5, speed: 1800, weight: 0.76 }
                    ],
                    flowChart: { 
                        label: "流量特性 (1450min-1)", xAxisLabel: "圧力(MPa)", yAxisLabel: "吐出量(L/min)",
                        datasets: [
                            { label: "10A", data: [{x: 0.1, y: 1.18}, {x: 0.2, y: 1.17}, {x: 0.3, y: 1.17}, {x: 0.4, y: 1.16}, {x: 0.5, y: 1.16}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                            { label: "11A", data: [{x: 0.1, y: 2.21}, {x: 0.2, y: 2.16}, {x: 0.3, y: 2.12}, {x: 0.4, y: 2.07}, {x: 0.5, y: 2.03}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                            { label: "12A", data: [{x: 0.1, y: 3.58}, {x: 0.2, y: 3.50}, {x: 0.3, y: 3.43}, {x: 0.4, y: 3.36}, {x: 0.5, y: 3.29}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false }, 
                            { label: "13A", data: [{x: 0.1, y: 6.68}, {x: 0.2, y: 6.55}, {x: 0.3, y: 6.43}, {x: 0.4, y: 6.31}, {x: 0.5, y: 6.19}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: false } 
                        ]
                    },
                    powerChart: { 
                        label: "所要電力 (1450min-1)", xAxisLabel: "圧力(MPa)", yAxisLabel: "軸電力(W)",
                        datasets: [
                            { label: "10A", data: [{x: 0.1, y: 37}, {x: 0.2, y: 41}, {x: 0.3, y: 45}, {x: 0.4, y: 49}, {x: 0.5, y: 52}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                            { label: "11A", data: [{x: 0.1, y: 43}, {x: 0.2, y: 48}, {x: 0.3, y: 52}, {x: 0.4, y: 57}, {x: 0.5, y: 62}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                            { label: "12A", data: [{x: 0.1, y: 50}, {x: 0.2, y: 59}, {x: 0.3, y: 68}, {x: 0.4, y: 77}, {x: 0.5, y: 88}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false }, 
                            { label: "13A", data: [{x: 0.1, y: 52}, {x: 0.2, y: 75}, {x: 0.3, y: 89}, {x: 0.4, y: 103}, {x: 0.5, y: 117}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: false } 
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
        imageSrc: "image/product/2A.png",
        colorClass: "text-pump-lightGreen",
        ringColor: "#90ee90",
        capacitySpec: "36L まで",
        capacityPercent: "40%",
        charts: { 
            chart1: {
                label: "ご希望の性能に適した型式を選択してください",
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [
                    { label: "204A", data: [{x: 5, y: 3}, {x: 7.2, y: 3}], borderColor: 'rgb(59, 130, 246)', backgroundColor:'rgba(59, 130, 246, 0.2)', fill: true },
                    { label: "206A", data: [{x: 7.2, y: 2.5}, {x: 10.8, y: 2.5}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: true },
                    { label: "208A", data: [{x: 10.8, y: 2.5}, {x: 14.4, y: 2.5}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true },
                    { label: "210A", data: [{x: 14.4, y: 2.5}, {x: 18.8, y: 2.5}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true },
                    { label: "212A", data: [{x: 18.8, y: 2.0}, {x: 21.6, y: 2.0}], borderColor: 'rgb(168, 85, 247)', backgroundColor: 'rgba(168, 85, 247, 0.2)', fill: true },
                    { label: "216A", data: [{x: 21.6, y: 1.5}, {x: 28.8, y: 1.5}], borderColor: 'rgb(236, 72, 153)', backgroundColor: 'rgba(236, 72, 153, 0.2)', fill: true },
                    { label: "220A", data: [{x: 28.8, y: 1.2}, {x: 36.0, y: 1.2}], borderColor: 'rgb(249, 115, 22)', backgroundColor: 'rgba(249, 115, 22, 0.2)', fill: true }
                ]
            }
        },
        options: [ 
            { 
                name: CONSTANTS.OPTION_TYPE.PUMP_ONLY, 
                enabled: true, 
                modelConfig: { part3: null, part4: "A", part5: null, part6: null, part7: null, part11: null },
                subOptions: [], // L2 オプションはなし
                imageSrc: "image/product/2A.png",
                // L4オプション用の詳細データを定義
                l4_details: {
                    Relief: { // リリーフバルブ
                        VB: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/12MeCSg6gpCdz49odXqKKeB7Rbcm0tdq4" }
                    },
                    Rotation: { // 回転方向
                        R: { dimensionImageSrc: "https://lh3.googleusercontent.com/d/1S78oib2w72nmmZ9vT8HlYRoLnjYKtfAp" }
                    }
                },
                details: { // ★ 1A ポンプ単体の詳細
                    dimensionImageSrc: "https://lh3.googleusercontent.com/d/1WZvsqbh6VYjR4eKFlSbNAt6ukA_h9rvc", // 1A ポンプ単体 図面 (仮)
                    specTable: [
                        { model: "10A", volume: 0.8, flow1500: 1.2, flow1800: 1.4, pressure: 0.5, speed: 3000, weight: 0.5 },
                        { model: "11A", volume: 1.5, flow1500: 2.2, flow1800: 2.7, pressure: 0.5, speed: 2000, weight: 0.51 },
                        { model: "12A", volume: 2.5, flow1500: 3.7, flow1800: 4.5, pressure: 0.5, speed: 1800, weight: 0.57 },
                        { model: "13A", volume: 4.5, flow1500: 6.7, flow1800: 8.1, pressure: 0.5, speed: 1800, weight: 0.76 }
                    ],
                    flowChart: { 
                        label: "流量特性 (1450min-1)", xAxisLabel: "圧力(MPa)", yAxisLabel: "吐出量(L/min)",
                        datasets: [
                            { label: "10A", data: [{x: 0.1, y: 1.18}, {x: 0.2, y: 1.17}, {x: 0.3, y: 1.17}, {x: 0.4, y: 1.16}, {x: 0.5, y: 1.16}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                            { label: "11A", data: [{x: 0.1, y: 2.21}, {x: 0.2, y: 2.16}, {x: 0.3, y: 2.12}, {x: 0.4, y: 2.07}, {x: 0.5, y: 2.03}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                            { label: "12A", data: [{x: 0.1, y: 3.58}, {x: 0.2, y: 3.50}, {x: 0.3, y: 3.43}, {x: 0.4, y: 3.36}, {x: 0.5, y: 3.29}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false }, 
                            { label: "13A", data: [{x: 0.1, y: 6.68}, {x: 0.2, y: 6.55}, {x: 0.3, y: 6.43}, {x: 0.4, y: 6.31}, {x: 0.5, y: 6.19}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: false } 
                        ]
                    },
                    powerChart: { 
                        label: "所要電力 (1450min-1)", xAxisLabel: "圧力(MPa)", yAxisLabel: "軸電力(W)",
                        datasets: [
                            { label: "10A", data: [{x: 0.1, y: 37}, {x: 0.2, y: 41}, {x: 0.3, y: 45}, {x: 0.4, y: 49}, {x: 0.5, y: 52}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: false }, 
                            { label: "11A", data: [{x: 0.1, y: 43}, {x: 0.2, y: 48}, {x: 0.3, y: 52}, {x: 0.4, y: 57}, {x: 0.5, y: 62}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: false }, 
                            { label: "12A", data: [{x: 0.1, y: 50}, {x: 0.2, y: 59}, {x: 0.3, y: 68}, {x: 0.4, y: 77}, {x: 0.5, y: 88}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: false }, 
                            { label: "13A", data: [{x: 0.1, y: 52}, {x: 0.2, y: 75}, {x: 0.3, y: 89}, {x: 0.4, y: 103}, {x: 0.5, y: 117}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: false } 
                        ]
                    },
                },
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
        capacityPercent: "60%",
        charts: { 
            chart1: {
                label: "ご希望の性能に適した型式を選択してください",
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [
                    { label: "320F", data: [{x: 35, y: 2.5}, {x: 46.8, y: 2.5}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true },
                    { label: "330F", data: [{x: 46.8, y: 2.5}, {x: 70.2, y: 2.5}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: true },
                    { label: "340F", data: [{x: 70.2, y: 2.0}, {x: 93.6, y: 2.0}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true },
                ]
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
        capacityPercent: "80%",
        charts: {
            chart1: {
                label: "ご希望の性能に適した型式を選択してください",
                xAxisLabel: "最大吐出量(L/min)", 
                yAxisLabel: "最大吐出圧力(MPa)", 
                datasets: [
                    { label: "320H", data: [{x: 35, y: 4.0}, {x: 46.8, y: 4.0}], borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.2)', fill: true },
                    { label: "330H", data: [{x: 46.8, y: 4.0}, {x: 70.2, y: 4.0}], borderColor: 'rgb(234, 179, 8)', backgroundColor: 'rgba(234, 179, 8, 0.2)', fill: true },
                    { label: "340H", data: [{x: 70.2, y: 3.0}, {x: 93.6, y: 3.0}], borderColor: 'rgb(34, 197, 94)', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true },
                    { label: "350H", data: [{x: 93.6, y: 2.0}, {x: 117.0, y: 2.0}], borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true }
                ]
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

// --- 型式一覧データ ---
const quickSelectData = {
    "ポンプ単体": [
        { code:"FTP-10A[用途]" ,series: "1A", model: "10A", pressure: "0.5MPa", flow: "1.4L", pumpModel: "10A" },
        { code:"FTP-11A[用途]" ,series: "1A", model: "11A", pressure: "0.5MPa", flow: "2.7L", pumpModel: "11A" },
        { code:"FTP-12A[用途]" ,series: "1A", model: "12A", pressure: "0.5MPa", flow: "4.5L", pumpModel: "12A" },
        { code:"FTP-13A[用途]" ,series: "1A", model: "13A", pressure: "0.5MPa", flow: "8.1L", pumpModel: "13A" },
        { code:"FTP-1RA-100" ,series: "1RA", model: "100", pressure: "0.5MPa", flow: "2.0L", pumpModel: "100" },
        { code:"FTP-1RA-200" ,series: "1RA", model: "200", pressure: "0.5MPa", flow: "3.2L", pumpModel: "200" },
        { code:"FTP-1RA-300" ,series: "1RA", model: "300", pressure: "0.5MPa", flow: "4.5L", pumpModel: "300" },
        { code:"FTP-204A[用途]" ,series: "2A", model: "204A", pressure: "3.0MPa", flow: "7.2L", pumpModel: "204A" },
        { code:"FTP-206A[用途]" ,series: "2A", model: "206A", pressure: "2.5MPa", flow: "10.8L", pumpModel: "206A" },
        { code:"FTP-208A[用途]" ,series: "2A", model: "208A", pressure: "2.5MPa", flow: "14.4L", pumpModel: "208A" },
        { code:"FTP-210A[用途]" ,series: "2A", model: "210A", pressure: "2.5MPa", flow: "18.0L", pumpModel: "210A" },
        { code:"FTP-212A[用途]" ,series: "2A", model: "212A", pressure: "2.0MPa", flow: "21.6L", pumpModel: "212A" },
        { code:"FTP-216A[用途]" ,series: "2A", model: "216A", pressure: "1.5MPa", flow: "28.8L", pumpModel: "216A" },
        { code:"FTP-220A[用途]" ,series: "2A", model: "220A", pressure: "1.2MPa", flow: "36.0L", pumpModel: "220A" },
        { code:"FTP-320FA" ,series: "3F", model: "320F", pressure: "2.5MPa", flow: "46.8L", pumpModel: "320F" },
        { code:"FTP-320FB" ,series: "3F", model: "320F", pressure: "2.5MPa", flow: "46.8L", pumpModel: "320F" },
        { code:"FTP-330FA" ,series: "3F", model: "330F", pressure: "2.5MPa", flow: "70.2L", pumpModel: "330F" },
        { code:"FTP-330FB" ,series: "3F", model: "330F", pressure: "2.5MPa", flow: "70.2L", pumpModel: "330F" },
        { code:"FTP-340FA" ,series: "3F", model: "340F", pressure: "2.0MPa", flow: "93.6L", pumpModel: "340F" },
        { code:"FTP-340FB" ,series: "3F", model: "340F", pressure: "2.0MPa", flow: "93.6L", pumpModel: "340F" },
        { code:"FTP-320H[用途]" ,series: "3H", model: "320H", pressure: "4.0MPa", flow: "46.8L", pumpModel: "320H" },
        { code:"FTP-330H[用途]" ,series: "3H", model: "330H", pressure: "4.0MPa", flow: "70.2L", pumpModel: "330H" },
        { code:"FTP-340H[用途]" ,series: "3H", model: "340H", pressure: "3.0MPa", flow: "93.6L", pumpModel: "340H" },
        { code:"FTP-350H[用途]" ,series: "3H", model: "350H", pressure: "2.0MPa", flow: "117.0L", pumpModel: "350H" }
    ],
    "ポンプ・モータ一体型": {
        "単相モータ": [
            { code:"FTP-1ME[出力]S-10A[用途]M", output:[75, 200], series: "1A", model: "10A", pressure: "0.5MPa", flow: "1.4L", pumpModel: "10A" },
            { code:"FTP-1ME[出力]S-11A[用途]M", output:[75, 200], series: "1A", model: "11A", pressure: "0.5MPa", flow: "2.7L", pumpModel: "11A" },
            { code:"FTP-1ME[出力]S-12A[用途]M", output:[75, 200], series: "1A", model: "12A", pressure: "0.5MPa", flow: "4.5L", pumpModel: "12A" },
            { code:"FTP-1ME[出力]S-13A[用途]M", output:[75, 200], series: "1A", model: "13A", pressure: "0.5MPa", flow: "8.1L", pumpModel: "13A" },
            { code:"FTP-2ME[出力]S-204A[用途]M", output:[200, 400, 750], series: "2A", model: "204A", pressure: "3.0MPa", flow: "7.2L", pumpModel: "204A" },
            { code:"FTP-2ME[出力]S-206A[用途]M", output:[200, 400, 750], series: "2A", model: "206A", pressure: "2.5MPa", flow: "10.8L", pumpModel: "206A" },
            { code:"FTP-2ME[出力]S-208A[用途]M", output:[200, 400, 750], series: "2A", model: "208A", pressure: "2.5MPa", flow: "14.4L", pumpModel: "208A" },
            { code:"FTP-2ME[出力]S-210A[用途]M", output:[200, 400, 750], series: "2A", model: "210A", pressure: "2.5MPa", flow: "18.0L", pumpModel: "210A" },
            { code:"FTP-2ME[出力]S-212A[用途]M", output:[200, 400, 750], series: "2A", model: "212A", pressure: "2.0MPa", flow: "21.6L", pumpModel: "212A" },
            { code:"FTP-2ME[出力]S-216A[用途]M", output:[200, 400, 750], series: "2A", model: "216A", pressure: "1.5MPa", flow: "28.8L", pumpModel: "216A" },
            { code:"FTP-2ME[出力]S-220A[用途]M", output:[200, 400, 750], series: "2A", model: "220A", pressure: "1.2MPa", flow: "36.0L", pumpModel: "220A" },
        ],
        "三相モータ": [
            { code:"FTP-1E[出力]S-10A[用途]M", output:[75, 100, 200], series: "1A", model: "10A", pressure: "0.5MPa", flow: "1.4L", pumpModel: "10A" },
            { code:"FTP-1E[出力]S-11A[用途]M", output:[75, 100, 200], series: "1A", model: "11A", pressure: "0.5MPa", flow: "2.7L", pumpModel: "11A" },
            { code:"FTP-1E[出力]S-12A[用途]M", output:[75, 100, 200], series: "1A", model: "12A", pressure: "0.5MPa", flow: "4.5L", pumpModel: "12A" },
            { code:"FTP-1E[出力]S-13A[用途]M", output:[75, 100, 200], series: "1A", model: "13A", pressure: "0.5MPa", flow: "8.1L", pumpModel: "13A" },
            { code:"FTP-2E[出力]S-204A[用途]M", output:[200, 400, 700, 750, 1500], series: "2A", model: "204A", pressure: "3.0MPa", flow: "7.2L", pumpModel: "204A" },
            { code:"FTP-2E[出力]S-206A[用途]M", output:[200, 400, 700, 750, 1500], series: "2A", model: "206A", pressure: "2.5MPa", flow: "10.8L", pumpModel: "206A" },
            { code:"FTP-2E[出力]S-208A[用途]M", output:[200, 400, 700, 750, 1500], series: "2A", model: "208A", pressure: "2.5MPa", flow: "14.4L", pumpModel: "208A" },
            { code:"FTP-2E[出力]S-210A[用途]M", output:[200, 400, 700, 750, 1500], series: "2A", model: "210A", pressure: "2.5MPa", flow: "18.0L", pumpModel: "210A" },
            { code:"FTP-2E[出力]S-212A[用途]M", output:[200, 400, 700, 750, 1500], series: "2A", model: "212A", pressure: "2.0MPa", flow: "21.6L", pumpModel: "212A" },
            { code:"FTP-2E[出力]S-216A[用途]M", output:[200, 400, 700, 750, 1500], series: "2A", model: "216A", pressure: "1.5MPa", flow: "28.8L", pumpModel: "216A" },
            { code:"FTP-2E[出力]S-220A[用途]M", output:[200, 400, 700, 750, 1500], series: "2A", model: "220A", pressure: "1.2MPa", flow: "36.0L", pumpModel: "220A" },
            { code:"FTP-3FE[出力]S-320FAM", output:[1500, 2200], series: "3F", model: "320F", pressure: "2.5MPa", flow: "46.8L", pumpModel: "320F" },
            { code:"FTP-3FE[出力]S-320FBM", output:[1500, 2200], series: "3F", model: "320F", pressure: "2.5MPa", flow: "46.8L", pumpModel: "320F" },
            { code:"FTP-3FE[出力]S-330FAM", output:[1500, 2200], series: "3F", model: "330F", pressure: "2.5MPa", flow: "70.2L", pumpModel: "330F" },
            { code:"FTP-3FE[出力]S-330FBM", output:[1500, 2200], series: "3F", model: "330F", pressure: "2.5MPa", flow: "70.2L", pumpModel: "330F" },
            { code:"FTP-3FE[出力]S-340FAM", output:[1500, 2200], series: "3F", model: "340F", pressure: "2.0MPa", flow: "93.6L", pumpModel: "340F" },
            { code:"FTP-3FE[出力]S-340FBM", output:[1500, 2200], series: "3F", model: "340F", pressure: "2.0MPa", flow: "93.6L", pumpModel: "340F" },
        ],
        "各国規制対応": [
            { code:"FTP-1E[出力]-[規格]-10A[用途]M", output:[75, 100, 200], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）"], series: "1A", model: "10A", pressure: "0.5MPa", flow: "1.4L", pumpModel: "10A" },
            { code:"FTP-1E[出力]-[規格]-11A[用途]M", output:[75, 100, 200], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）"], series: "1A", model: "11A", pressure: "0.5MPa", flow: "2.7L", pumpModel: "11A" },
            { code:"FTP-1E[出力]-[規格]-12A[用途]M", output:[75, 100, 200], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）"], series: "1A", model: "12A", pressure: "0.5MPa", flow: "4.5L", pumpModel: "12A" },
            { code:"FTP-1E[出力]-[規格]-13A[用途]M", output:[75, 100, 200], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）"], series: "1A", model: "13A", pressure: "0.5MPa", flow: "8.1L", pumpModel: "13A" },
            { code:"FTP-2Y[出力]-[規格]-204A[用途]M", output:[200, 400, 700, 750, 1500], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）", "EAC：200V級（EN+IE3）", "EBC：380V級（EN+IE3）"], series: "2A", model: "204A", pressure: "3.0MPa", flow: "7.2L", pumpModel: "204A" },
            { code:"FTP-2Y[出力]-[規格]-206A[用途]M", output:[200, 400, 700, 750, 1500], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）", "EAC：200V級（EN+IE3）", "EBC：380V級（EN+IE3）"], series: "2A", model: "206A", pressure: "2.5MPa", flow: "10.8L", pumpModel: "206A" },
            { code:"FTP-2Y[出力]-[規格]-208A[用途]M", output:[200, 400, 700, 750, 1500], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）", "EAC：200V級（EN+IE3）", "EBC：380V級（EN+IE3）"], series: "2A", model: "208A", pressure: "2.5MPa", flow: "14.4L", pumpModel: "208A" },
            { code:"FTP-2Y[出力]-[規格]-210A[用途]M", output:[200, 400, 700, 750, 1500], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）", "EAC：200V級（EN+IE3）", "EBC：380V級（EN+IE3）"], series: "2A", model: "210A", pressure: "2.5MPa", flow: "18.0L", pumpModel: "210A" },
            { code:"FTP-2Y[出力]-[規格]-212A[用途]M", output:[200, 400, 700, 750, 1500], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）", "EAC：200V級（EN+IE3）", "EBC：380V級（EN+IE3）"], series: "2A", model: "212A", pressure: "2.0MPa", flow: "21.6L", pumpModel: "212A" },
            { code:"FTP-2Y[出力]-[規格]-216A[用途]M", output:[200, 400, 700, 750, 1500], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）", "EAC：200V級（EN+IE3）", "EBC：380V級（EN+IE3）"], series: "2A", model: "216A", pressure: "1.5MPa", flow: "28.8L", pumpModel: "216A" },
            { code:"FTP-2Y[出力]-[規格]-220A[用途]M", output:[200, 400, 700, 750, 1500], regulation:["A：200V級（CCC）", "B：380V級（CCC）", "CA：200V級（EN規格）", "CB：480V級（EN規格）", "EAC：200V級（EN+IE3）", "EBC：380V級（EN+IE3）"], series: "2A", model: "220A", pressure: "1.2MPa", flow: "36.0L", pumpModel: "220A" },
        ]
    },
    "ベースカップリング取付型": [
        { code:"FTP-2MBC[出力](ｵﾌﾟｼｮﾝ)-204A[用途]", output:[200, 400, 700, 750, 1500], series: "2A", model: "204A", pressure: "3.0MPa", flow: "7.2L", pumpModel: "204A" },
        { code:"FTP-2MBC[出力](ｵﾌﾟｼｮﾝ)-206A[用途]", output:[200, 400, 700, 750, 1500], series: "2A", model: "206A", pressure: "2.5MPa", flow: "10.8L", pumpModel: "206A" },
        { code:"FTP-2MBC[出力](ｵﾌﾟｼｮﾝ)-208A[用途]", output:[200, 400, 700, 750, 1500], series: "2A", model: "208A", pressure: "2.5MPa", flow: "14.4L", pumpModel: "208A" },
        { code:"FTP-2MBC[出力](ｵﾌﾟｼｮﾝ)-210A[用途]", output:[200, 400, 700, 750, 1500], series: "2A", model: "210A", pressure: "2.5MPa", flow: "18.0L", pumpModel: "210A" },
        { code:"FTP-2MBC[出力](ｵﾌﾟｼｮﾝ)-212A[用途]", output:[200, 400, 700, 750, 1500], series: "2A", model: "212A", pressure: "2.0MPa", flow: "21.6L", pumpModel: "212A" },
        { code:"FTP-2MBC[出力](ｵﾌﾟｼｮﾝ)-216A[用途]", output:[200, 400, 700, 750, 1500], series: "2A", model: "216A", pressure: "1.5MPa", flow: "28.8L", pumpModel: "216A" },
        { code:"FTP-2MBC[出力](ｵﾌﾟｼｮﾝ)-220A[用途]", output:[200, 400, 700, 750, 1500], series: "2A", model: "220A", pressure: "1.2MPa", flow: "36.0L", pumpModel: "220A" },
        { code:"FTP-3MBC[出力]kW(ｵﾌﾟｼｮﾝ)-320H[用途]", output:[0.75, 1.5, 2.2, 3.7, 5.5], series: "3H", model: "320H", pressure: "4.0MPa", flow: "46.8L", pumpModel: "320H" },
        { code:"FTP-3MBC[出力]kW(ｵﾌﾟｼｮﾝ)-330H[用途]", output:[0.75, 1.5, 2.2, 3.7, 5.5], series: "3H", model: "330H", pressure: "4.0MPa", flow: "70.2L", pumpModel: "330H" },
        { code:"FTP-3MBC[出力]kW(ｵﾌﾟｼｮﾝ)-340H[用途]", output:[0.75, 1.5, 2.2, 3.7, 5.5], series: "3H", model: "340H", pressure: "3.0MPa", flow: "93.6L", pumpModel: "340H" },
        { code:"FTP-3MBC[出力]kW(ｵﾌﾟｼｮﾝ)-350H[用途]", output:[0.75, 1.5, 2.2, 3.7, 5.5], series: "3H", model: "350H", pressure: "2.0MPa", flow: "117.0L", pumpModel: "350H" }
    ]
};

const quickSelectOptions = {
    usage: { "S": "標準", "WO": "燃料油・クーラント用" },
    axis: { "S": "標準(平割り)", "M": "M(Dカット)" },
    rotation: { "S": "標準(反時計)", "R": "R(時計)" },
    seal: { "S": "標準(-5～40℃)", "VF": "VF(120℃)" },
    relief: { "N": "なし", "VB": "VB(あり)" }
};
