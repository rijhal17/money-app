/* =========================================================
   KALKULATOR PLAFON PVC PRO
   SCRIPT.JS - VERSI FIX

   FIX:
   1. Hollow 4x4 DI ATAS
   2. Hollow 2x4 DI BAWAH 4x4
   3. Arah rangka berubah saat Horizontal / Vertikal
   4. PVC terpotong mengikuti rangka
   5. 3D mouse / touch tetap aktif
========================================================= */


/* =========================================================
   VARIABEL
========================================================= */

let currentDirection = "horizontal";

let scene;
let camera;
let renderer;
let ceilingGroup;

let isDragging = false;
let previousX = 0;
let previousY = 0;

let rotationX = -0.45;
let rotationY = 0.55;


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function rupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Math.max(0, Number(number) || 0));

}


/* =========================================================
   AMBIL ANGKA
========================================================= */

function num(id) {

    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    return Number(element.value) || 0;

}


/* =========================================================
   ARAH PVC
========================================================= */

function setDirection(direction) {

    currentDirection = direction;

    document.querySelectorAll(".direction-btn").forEach(button => {

        button.classList.remove("active");

    });


    const selected =
        document.querySelector(
            `.direction-btn[data-direction="${direction}"]`
        );


    if (selected) {

        selected.classList.add("active");

    }


    const names = {

        horizontal: "Horizontal",

        vertical: "Vertikal",

        diagonal: "Diagonal"

    };


    const directionText =
        document.getElementById("directionText");


    if (directionText) {

        directionText.textContent =
            names[direction];

    }


    calculate();

}


/* =========================================================
   HITUNG BATANG
========================================================= */

function batangDibutuhkan(
    totalMeter,
    panjangBatang
) {

    if (
        totalMeter <= 0 ||
        panjangBatang <= 0
    ) {

        return 0;

    }


    return Math.ceil(
        totalMeter / panjangBatang
    );

}


/* =========================================================
   HITUNG PVC
========================================================= */

function calculatePVC(
    length,
    width,
    pvcCm
) {

    const area =
        length * width;

    const pvcWidthMeter =
        pvcCm / 100;

    const pvcLength =
        4;

    let jumlah = 0;


    /* -----------------------------------------------------
       HORIZONTAL

       PVC memanjang mengikuti PANJANG ruangan.
       Jumlah jalur mengikuti LEBAR.
    ----------------------------------------------------- */

    if (
        currentDirection ===
        "horizontal"
    ) {

        const jumlahJalur =
            Math.ceil(
                width /
                pvcWidthMeter
            );


        const sambungan =
            Math.ceil(
                length /
                pvcLength
            );


        jumlah =
            jumlahJalur *
            sambungan;

    }


    /* -----------------------------------------------------
       VERTIKAL

       PVC memanjang mengikuti LEBAR ruangan.
       Jumlah jalur mengikuti PANJANG.
    ----------------------------------------------------- */

    else if (
        currentDirection ===
        "vertical"
    ) {

        const jumlahJalur =
            Math.ceil(
                length /
                pvcWidthMeter
            );


        const sambungan =
            Math.ceil(
                width /
                pvcLength
            );


        jumlah =
            jumlahJalur *
            sambungan;

    }


    /* -----------------------------------------------------
       DIAGONAL
    ----------------------------------------------------- */

    else {

        const base =
            Math.ceil(
                area /
                (
                    pvcLength *
                    pvcWidthMeter
                )
            );


        jumlah =
            Math.ceil(
                base * 1.20
            );

    }


    return Math.max(
        1,
        jumlah
    );

}


/* =========================================================
   HITUNG RANGKA
========================================================= */

