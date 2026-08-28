document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // Mobile Navigation
    // -----------------------------

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("show");
        });
    }


    // -----------------------------
    // Featured Diseases
    // -----------------------------

    const featuredContainer =
        document.getElementById("featuredDiseases");

    if (featuredContainer) {

        const featuredDiseases = diseases.slice(0, 3);

        featuredContainer.innerHTML = featuredDiseases
            .map(createDiseaseCard)
            .join("");

        attachDiseaseCardEvents(featuredContainer);
    }


    // -----------------------------
    // Disease Explorer
    // -----------------------------

    const diseaseContainer =
        document.getElementById("diseaseContainer");

    const searchInput =
        document.getElementById("searchInput");

    const cropFilter =
        document.getElementById("cropFilter");

    const resultsCount =
        document.getElementById("resultsCount");

    const noResults =
        document.getElementById("noResults");


    if (diseaseContainer) {

        // Read crop from URL
        const urlParams = new URLSearchParams(window.location.search);
        const cropFromURL = urlParams.get("crop");

        if (
            cropFromURL &&
            ["Sorghum", "Wheat", "Rice"].includes(cropFromURL)
        ) {
            cropFilter.value = cropFromURL;
        }


        function renderDiseases() {

            const searchTerm =
                searchInput.value.trim().toLowerCase();

            const selectedCrop =
                cropFilter.value;


            const filteredDiseases = diseases.filter((disease) => {

                const matchesSearch =
                    disease.name.toLowerCase().includes(searchTerm) ||
                    disease.crop.toLowerCase().includes(searchTerm) ||
                    disease.type.toLowerCase().includes(searchTerm);

                const matchesCrop =
                    selectedCrop === "All" ||
                    disease.crop === selectedCrop;

                return matchesSearch && matchesCrop;
            });


            diseaseContainer.innerHTML =
                filteredDiseases
                    .map(createDiseaseCard)
                    .join("");


            resultsCount.textContent =
                `Showing ${filteredDiseases.length} ${
                    filteredDiseases.length === 1
                        ? "disease"
                        : "diseases"
                }`;


            if (filteredDiseases.length === 0) {
                noResults.classList.remove("hidden");
            } else {
                noResults.classList.add("hidden");
            }


            attachDiseaseCardEvents(diseaseContainer);
        }


        searchInput.addEventListener("input", renderDiseases);

        cropFilter.addEventListener("change", renderDiseases);

        renderDiseases();
    }


    // -----------------------------
    // Modal
    // -----------------------------

    const modal =
        document.getElementById("diseaseModal");

    const modalClose =
        document.getElementById("modalClose");

    if (modal && modalClose) {

        modalClose.addEventListener("click", closeModal);


        modal.addEventListener("click", (event) => {

            if (event.target === modal) {
                closeModal();
            }

        });


        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeModal();
            }

        });
    }


    // -----------------------------
    // Disease Card
    // -----------------------------

    function createDiseaseCard(disease) {

        return `
            <article class="disease-card">

                <div class="disease-card-top">

                    <div class="disease-icon">
                        ${disease.icon}
                    </div>

                    <span class="disease-type">
                        ${disease.type}
                    </span>

                </div>

                <div class="disease-card-body">

                    <span class="crop-label">
                        ${disease.crop}
                    </span>

                    <h3>
                        ${disease.name}
                    </h3>

                    <p>
                        ${disease.shortDescription}
                    </p>

                    <button
                        class="learn-more"
                        data-disease-id="${disease.id}"
                    >
                        Learn More →
                    </button>

                </div>

            </article>
        `;
    }


    // -----------------------------
    // Card Events
    // -----------------------------

    function attachDiseaseCardEvents(container) {

        const buttons =
            container.querySelectorAll(".learn-more");

        buttons.forEach((button) => {

            button.addEventListener("click", () => {

                const diseaseId =
                    Number(button.dataset.diseaseId);

                openDiseaseModal(diseaseId);
            });

        });
    }


    // -----------------------------
    // Open Modal
    // -----------------------------

    function openDiseaseModal(diseaseId) {

        const disease =
            diseases.find(
                (item) => item.id === diseaseId
            );

        if (!disease) {
            return;
        }


        const modalContent =
            document.getElementById("modalContent");


        modalContent.innerHTML = `

            <div class="modal-header">

                <div class="modal-disease-icon">
                    ${disease.icon}
                </div>

                <div>

                    <span class="crop-label">
                        ${disease.crop}
                    </span>

                    <h2>
                        ${disease.name}
                    </h2>

                    <span class="disease-type">
                        ${disease.type}
                    </span>

                </div>

            </div>


            <p class="modal-description">
                ${disease.shortDescription}
            </p>


            <div class="detail-section">

                <h3>🔎 Symptoms</h3>

                <ul>
                    ${disease.symptoms
                        .map(item => `<li>${item}</li>`)
                        .join("")}
                </ul>

            </div>


            <div class="detail-section">

                <h3>🌦️ Favorable Conditions</h3>

                <ul>
                    ${disease.conditions
                        .map(item => `<li>${item}</li>`)
                        .join("")}
                </ul>

            </div>


            <div class="detail-section">

                <h3>🛠️ Management</h3>

                <ul>
                    ${disease.management
                        .map(item => `<li>${item}</li>`)
                        .join("")}
                </ul>

            </div>


            <div class="detail-section">

                <h3>🛡️ Prevention</h3>

                <ul>
                    ${disease.prevention
                        .map(item => `<li>${item}</li>`)
                        .join("")}
                </ul>

            </div>


            <div class="modal-notice">

                ℹ️ This information is intended for
                educational and general awareness purposes.

            </div>
        `;


        modal.classList.remove("hidden");

        document.body.classList.add("modal-open");
    }


    // -----------------------------
    // Close Modal
    // -----------------------------

    function closeModal() {

        if (!modal) {
            return;
        }

        modal.classList.add("hidden");

        document.body.classList.remove("modal-open");
    }

});