/* =====================================================
   ELEMENTS
====================================================== */

const trackLeft =
    document.querySelector("#trackLeft");

const trackRight =
    document.querySelector("#trackRight");

const heroImage =
    document.querySelector("#heroImage");

const projectYear =
    document.querySelector("#projectYear");

const projectTitle =
    document.querySelector("#projectTitle");


/* =====================================================
   PROJECT DATA
====================================================== */

const projectData = [

    {
        year: "2025",
        title: "Project 01"
    },

    {
        year: "2025",
        title: "Project 02"
    },

    {
        year: "2025",
        title: "Project 03"
    },

    {
        year: "2025",
        title: "Project 04"
    },

    {
        year: "2025",
        title: "Project 05"
    },

    {
        year: "2025",
        title: "Project 06"
    },

    {
        year: "2025",
        title: "Project 07"
    },

    {
        year: "2025",
        title: "Project 08"
    },

    {
        year: "2025",
        title: "Project 09"
    },

    {
        year: "2025",
        title: "Project 10"
    },

    {
        year: "2025",
        title: "Project 11"
    },

    {
        year: "2025",
        title: "Project 12"
    },

    {
        year: "2025",
        title: "Project 13"
    },

    {
        year: "2025",
        title: "Project 14"
    }

];


/* =====================================================
   DUPLICATE PROJECTS
====================================================== */

/*
    Kita clone seluruh project.

    LEFT:
    01-07
    01-07

    RIGHT:
    08-14
    08-14

    Dengan begini tidak akan pernah ada
    ruang kosong ketika track bergerak.
*/


function duplicateTrack(track) {

    const projects =
        [...track.children];


    projects.forEach(
        project => {

            const clone =
                project.cloneNode(true);

            clone.setAttribute(
                "aria-hidden",
                "true"
            );

            track.appendChild(
                clone
            );

        }
    );

}


duplicateTrack(trackLeft);

duplicateTrack(trackRight);


/* =====================================================
   TRACK HEIGHT
====================================================== */

/*
    sequenceHeight =
    tinggi SATU rangkaian project.

    Bukan tinggi seluruh track.
*/

let leftSequenceHeight = 0;

let rightSequenceHeight = 0;


function calculateTrackHeight() {

    /*
        Karena sekarang ada dua copy,
        total height dibagi dua.
    */

    leftSequenceHeight =
        trackLeft.scrollHeight / 2;


    rightSequenceHeight =
        trackRight.scrollHeight / 2;

}


/* =====================================================
   SCROLL VARIABLES
====================================================== */

let targetScroll = 0;

let currentScroll = 0;


/*
    Scroll sensitivity.

    Naikkan kalau ingin lebih cepat.
*/

const sensitivity = 0.8;


/*
    Smoothness.

    0.08 = smooth.

    0.15 = lebih responsif.

    0.05 = lebih cinematic.
*/

const smoothness = 0.08;


/* =====================================================
   WHEEL
====================================================== */

window.addEventListener(

    "wheel",

    function(event) {

        event.preventDefault();


        targetScroll +=

            event.deltaY
            *
            sensitivity;

    },

    {
        passive: false
    }

);


/* =====================================================
   MODULO
====================================================== */

function modulo(
    value,
    length
) {

    return (

        (
            value
            %
            length
        )
        +
        length

    )
    %
    length;

}


/* =====================================================
   LEFT TRACK
====================================================== */

function updateLeftTrack() {

    /*
        LEFT:

        scroll DOWN
             ↓

        project bergerak
             ↑

        Jadi transform negatif.
    */


    const position =

        -modulo(
            currentScroll,
            leftSequenceHeight
        );


    trackLeft.style.transform =

        `translate3d(0, ${position}px, 0)`;

}


/* =====================================================
   RIGHT TRACK
====================================================== */