function calculateFrame(
    length,
    width
) {

    let spacing44 =
        num("spacing44") / 100;

    let spacing24 =
        num("spacing24") / 100;

    let hangerSpacing =
        num("spacingHanger") / 100;

    const hollowLength =
        num("hollowLength");


    /* PENGAMAN */

    if (spacing44 <= 0) {
        spacing44 = 0.8;
    }

    if (spacing24 <= 0) {
        spacing24 = 0.4;
    }

    if (hangerSpacing <= 0) {
        hangerSpacing = 1.2;
    }


    let mainLines = 0;
    let crossLines = 0;

    let mainLineLength = 0;
    let crossLineLength = 0;


    /* =====================================================
       HORIZONTAL
    ===================================================== */

    if (
        currentDirection ===
        "horizontal"
    ) {

        /*
            Hollow 4x4:
            Melintang LEBAR
            Posisi garis berdasarkan PANJANG
        */

        mainLines =
            Math.ceil(
                length /
                spacing44
            ) + 1;


        mainLineLength =
            width;


        /*
            Hollow 2x4:
            Mengikuti PANJANG
            Posisi berdasarkan LEBAR
        */

        crossLines =
            Math.ceil(
                width /
                spacing24
            ) + 1;


        crossLineLength =
            length;

    }


    /* =====================================================
       VERTIKAL
    ===================================================== */

    else if (
        currentDirection ===
        "vertical"
    ) {

        /*
            Hollow 4x4:
            Mengikuti PANJANG
            Posisi berdasarkan LEBAR
        */

        mainLines =
            Math.ceil(
                width /
                spacing44
            ) + 1;


        mainLineLength =
            length;


        /*
            Hollow 2x4:
            Melintang LEBAR
            Posisi berdasarkan PANJANG
        */

        crossLines =
            Math.ceil(
                length /
                spacing24
            ) + 1;


        crossLineLength =
            width;

    }


    /* =====================================================
       DIAGONAL
    ===================================================== */

    else {

        const diagonal =
            Math.sqrt(
                Math.pow(length, 2) +
                Math.pow(width, 2)
            );


        mainLines =
            Math.ceil(
                Math.max(
                    length,
                    width
                ) /
                spacing44
            ) + 1;


        crossLines =
            Math.ceil(
                Math.max(
                    length,
                    width
                ) /
                spacing24
            ) + 1;


        mainLineLength =
            diagonal;


        crossLineLength =
            diagonal;

    }


    /* =====================================================
       TOTAL METER
    ===================================================== */

    const total44 =
        mainLines *
        mainLineLength;


    const total24 =
        crossLines *
        crossLineLength;


    /* =====================================================
       JUMLAH BATANG
    ===================================================== */

    const batang44 =
        batangDibutuhkan(
            total44,
            hollowLength
        );


    const batang24 =
        batangDibutuhkan(
            total24,
            hollowLength
        );


    /* =====================================================
       GANTUNGAN

       Gantungan mengikuti Hollow 4x4
    ===================================================== */

    let hangerPerLine =
        Math.ceil(
            mainLineLength /
            hangerSpacing
        ) + 1;


    hangerPerLine =
        Math.max(
            2,
            hangerPerLine
        );


    const totalHanger =
        mainLines *
        hangerPerLine;


    return {

        mainLines,
        crossLines,

        total44,
        total24,

        batang44,
        batang24,

        totalHanger,
        hangerPerLine,

        mainLineLength,
        crossLineLength

    };

}


/* =========================================================
   HITUNG SEMUA
========================================================= */

