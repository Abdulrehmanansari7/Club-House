 const memberBtn = document.querySelector("#memberBtn");
    const memberForm = document.querySelector("#memberForm");

    memberBtn.addEventListener("click", () => {
        memberForm.classList.toggle("hidden");

        if (!memberForm.classList.contains("hidden")) {
            memberForm.querySelector("input").focus();
        }
    });