function updateRightTrack() {

    /*
        RIGHT:

        scroll DOWN
             ↓

        project bergerak
             ↓

        Jadi transform positif.

        Kita mulai dari -sequenceHeight
        supaya copy kedua langsung mengisi
        viewport.
    */


    const position =

        modulo(
            currentScroll,
            rightSequenceHeight
        )
        -
        rightSequenceHeight;


    trackRight.style.transform =

        `translate3d(0, ${position}px, 0)`;

}


/* =====================================================
   ACTIVE PROJECT
====================================================== */

let activeProject = -1;


/* =====================================================
   DETECT ACTIVE PROJECT
====================================================== */

function detectActiveProject() {

    /*
        Kita cari project yang berada
        paling dekat dengan bagian tengah
        viewport project area.
    */

    const windowRect =
        document
        .querySelector(".project-window")
        .getBoundingClientRect();


    const center =
        windowRect.top
        +
        windowRect.height / 2;


    let closestDistance =
        Infinity;


    let closestIndex =
        0;


    /*
        LEFT PROJECTS

        Original + clone
    */

    const leftProjects =
        trackLeft.querySelectorAll(
            ".project"
        );


    leftProjects.forEach(

        function(project) {

            const rect =
                project.getBoundingClientRect();


            const projectCenter =
                rect.top
                +
                rect.height / 2;


            const distance =
                Math.abs(
                    projectCenter
                    -
                    center
                );


            if (
                distance
                <
                closestDistance
            ) {

                closestDistance =
                    distance;


                /*
                    Ambil nomor project
                    berdasarkan posisi.
                */

                const index =
                    [...leftProjects]
                    .indexOf(project)
                    %
                    7;


                closestIndex =
                    index;

            }

        }

    );


    /*
        RIGHT PROJECTS

        Original + clone
    */

    const rightProjects =
        trackRight.querySelectorAll(
            ".project"
        );


    rightProjects.forEach(

        function(project) {

            const rect =
                project.getBoundingClientRect();


            const projectCenter =
                rect.top
                +
                rect.height / 2;


            const distance =
                Math.abs(
                    projectCenter
                    -
                    center
                );


            if (
                distance
                <
                closestDistance
            ) {

                closestDistance =
                    distance;


                const index =
                    [...rightProjects]
                    .indexOf(project)
                    %
                    7;


                closestIndex =
                    index + 7;

            }

        }

    );


    /*
        Update hero
        hanya kalau project berubah.
    */

    if (
        closestIndex
        !==
        activeProject
    ) {

        activeProject =
            closestIndex;


        changeHero(
            activeProject
        );

    }

}


/* =====================================================
   CHANGE HERO
====================================================== */

function changeHero(index) {

    const number =

        String(
            index + 1
        )
        .padStart(
            2,
            "0"
        );


    const source =

        `images/project-${number}.jpg`;


    /*
        Fade out
    */

    heroImage.style.opacity =
        "0";


    setTimeout(

        function() {

            heroImage.src =
                source;


            heroImage.onload =
                function() {

                    heroImage.style.opacity =
                        "1";

                };


            /*
                Update project info
            */

            if (
                projectData[index]
            ) {

                projectYear.textContent =
                    projectData[index].year;


                projectTitle.textContent =
                    projectData[index].title;

            }

        },

        200

    );

}


/* =====================================================
   ANIMATION
====================================================== */

function animate() {

    /*
        Smooth scrolling
    */

    currentScroll +=

        (
            targetScroll
            -
            currentScroll
        )
        *
        smoothness;


    /*
        LEFT
        ↑
    */

    updateLeftTrack();


    /*
        RIGHT
        ↓
    */

    updateRightTrack();


    /*
        Active project
    */

    detectActiveProject();


    /*
        Next frame
    */

    requestAnimationFrame(
        animate
    );

}


/* =====================================================
   INITIALIZE
====================================================== */

window.addEventListener(

    "load",

    function() {

        calculateTrackHeight();

        animate();

    }

);


/* =====================================================
   RESIZE
====================================================== */

window.addEventListener(

    "resize",

    function() {

        calculateTrackHeight();

    }

);