function calculate() {

    const roomNameElement =
        document.getElementById("roomName");


    const roomName =
        roomNameElement &&
        roomNameElement.value
            ? roomNameElement.value
            : "Ruangan";


    const length =
        num("roomLength");


    const width =
        num("roomWidth");


    const pvcWidth =
        num("pvcWidth");


    if (
        length <= 0 ||
        width <= 0
    ) {

        return;

    }


    const area =
        length *
        width;


    const pvc =
        calculatePVC(
            length,
            width,
            pvcWidth
        );


    const frame =
        calculateFrame(
            length,
            width
        );


    /* =====================================================
       HARGA
    ===================================================== */

    const pricePVC =
        num("pricePVC");


    const price44 =
        num("price44");


    const price24 =
        num("price24");


    const priceHanger =
        num("priceHanger");


    /* =====================================================
       TOTAL
    ===================================================== */

    const totalPVC =
        pvc *
        pricePVC;


    const total44 =
        frame.batang44 *
        price44;


    const total24 =
        frame.batang24 *
        price24;


    const totalHanger =
        frame.totalHanger *
        priceHanger;


    const grandTotal =
        totalPVC +
        total44 +
        total24 +
        totalHanger;


    /* =====================================================
       RINGKASAN
    ===================================================== */

    const resultArea =
        document.getElementById("resultArea");


    const resultPVC =
        document.getElementById("resultPVC");


    const resultHollow =
        document.getElementById("resultHollow");


    const resultTotal =
        document.getElementById("resultTotal");


    if (resultArea) {

        resultArea.textContent =
            area.toFixed(2) +
            " m²";

    }


    if (resultPVC) {

        resultPVC.textContent =
            pvc +
            " lembar";

    }


    if (resultHollow) {

        resultHollow.textContent =
            (
                frame.batang44 +
                frame.batang24
            ) +
            " batang";

    }


    if (resultTotal) {

        resultTotal.textContent =
            rupiah(grandTotal);

    }


    /* =====================================================
       JUDUL GAMBAR
    ===================================================== */

    const drawingTitle =
        document.getElementById(
            "drawingTitle"
        );


    if (drawingTitle) {

        drawingTitle.textContent =
            `${roomName.toUpperCase()} — ${length} × ${width} meter`;

    }


    /* =====================================================
       DETAIL PVC
    ===================================================== */

    const detailPVCSpec =
        document.getElementById(
            "detailPVCSpec"
        );


    const detailPVC =
        document.getElementById(
            "detailPVC"
        );


    const detailPVCPrice =
        document.getElementById(
            "detailPVCPrice"
        );


    const detailPVCTotal =
        document.getElementById(
            "detailPVCTotal"
        );


    if (detailPVCSpec) {

        detailPVCSpec.textContent =
            pvcWidth +
            " cm";

    }


    if (detailPVC) {

        detailPVC.textContent =
            pvc +
            " lembar";

    }


    if (detailPVCPrice) {

        detailPVCPrice.textContent =
            rupiah(pricePVC);

    }


    if (detailPVCTotal) {

        detailPVCTotal.textContent =
            rupiah(totalPVC);

    }


    /* =====================================================
       DETAIL HOLLOW 4x4
    ===================================================== */

    const detail44Spec =
        document.getElementById(
            "detail44Spec"
        );


    const detail44 =
        document.getElementById(
            "detail44"
        );


    const detail44Price =
        document.getElementById(
            "detail44Price"
        );


    const detail44Total =
        document.getElementById(
            "detail44Total"
        );


    if (detail44Spec) {

        detail44Spec.textContent =
            `Jarak ${num("spacing44")} cm`;

    }


    if (detail44) {

        detail44.textContent =
            frame.batang44 +
            " batang";

    }


    if (detail44Price) {

        detail44Price.textContent =
            rupiah(price44);

    }


    if (detail44Total) {

        detail44Total.textContent =
            rupiah(total44);

    }


    /* =====================================================
       DETAIL HOLLOW 2x4
    ===================================================== */

    const detail24Spec =
        document.getElementById(
            "detail24Spec"
        );


    const detail24 =
        document.getElementById(
            "detail24"
        );


    const detail24Price =
        document.getElementById(
            "detail24Price"
        );


    const detail24Total =
        document.getElementById(
            "detail24Total"
        );


    if (detail24Spec) {

        detail24Spec.textContent =
            `Jarak ${num("spacing24")} cm`;

    }


    if (detail24) {

        detail24.textContent =
            frame.batang24 +
            " batang";

    }


    if (detail24Price) {

        detail24Price.textContent =
            rupiah(price24);

    }


    if (detail24Total) {

        detail24Total.textContent =
            rupiah(total24);

    }


    /* =====================================================
       DETAIL GANTUNGAN
    ===================================================== */

    const detailHangerSpec =
        document.getElementById(
            "detailHangerSpec"
        );


    const detailHanger =
        document.getElementById(
            "detailHanger"
        );


    const detailHangerPrice =
        document.getElementById(
            "detailHangerPrice"
        );


    const detailHangerTotal =
        document.getElementById(
            "detailHangerTotal"
        );


    if (detailHangerSpec) {

        detailHangerSpec.textContent =
            `Jarak ${num("spacingHanger")} cm`;

    }


    if (detailHanger) {

        detailHanger.textContent =
            frame.totalHanger +
            " pcs";

    }


    if (detailHangerPrice) {

        detailHangerPrice.textContent =
            rupiah(priceHanger);

    }


    if (detailHangerTotal) {

        detailHangerTotal.textContent =
            rupiah(totalHanger);

    }


    /* =====================================================
       GRAND TOTAL
    ===================================================== */

    const grandTotalElement =
        document.getElementById(
            "grandTotal"
        );


    if (grandTotalElement) {

        grandTotalElement.textContent =
            rupiah(grandTotal);

    }


    /* =====================================================
       DETAIL PERHITUNGAN
    ===================================================== */

    const directionName = {

        horizontal: "Horizontal",

        vertical: "Vertikal",

        diagonal: "Diagonal"

    }[currentDirection];


    const calculationText =
        document.getElementById(
            "calculationText"
        );


    if (calculationText) {

        calculationText.innerHTML = `

            <div class="calc-line">
                <strong>Ukuran ruangan:</strong>
                ${length} m × ${width} m =
                <strong>${area.toFixed(2)} m²</strong>
            </div>

            <div class="calc-line">
                <strong>Arah PVC:</strong>
                ${directionName}
            </div>

            <div class="calc-line">
                <strong>PVC:</strong>
                lebar ${pvcWidth} cm →
                <strong>${pvc} lembar</strong>
            </div>

            <div class="calc-line">
                <strong>Hollow 4×4:</strong>
                ${frame.mainLines} garis ×
                ${frame.mainLineLength.toFixed(2)} m =
                ${frame.total44.toFixed(2)} m →
                <strong>${frame.batang44} batang</strong>
            </div>

            <div class="calc-line">
                <strong>Hollow 2×4:</strong>
                ${frame.crossLines} garis ×
                ${frame.crossLineLength.toFixed(2)} m =
                ${frame.total24.toFixed(2)} m →
                <strong>${frame.batang24} batang</strong>
            </div>

            <div class="calc-line">
                <strong>Gantungan:</strong>
                ${frame.mainLines} garis ×
                ${frame.hangerPerLine} titik =
                <strong>${frame.totalHanger} pcs</strong>
            </div>

            <div class="calc-line">
                <strong>Total PVC:</strong>
                ${rupiah(totalPVC)}
            </div>

            <div class="calc-line">
                <strong>Total Hollow 4×4:</strong>
                ${rupiah(total44)}
            </div>

            <div class="calc-line">
                <strong>Total Hollow 2×4:</strong>
                ${rupiah(total24)}
            </div>

            <div class="calc-line">
                <strong>Total Gantungan:</strong>
                ${rupiah(totalHanger)}
            </div>

            <div class="calc-line">
                <strong>TOTAL MATERIAL:</strong>
                ${rupiah(grandTotal)}
            </div>

        `;

    }


    /* =====================================================
       UPDATE 3D
    ===================================================== */

    createCeiling3D(
        length,
        width,
        pvcWidth
    );

}


/* =========================================================
   INIT THREE.JS
========================================================= */

function init3D() {

    const container =
        document.getElementById(
            "threeContainer"
        );


    if (!container) {

        return;

    }


    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0x101b2a
        );


    camera =
        new THREE.PerspectiveCamera(
            45,
            Math.max(
                1,
                container.clientWidth
            ) /
            Math.max(
                1,
                container.clientHeight
            ),
            0.1,
            1000
        );


    camera.position.set(
        8,
        7,
        9
    );


    renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            alpha: false

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );


    renderer.shadowMap.enabled =
        true;


    container.innerHTML = "";


    container.appendChild(
        renderer.domElement
    );


    /* =====================================================
       CAHAYA
    ===================================================== */

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1.5
        );


    scene.add(
        ambient
    );


    const light =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );


    light.position.set(
        5,
        10,
        5
    );


    light.castShadow =
        true;


    scene.add(
        light
    );


    /* =====================================================
       MOUSE / TOUCH
    ===================================================== */

    renderer.domElement.addEventListener(
        "pointerdown",
        startDrag
    );


    renderer.domElement.addEventListener(
        "pointermove",
        drag
    );


    renderer.domElement.addEventListener(
        "pointerup",
        endDrag
    );


    renderer.domElement.addEventListener(
        "pointercancel",
        endDrag
    );


    renderer.domElement.addEventListener(
        "pointerleave",
        endDrag
    );


    window.addEventListener(
        "resize",
        resize3D
    );


    animate();

}


/* =========================================================
   DRAG MULAI
========================================================= */

function startDrag(event) {

    isDragging =
        true;


    previousX =
        event.clientX;


    previousY =
        event.clientY;


    if (
        renderer &&
        renderer.domElement
    ) {

        renderer.domElement.setPointerCapture?.(
            event.pointerId
        );

    }

}


/* =========================================================
   DRAG
========================================================= */

function drag(event) {

    if (!isDragging) {

        return;

    }


    const dx =
        event.clientX -
        previousX;


    const dy =
        event.clientY -
        previousY;


    rotationY +=
        dx * 0.008;


    rotationX +=
        dy * 0.008;


    rotationX =
        Math.max(
            -1.2,
            Math.min(
                0.8,
                rotationX
            )
        );


    previousX =
        event.clientX;


    previousY =
        event.clientY;


    if (ceilingGroup) {

        ceilingGroup.rotation.y =
            rotationY;


        ceilingGroup.rotation.x =
            rotationX;

    }

}


/* =========================================================
   DRAG SELESAI
========================================================= */

function endDrag() {

    isDragging =
        false;

}


/* =========================================================
   RESIZE
========================================================= */

function resize3D() {

    const container =
        document.getElementById(
            "threeContainer"
        );


    if (
        !container ||
        !camera ||
        !renderer
    ) {

        return;

    }


    const width =
        Math.max(
            1,
            container.clientWidth
        );


    const height =
        Math.max(
            1,
            container.clientHeight
        );


    camera.aspect =
        width /
        height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );

}


/* =========================================================
   ANIMASI
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    if (
        ceilingGroup &&
        !isDragging
    ) {

        ceilingGroup.rotation.y +=
            0.0015;


        rotationY =
            ceilingGroup.rotation.y;

    }


    if (
        renderer &&
        scene &&
        camera
    ) {

        renderer.render(
            scene,
            camera
        );

    }

}


/* =========================================================
   MATERIAL HOLLOW
========================================================= */

function createHollowMaterial(
    color
) {

    return new THREE.MeshStandardMaterial({

        color: color,

        metalness: 0.7,

        roughness: 0.28

    });

}


/* =========================================================
   BUAT BEAM
========================================================= */

function createBeam(
    start,
    end,
    thickness,
    material
) {

    const direction =
        new THREE.Vector3()
            .subVectors(
                end,
                start
            );


    const length =
        direction.length();


    if (length <= 0) {

        return null;

    }


    const geometry =
        new THREE.BoxGeometry(
            thickness,
            thickness,
            length
        );


    const beam =
        new THREE.Mesh(
            geometry,
            material
        );


    const midpoint =
        new THREE.Vector3()
            .addVectors(
                start,
                end
            )
            .multiplyScalar(
                0.5
            );


    beam.position.copy(
        midpoint
    );


    beam.lookAt(
        end
    );


    beam.castShadow =
        true;


    beam.receiveShadow =
        true;


    return beam;

}


/* =========================================================
   BUAT PVC
========================================================= */

function createPVCPanel(
    width,
    depth,
    color
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            0.055,
            depth
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: color,

            metalness: 0.15,

            roughness: 0.42

        });


    const panel =
        new THREE.Mesh(
            geometry,
            material
        );


    panel.castShadow =
        true;


    panel.receiveShadow =
        true;


    return panel;

}


/* =========================================================
   GANTUNGAN
========================================================= */

function createHanger(
    x,
    y,
    z
) {

    const geometry =
        new THREE.CylinderGeometry(
            0.045,
            0.045,
            0.65,
            8
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: 0xd62525,

            metalness: 0.65,

            roughness: 0.3

        });


    const hanger =
        new THREE.Mesh(
            geometry,
            material
        );


    hanger.position.set(
        x,
        y,
        z
    );


    hanger.castShadow =
        true;


    return hanger;

}


/* =========================================================
   TAMBAHKAN PVC HORIZONTAL
   PVC MEMANJANG ARAH PANJANG

   PVC DIPECAH SESUAI JARAK RANGKA 2x4
========================================================= */

function createHorizontalPVC(
    group,
    L,
    W,
    roomLength,
    roomWidth,
    pvcWidth
) {

    const pvcMeter =
        pvcWidth / 100;


    const panelCount =
        Math.max(
            1,
            Math.ceil(
                roomWidth /
                pvcMeter
            )
        );


    const actualPanelWidth =
        W /
        panelCount;


    const crossSpacing =
        num("spacing24") /
        100;


    const crossCount =
        Math.ceil(
            roomWidth /
            crossSpacing
        ) + 1;


    /*
        Garis pemotongan PVC mengikuti
        rangka 2x4.

        Posisi dibuat berdasarkan
        arah Z karena PVC horizontal.
    */

    const cuts = [];


    for (
        let i = 0;
        i < crossCount;
        i++
    ) {

        const z =
            -W / 2 +
            (
                W /
                (crossCount - 1)
            ) * i;


        cuts.push(z);

    }


    /*
        Buat setiap jalur PVC.
    */

    for (
        let p = 0;
        p < panelCount;
        p++
    ) {

        const x =
            -W / 2 +
            actualPanelWidth / 2 +
            p *
            actualPanelWidth;


        /*
            Setiap jalur dipotong
            di antara rangka 2x4.
        */

        for (
            let i = 0;
            i < cuts.length - 1;
            i++
        ) {

            const startZ =
                cuts[i] +
                0.035;


            const endZ =
                cuts[i + 1] -
                0.035;


            const segmentDepth =
                endZ -
                startZ;


            if (
                segmentDepth <= 0
            ) {

                continue;

            }


            const panel =
                createPVCPanel(

                    actualPanelWidth -
                    0.012,

                    segmentDepth,

                    0xdcefff

                );


            panel.position.set(

                x,

                0,

                (
                    startZ +
                    endZ
                ) / 2

            );


            group.add(
                panel
            );

        }

    }

}


/* =========================================================
   TAMBAHKAN PVC VERTIKAL

   PVC MEMANJANG ARAH LEBAR
   JUGA DIPOTONG MENGIKUTI RANGKA 2x4
========================================================= */

function createVerticalPVC(
    group,
    L,
    W,
    roomLength,
    roomWidth,
    pvcWidth
) {

    const pvcMeter =
        pvcWidth / 100;


    const panelCount =
        Math.max(
            1,
            Math.ceil(
                roomLength /
                pvcMeter
            )
        );


    const actualPanelWidth =
        L /
        panelCount;


    const crossSpacing =
        num("spacing24") /
        100;


    const crossCount =
        Math.ceil(
            roomLength /
            crossSpacing
        ) + 1;


    const cuts = [];


    for (
        let i = 0;
        i < crossCount;
        i++
    ) {

        const x =
            -L / 2 +
            (
                L /
                (crossCount - 1)
            ) * i;


        cuts.push(x);

    }


    for (
        let p = 0;
        p < panelCount;
        p++
    ) {

        const z =
            -L / 2 +
            actualPanelWidth / 2 +
            p *
            actualPanelWidth;


        for (
            let i = 0;
            i < cuts.length - 1;
            i++
        ) {

            const startX =
                cuts[i] +
                0.035;


            const endX =
                cuts[i + 1] -
                0.035;


            const segmentWidth =
                endX -
                startX;


            if (
                segmentWidth <= 0
            ) {

                continue;

            }


            const panel =
                createPVCPanel(

                    segmentWidth,

                    actualPanelWidth -
                    0.012,

                    0xdcefff

                );


            panel.position.set(

                (
                    startX +
                    endX
                ) / 2,

                0,

                z

            );


            group.add(
                panel
            );

        }

    }

}


/* =========================================================
   PVC DIAGONAL
========================================================= */

function createDiagonalPVC(
    group,
    L,
    W,
    pvcWidth
) {

    const diagonal =
        Math.sqrt(
            L * L +
            W * W
        );


    const stripWidth =
        Math.max(
            0.18,
            (
                pvcWidth /
                100
            )
        );


    const count =
        Math.ceil(
            (
                L +
                W
            ) /
            stripWidth
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const panel =
            createPVCPanel(

                stripWidth -
                0.01,

                diagonal,

                0xdcefff

            );


        panel.rotation.y =
            Math.PI / 4;


        const offset =
            -(
                L +
                W
            ) / 2 +
            i *
            stripWidth;


        panel.position.set(

            offset,

            0,

            0

        );


        group.add(
            panel
        );

    }

}


/* =========================================================
   BUAT RANGKA 3D
========================================================= */

function createCeiling3D(
    roomLength,
    roomWidth,
    pvcWidth
) {

    if (!scene) {

        return;

    }


    /* =====================================================
       HAPUS GAMBAR LAMA
    ===================================================== */

    if (ceilingGroup) {

        scene.remove(
            ceilingGroup
        );


        ceilingGroup.traverse(
            object => {

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material => {

                                material.dispose();

                            }
                        );

                    }
                    else {

                        object.material.dispose();

                    }

                }

            }
        );

    }


    ceilingGroup =
        new THREE.Group();


    /* =====================================================
       SKALA
    ===================================================== */

    const maxSize =
        8;


    const scale =
        maxSize /
        Math.max(
            roomLength,
            roomWidth
        );


    const L =
        roomLength *
        scale;


    const W =
        roomWidth *
        scale;


    /* =====================================================
       JARAK
    ===================================================== */

    const spacing44 =
        Math.max(
            0.35,
            num("spacing44") /
            100 *
            scale
        );


    const spacing24 =
        Math.max(
            0.25,
            num("spacing24") /
            100 *
            scale
        );


    const hangerSpacing =
        Math.max(
            0.5,
            num("spacingHanger") /
            100 *
            scale
        );


    /* =====================================================
       MATERIAL
    ===================================================== */

    const mainMaterial =
        createHollowMaterial(
            0x174cdd
        );


    const crossMaterial =
        createHollowMaterial(
            0x777777
        );


    const borderMaterial =
        createHollowMaterial(
            0x263238
        );


    /* =====================================================
       PVC
    ===================================================== */

    if (
        currentDirection ===
        "horizontal"
    ) {

        createHorizontalPVC(

            ceilingGroup,

            L,
            W,

            roomLength,
            roomWidth,

            pvcWidth * scale

        );

    }


    else if (
        currentDirection ===
        "vertical"
    ) {

        createVerticalPVC(

            ceilingGroup,

            L,
            W,

            roomLength,
            roomWidth,

            pvcWidth * scale

        );

    }


    else {

        createDiagonalPVC(

            ceilingGroup,

            L,
            W,

            pvcWidth * scale

        );

    }


    /* =====================================================
       HOLLOW 4x4 UTAMA

       PENTING:
       Y = 0.24

       Artinya 4x4 berada DI ATAS 2x4.
    ===================================================== */

    let mainCount =
        0;


    if (
        currentDirection ===
        "horizontal"
    ) {

        mainCount =
            Math.ceil(
                roomLength /
                (
                    num("spacing44") /
                    100
                )
            ) + 1;


        mainCount =
            Math.max(
                2,
                mainCount
            );


        for (
            let i = 0;
            i < mainCount;
            i++
        ) {

            const x =
                -L / 2 +
                (
                    L /
                    (
                        mainCount -
                        1
                    )
                ) *
                i;


            const beam =
                createBeam(

                    new THREE.Vector3(
                        x,
                        0.24,
                        -W / 2
                    ),

                    new THREE.Vector3(
                        x,
                        0.24,
                        W / 2
                    ),

                    0.10,

                    mainMaterial

                );


            if (beam) {

                ceilingGroup.add(
                    beam
                );

            }

        }

    }


    else if (
        currentDirection ===
        "vertical"
    ) {

        mainCount =
            Math.ceil(
                roomWidth /
                (
                    num("spacing44") /
                    100
                )
            ) + 1;


        mainCount =
            Math.max(
                2,
                mainCount
            );


        for (
            let i = 0;
            i < mainCount;
            i++
        ) {

            const z =
                -W / 2 +
                (
                    W /
                    (
                        mainCount -
                        1
                    )
                ) *
                i;


            const beam =
                createBeam(

                    new THREE.Vector3(
                        -L / 2,
                        0.24,
                        z
                    ),

                    new THREE.Vector3(
                        L / 2,
                        0.24,
                        z
                    ),

                    0.10,

                    mainMaterial

                );


            if (beam) {

                ceilingGroup.add(
                    beam
                );

            }

        }

    }


    else {

        mainCount =
            Math.max(
                5,
                Math.ceil(
                    Math.max(
                        roomLength,
                        roomWidth
                    ) /
                    (
                        num("spacing44") /
                        100
                    )
                )
            );


        for (
            let i = 0;
            i < mainCount;
            i++
        ) {

            const offset =
                -W / 2 +
                (
                    W /
                    (
                        mainCount -
                        1
                    )
                ) *
                i;


            const beam =
                createBeam(

                    new THREE.Vector3(
                        -L / 2,
                        0.24,
                        offset
                    ),

                    new THREE.Vector3(
                        L / 2,
                        0.24,
                        offset + W
                    ),

                    0.10,

                    mainMaterial

                );


            if (beam) {

                ceilingGroup.add(
                    beam
                );

            }

        }

    }


    /* =====================================================
       HOLLOW 2x4

       PENTING:
       Y = 0.12

       Jadi 2x4 berada DI BAWAH 4x4.
    ===================================================== */

    let crossCount =
        0;


    if (
        currentDirection ===
        "horizontal"
    ) {

        crossCount =
            Math.ceil(
                roomWidth /
                (
                    num("spacing24") /
                    100
                )
            ) + 1;


        crossCount =
            Math.max(
                2,
                crossCount
            );


        for (
            let i = 0;
            i < crossCount;
            i++
        ) {

            const z =
                -W / 2 +
                (
                    W /
                    (
                        crossCount -
                        1
                    )
                ) *
                i;


            const beam =
                createBeam(

                    new THREE.Vector3(
                        -L / 2,
                        0.12,
                        z
                    ),

                    new THREE.Vector3(
                        L / 2,
                        0.12,
                        z
                    ),

                    0.065,

                    crossMaterial

                );


            if (beam) {

                ceilingGroup.add(
                    beam
                );

            }

        }

    }


    else if (
        currentDirection ===
        "vertical"
    ) {

        crossCount =
            Math.ceil(
                roomLength /
                (
                    num("spacing24") /
                    100
                )
            ) + 1;


        crossCount =
            Math.max(
                2,
                crossCount
            );


        for (
            let i = 0;
            i < crossCount;
            i++
        ) {

            const x =
                -L / 2 +
                (
                    L /
                    (
                        crossCount -
                        1
                    )
                ) *
                i;


            const beam =
                createBeam(

                    new THREE.Vector3(
                        x,
                        0.12,
                        -W / 2
                    ),

                    new THREE.Vector3(
                        x,
                        0.12,
                        W / 2
                    ),

                    0.065,

                    crossMaterial

                );


            if (beam) {

                ceilingGroup.add(
                    beam
                );

            }

        }

    }


    else {

        crossCount =
            Math.max(
                6,
                Math.ceil(
                    Math.max(
                        roomLength,
                        roomWidth
                    ) /
                    (
                        num("spacing24") /
                        100
                    )
                )
            );


        for (
            let i = 0;
            i < crossCount;
            i++
        ) {

            const offset =
                -L / 2 +
                (
                    L /
                    (
                        crossCount -
                        1
                    )
                ) *
                i;


            const beam =
                createBeam(

                    new THREE.Vector3(
                        offset,
                        0.12,
                        -W / 2
                    ),

                    new THREE.Vector3(
                        offset - W,
                        0.12,
                        W / 2
                    ),

                    0.065,

                    crossMaterial

                );


            if (beam) {

                ceilingGroup.add(
                    beam
                );

            }

        }

    }


    /* =====================================================
       GANTUNGAN

       Gantungan terhubung ke HOLLOW 4x4
    ===================================================== */

    if (
        currentDirection !==
        "diagonal"
    ) {

        for (
            let i = 0;
            i < mainCount;
            i++
        ) {

            if (
                currentDirection ===
                "horizontal"
            ) {

                const x =
                    -L / 2 +
                    (
                        L /
                        (
                            mainCount -
                            1
                        )
                    ) *
                    i;


                const hangerCount =
                    Math.max(

                        2,

                        Math.ceil(
                            roomWidth /
                            (
                                num(
                                    "spacingHanger"
                                ) /
                                100
                            )
                        ) + 1

                    );


                for (
                    let j = 0;
                    j < hangerCount;
                    j++
                ) {

                    const z =
                        -W / 2 +
                        (
                            W /
                            (
                                hangerCount -
                                1
                            )
                        ) *
                        j;


                    const hanger =
                        createHanger(

                            x,

                            0.55,

                            z

                        );


                    ceilingGroup.add(
                        hanger
                    );

                }

            }


            else {

                const z =
                    -W / 2 +
                    (
                        W /
                        (
                            mainCount -
                            1
                        )
                    ) *
                    i;


                const hangerCount =
                    Math.max(

                        2,

                        Math.ceil(
                            roomLength /
                            (
                                num(
                                    "spacingHanger"
                                ) /
                                100
                            )
                        ) + 1

                    );


                for (
                    let j = 0;
                    j < hangerCount;
                    j++
                ) {

                    const x =
                        -L / 2 +
                        (
                            L /
                            (
                                hangerCount -
                                1
                            )
                        ) *
                        j;


                    const hanger =
                        createHanger(

                            x,

                            0.55,

                            z

                        );


                    ceilingGroup.add(
                        hanger
                    );

                }

            }

        }

    }


    /* =====================================================
       BORDER

       Border ditempatkan di bawah rangka
    ===================================================== */

    const borderThickness =
        0.11;


    const borderY =
        0.13;


    const border1 =
        createBeam(

            new THREE.Vector3(
                -L / 2,
                borderY,
                -W / 2
            ),

            new THREE.Vector3(
                L / 2,
                borderY,
                -W / 2
            ),

            borderThickness,

            borderMaterial

        );


    const border2 =
        createBeam(

            new THREE.Vector3(
                -L / 2,
                borderY,
                W / 2
            ),

            new THREE.Vector3(
                L / 2,
                borderY,
                W / 2
            ),

            borderThickness,

            borderMaterial

        );


    const border3 =
        createBeam(

            new THREE.Vector3(
                -L / 2,
                borderY,
                -W / 2
            ),

            new THREE.Vector3(
                -L / 2,
                borderY,
                W / 2
            ),

            borderThickness,

            borderMaterial

        );


    const border4 =
        createBeam(

            new THREE.Vector3(
                L / 2,
                borderY,
                -W / 2
            ),

            new THREE.Vector3(
                L / 2,
                borderY,
                W / 2
            ),

            borderThickness,

            borderMaterial

        );


    [
        border1,
        border2,
        border3,
        border4

    ].forEach(
        border => {

            if (border) {

                ceilingGroup.add(
                    border
                );

            }

        }
    );


    /* =====================================================
       POSISI DAN ROTASI
    ===================================================== */

    ceilingGroup.rotation.x =
        rotationX;


    ceilingGroup.rotation.y =
        rotationY;


    ceilingGroup.position.y =
        0;


    scene.add(
        ceilingGroup
    );


    /* =====================================================
       KAMERA
    ===================================================== */

    camera.position.set(
        7.8,
        6.8,
        8.5
    );


    camera.lookAt(
        0,
        0,
        0
    );

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        init3D();

        calculate();


        /* =================================================
           AUTO HITUNG
        ================================================= */

        document
            .querySelectorAll(
                "input, select"
            )
            .forEach(
                element => {

                    element.addEventListener(
                        "input",
                        calculate
                    );


                    element.addEventListener(
                        "change",
                        calculate
                    );

                }
            );

    }
);