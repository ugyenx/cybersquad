(function () {
  const POSITIONS = [
    "GK",
    "CB",
    "LB",
    "RB",
    "CM",
    "CAM",
    "CDM",
    "LW",
    "RW",
    "ST",
  ];
  const STAT_NAMES = [
    "speed",
    "dribbling",
    "passing",
    "shooting",
    "defense",
    "physical",
  ];
  const FORMATIONS = {
    "4-4-2": {
      GK: [{ top: "90%", left: "50%" }],
      DEF: [
        { top: "75%", left: "20%" },
        { top: "75%", left: "40%" },
        { top: "75%", left: "60%" },
        { top: "75%", left: "80%" },
      ],
      MID: [
        { top: "50%", left: "20%" },
        { top: "50%", left: "40%" },
        { top: "50%", left: "60%" },
        { top: "50%", left: "80%" },
      ],
      FWD: [
        { top: "25%", left: "35%" },
        { top: "25%", left: "65%" },
      ],
    },
    "4-3-3": {
      GK: [{ top: "90%", left: "50%" }],
      DEF: [
        { top: "75%", left: "20%" },
        { top: "75%", left: "40%" },
        { top: "75%", left: "60%" },
        { top: "75%", left: "80%" },
      ],
      MID: [
        { top: "55%", left: "30%" },
        { top: "50%", left: "50%" },
        { top: "55%", left: "70%" },
      ],
      FWD: [
        { top: "25%", left: "25%" },
        { top: "20%", left: "50%" },
        { top: "25%", left: "75%" },
      ],
    },
    "3-5-2": {
      GK: [{ top: "90%", left: "50%" }],
      DEF: [
        { top: "78%", left: "30%" },
        { top: "80%", left: "50%" },
        { top: "78%", left: "70%" },
      ],
      MID: [
        { top: "50%", left: "15%" },
        { top: "45%", left: "35%" },
        { top: "40%", left: "50%" },
        { top: "45%", left: "65%" },
        { top: "50%", left: "85%" },
      ],
      FWD: [
        { top: "20%", left: "35%" },
        { top: "20%", left: "65%" },
      ],
    },
    "5-3-2": {
      GK: [{ top: "90%", left: "50%" }],
      DEF: [
        { top: "75%", left: "10%" },
        { top: "78%", left: "30%" },
        { top: "80%", left: "50%" },
        { top: "78%", left: "70%" },
        { top: "75%", left: "90%" },
      ],
      MID: [
        { top: "50%", left: "30%" },
        { top: "45%", left: "50%" },
        { top: "50%", left: "70%" },
      ],
      FWD: [
        { top: "25%", left: "35%" },
        { top: "25%", left: "65%" },
      ],
    },
  };
  const POSITION_CATEGORIES = {
    GK: ["GK"],
    DEF: ["CB", "LB", "RB"],
    MID: ["CM", "CAM", "CDM", "LW", "RW"],
    FWD: ["ST", "LW", "RW"],
  };
  let players = [];
  let editingPlayerId = null;
  let teamA = { playersData: [], formation: "4-4-2", totalStat: 0 };
  let teamB = { playersData: [], formation: "4-4-2", totalStat: 0 };

  const playerForm = document.getElementById("player-form");
  const editingPlayerIdInput = document.getElementById("editing-player-id");
  const playerNameInput = document.getElementById("player-name");
  const playerPositionSelect = document.getElementById("player-position");
  const playerImageInput = document.getElementById("player-image-input");
  const playerImagePreview = document.getElementById("player-image-preview");
  const totalStatSumDisplay = document.getElementById("total-stat-sum");
  const statInputs = STAT_NAMES.map((stat) =>
    document.getElementById(`stat-${stat}`)
  );
  const clearFormBtn = document.getElementById("clear-form-btn");
  const registeredPlayersListDiv = document.getElementById(
    "registered-players-list"
  );
  const divideSelectedPlayersBtn = document.getElementById(
    "divide-selected-players-btn"
  );
  const divisionMessageArea = document.getElementById("division-message-area");
  const teamATotalStatDisplay = document.getElementById("team-a-total-stat");
  const teamBTotalStatDisplay = document.getElementById("team-b-total-stat");
  const formationSelectTeamA = document.getElementById("formation-team-a");
  const formationSelectTeamB = document.getElementById("formation-team-b");
  const pitchTeamA = document.getElementById("pitch-team-a");
  const pitchTeamB = document.getElementById("pitch-team-b");
  const navButtons = document.querySelectorAll("nav button");
  const tabContents = document.querySelectorAll(".tab-content");
  const resetStorageBtn = document.getElementById("reset-storage-btn");
  const messageModal = document.getElementById("messageModal");
  const modalMessageText = document.getElementById("modalMessageText");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalButtonsContainer = messageModal.querySelector(
    ".modal-buttons-container"
  );
  const selectAllPlayersCheckbox = document.getElementById(
    "select-all-players-checkbox"
  );
  const selectAllLabel = document.getElementById("select-all-label");

  function init() {
    console.log("CyberSquad System Initializing...");
    loadPlayers();
    populatePositionDropdown();
    populateFormationDropdowns();
    updateStatDisplaysFromInputs();
    updateTotalStatSum();
    renderRegisteredPlayersList();
    setupEventListeners();
    const lastTab =
      localStorage.getItem("activeTabCyberSquadRetro") ||
      "register-player-section";
    switchTab(lastTab);
    loadTeamData();

    const style = getComputedStyle(document.documentElement);
    document.documentElement.style.setProperty(
      "--color-neon-pink-rgb",
      hexToRgb(style.getPropertyValue("--color-neon-pink")?.trim())
    );
    document.documentElement.style.setProperty(
      "--color-vivid-purple-rgb",
      hexToRgb(style.getPropertyValue("--color-vivid-purple")?.trim())
    );
    document.documentElement.style.setProperty(
      "--color-neon-cyan-rgb",
      hexToRgb(style.getPropertyValue("--color-neon-cyan")?.trim())
    );
    document.documentElement.style.setProperty(
      "--color-gold-accent-rgb",
      hexToRgb(style.getPropertyValue("--color-gold-accent")?.trim())
    );
    document.documentElement.style.setProperty(
      "--color-hot-pink-rgb",
      hexToRgb(style.getPropertyValue("--color-hot-pink")?.trim())
    );
    document.documentElement.style.setProperty(
      "--color-dark-grey-rgb",
      hexToRgb(style.getPropertyValue("--color-dark-grey")?.trim())
    );

    console.log("System Online. Awaiting Directives.");
  }

  function hexToRgb(hex) {
    let r = 0,
      g = 0,
      b = 0;
    if (!hex) return "0,0,0"; // Fallback for undefined hex
    if (hex.length == 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length == 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r},${g},${b}`;
  }

  function calculateTotalStatSumFromInputs() {
    let sum = 0;
    statInputs.forEach((input) => (sum += parseInt(input.value)));
    return sum;
  }

  function updateStatDisplaysFromInputs() {
    statInputs.forEach((input) => {
      const valueDisplay = document.getElementById(
        `${input.dataset.stat}-value`
      );
      if (valueDisplay) valueDisplay.textContent = input.value;
    });
  }

  function updateTotalStatSum() {
    const sum = calculateTotalStatSumFromInputs();
    totalStatSumDisplay.textContent = `Total Matrix: ${sum}`;
    return sum;
  }

  function setupEventListeners() {
    playerForm.addEventListener("submit", handlePlayerFormSubmit);
    clearFormBtn.addEventListener("click", clearPlayerForm);

    statInputs.forEach((input) => {
      input.addEventListener("input", () => {
        const valueDisplay = document.getElementById(
          `${input.dataset.stat}-value`
        );
        if (valueDisplay) valueDisplay.textContent = input.value;
        updateTotalStatSum();
      });
    });

    navButtons.forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.tab));
    });

    divideSelectedPlayersBtn.addEventListener("click", handleDividePlayers);
    formationSelectTeamA.addEventListener("change", (e) =>
      handleFormationChange(e.target.dataset.team, e.target.value)
    );
    formationSelectTeamB.addEventListener("change", (e) =>
      handleFormationChange(e.target.dataset.team, e.target.value)
    );
    resetStorageBtn.addEventListener("click", confirmResetStorage);

    modalCloseBtn.addEventListener("click", () =>
      messageModal.classList.remove("active")
    );

    window.addEventListener("click", (event) => {
      if (event.target === messageModal) {
        messageModal.classList.remove("active");
      }
    });

    [pitchTeamA, pitchTeamB].forEach((pitch) => {
      pitch.addEventListener("dragover", handleDragOver);
      pitch.addEventListener("drop", handleDrop);
    });

    if (selectAllPlayersCheckbox) {
      selectAllPlayersCheckbox.addEventListener(
        "change",
        handleSelectAllPlayersChange
      );
    }
    if (playerImageInput) {
      playerImageInput.addEventListener("change", function (event) {
        if (event.target.files && event.target.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            playerImagePreview.src = e.target.result;
            playerImagePreview.style.display = "block";
          };
          reader.readAsDataURL(event.target.files[0]);
        } else {
          playerImagePreview.src = "#";
          playerImagePreview.style.display = "none";
        }
      });
    }
  }

  function handleSelectAllPlayersChange(event) {
    const isChecked = event.target.checked;
    const allPlayerCheckboxes = registeredPlayersListDiv.querySelectorAll(
      ".player-select-checkbox"
    );
    allPlayerCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
    if (selectAllLabel) {
      selectAllLabel.textContent = isChecked
        ? "DESELECT ALL AGENTS"
        : "SELECT ALL AGENTS";
    }
  }

  function switchTab(tabId) {
    tabContents.forEach((content) => content.classList.remove("active"));
    navButtons.forEach((button) => button.classList.remove("active-tab"));
    const activeContent = document.getElementById(tabId);
    const activeButton = document.querySelector(
      `nav button[data-tab="${tabId}"]`
    );
    if (activeContent) activeContent.classList.add("active");
    if (activeButton) activeButton.classList.add("active-tab");
    localStorage.setItem("activeTabCyberSquadRetro", tabId);

    if (tabId === "select-players-section") {
      renderRegisteredPlayersList();
    }
    if (tabId === "divide-teams-section") {
      if (!teamA.playersData.length && !teamB.playersData.length) {
        divisionMessageArea.textContent =
          "Access 'Assemble Squad' tab, select agents, and hit 'Initiate Division Protocol'.";
      } else {
        divisionMessageArea.textContent =
          "Tactical display active. Drag agents to reassign positions or squads.";
      }
    }
  }

  function populatePositionDropdown() {
    playerPositionSelect.innerHTML = "";
    POSITIONS.forEach((pos) => {
      const option = document.createElement("option");
      option.value = pos;
      option.textContent = pos;
      playerPositionSelect.appendChild(option);
    });
  }

  function handlePlayerFormSubmit(event) {
    event.preventDefault();
    const name = playerNameInput.value.trim();
    if (!name) {
      showMessage("Agent Name field is mandatory.");
      return;
    }

    const playerStats = {};
    let sumOfStats = 0;
    STAT_NAMES.forEach((statName) => {
      const statValue = parseInt(
        document.getElementById(`stat-${statName}`).value
      );
      playerStats[statName] = statValue;
      sumOfStats += statValue;
    });

    const totalStat = sumOfStats;
    const averageStat = Math.round(sumOfStats / STAT_NAMES.length);

    const playerData = {
      id: editingPlayerId || crypto.randomUUID(),
      name: name,
      position: playerPositionSelect.value,
      stats: playerStats,
      totalStat: totalStat,
      averageStat: averageStat,
      imageUrl: null, // Will be set by finalizePlayerSave
    };

    const imageFile = playerImageInput.files[0];

    const finalizePlayerSave = (imageUrlToSave) => {
      playerData.imageUrl = imageUrlToSave;

      if (editingPlayerId) {
        const index = players.findIndex((p) => p.id === editingPlayerId);
        if (index > -1) {
          // Preserve existing image if no new one is uploaded during edit
          if (!imageUrlToSave && players[index].imageUrl) {
            playerData.imageUrl = players[index].imageUrl;
          }
          players[index] = playerData;
        }
      } else {
        players.push(playerData);
      }
      savePlayers();
      renderRegisteredPlayersList();
      showMessage(
        `Agent ${playerData.name} ${
          editingPlayerId ? "data updated" : "registered"
        } (AVG: ${playerData.averageStat}). Standby.`
      );
      clearPlayerForm();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        finalizePlayerSave(e.target.result);
      };
      reader.onerror = function (error) {
        console.error("Error reading image file:", error);
        showMessage(
          "Error processing agent scan. Agent saved without new image."
        );
        const existingImageUrl = editingPlayerId
          ? players.find((p) => p.id === editingPlayerId)?.imageUrl || null
          : null;
        finalizePlayerSave(existingImageUrl);
      };
      reader.readAsDataURL(imageFile);
    } else {
      // If no new image file, preserve existing one during edit, or set to null for new player
      const existingImageUrl = editingPlayerId
        ? players.find((p) => p.id === editingPlayerId)?.imageUrl || null
        : null;
      finalizePlayerSave(existingImageUrl);
    }
  }

  function clearPlayerForm() {
    playerForm.reset();
    editingPlayerId = null;
    editingPlayerIdInput.value = "";
    playerImageInput.value = ""; // Clear the file input
    playerImagePreview.src = "#";
    playerImagePreview.style.display = "none";
    updateStatDisplaysFromInputs(); // Resets sliders to default values visually
    updateTotalStatSum();
    document.querySelector('#player-form button[type="submit"]').textContent =
      "Save Agent";
    playerNameInput.focus();
  }

  function loadPlayers() {
    const storedPlayers = localStorage.getItem("cyberSquadPlayersRetro");
    if (storedPlayers) players = JSON.parse(storedPlayers);
  }

  function savePlayers() {
    localStorage.setItem("cyberSquadPlayersRetro", JSON.stringify(players));
  }

  function renderRegisteredPlayersList() {
    registeredPlayersListDiv.innerHTML = "";
    if (selectAllPlayersCheckbox && selectAllLabel) {
      selectAllPlayersCheckbox.checked = false;
      selectAllLabel.textContent = "SELECT ALL AGENTS";
      selectAllPlayersCheckbox.disabled = players.length === 0;
      selectAllLabel.style.opacity = players.length === 0 ? 0.5 : 1;
    }

    if (players.length === 0) {
      registeredPlayersListDiv.innerHTML =
        "<p style=\"grid-column: 1 / -1; text-align: center; font-family: var(--font-pixel); font-size: 1.2rem;\">No agents in the system. Access 'Player Databank' to recruit.</p>";
      return;
    }
    const sortedPlayers = [...players].sort(
      (a, b) => (b.averageStat || 0) - (a.averageStat || 0)
    );

    sortedPlayers.forEach((player) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "player-card-svg-container";

      const checkboxId = `player-select-${player.id}`;
      const cardId = `player-card-svg-${player.id}`;
      const clipPathId = `clip-${player.id}`;
      const uniqueGradientId = `cardBgGradient-${player.id}`;

      // SVG Path Data for the card frame (unchanged as per request)
      const outerPathD =
        "M140,2 L250,2 Q278,2 278,30 L278,330 Q278,360 265,375 L140,398 L15,375 Q2,360 2,330 L2,30 Q2,2 30,2 Z";
      const middlePathD =
        "M140,7 L245,7 Q273,7 273,35 L273,325 Q273,355 260,370 L140,393 L20,370 Q7,355 7,325 L7,35 Q7,7 35,7 Z";
      const innerBgPathD =
        "M140,12 L240,12 Q268,12 268,40 L268,320 Q268,350 255,365 L140,388 L25,365 Q12,350 12,320 L12,40 Q12,12 40,12 Z";
      const accentTopPathD = "M100,2 L180,2 L190,20 L90,20 Z";
      const accentSideLeftPathD = "M2,80 L22,70 L22,150 L2,160 Z";
      const accentSideRightPathD = "M278,80 L258,70 L258,150 L278,160 Z";

      // Image dimensions and position within SVG
      const imgX = 28,
        imgY = 28,
        imgWidth = 224,
        imgHeight = 140;

      let imageElementHtml = `
                    <rect x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" fill="rgba(var(--color-dark-grey-rgb, 26,26,26), 0.5)" clip-path="url(#${clipPathId})"/>
                    <text x="${imgX + imgWidth / 2}" y="${
        imgY + imgHeight / 2
      }" class="svg-no-scan-text">NO SCAN</text>`;
      if (player.imageUrl) {
        imageElementHtml = `<image href="${player.imageUrl}" x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" clip-path="url(#${clipPathId})" preserveAspectRatio="xMidYMid slice" />`;
      }

      const svgMarkup = `
                    <svg id="${cardId}" class="player-card-svg" viewBox="0 0 280 400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id="${clipPathId}">
                                <rect x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" rx="10" ry="10"/>
                            </clipPath>
                            <linearGradient id="${uniqueGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:var(--color-card-bg-light); stop-opacity:1" />
                                <stop offset="100%" style="stop-color:var(--color-card-bg-dark); stop-opacity:1" />
                            </linearGradient>
                        </defs>

                        <path class="svg-card-frame-outer" d="${outerPathD}" />
                        <path class="svg-card-frame-middle" d="${middlePathD}" fill="url(#${uniqueGradientId})" />
                        <path class="svg-card-frame-inner-bg" d="${innerBgPathD}" />
                        
                        <path class="svg-card-accent-top" d="${accentTopPathD}" />
                        <path class="svg-card-accent-side" d="${accentSideLeftPathD}" />
                        <path class="svg-card-accent-side" d="${accentSideRightPathD}" />
                        
                        ${imageElementHtml}

                        <text x="55" y="50" class="svg-player-avg">${
                          // Adjusted X from 45 to 55
                          player.averageStat || "N/A"
                        }</text>
                        <text x="55" y="75" class="svg-player-pos">${
                          // Adjusted X from 45 to 55
                          player.position
                        }</text>
                        
                        <text x="140" y="${
                          imgY + imgHeight + 35
                        }" class="svg-player-name">${player.name}</text>
                        
                        ${STAT_NAMES.map(
                          (statName, index) => `
                            <text x="${index % 2 === 0 ? 45 : 165}" y="${
                            imgY + imgHeight + 70 + Math.floor(index / 2) * 22
                          }" class="svg-stat-label">${statName
                            .substring(0, 3)
                            .toUpperCase()}</text>
                            <text x="${index % 2 === 0 ? 125 : 245}" y="${
                            imgY + imgHeight + 70 + Math.floor(index / 2) * 22
                          }" class="svg-stat-value">${
                            player.stats[statName] || 0
                          }</text>
                        `
                        ).join("")}
                    </svg>
                `;

      const actionsHtml = `
                    <div class="player-card-actions-html">
                        <div> 
                            <input type="checkbox" class="player-select-checkbox" id="${checkboxId}" data-player-id="${player.id}">
                            <label for="${checkboxId}">SELECT</label>
                        </div>
                        <div class="action-buttons-group">
                            <button class="btn btn-secondary edit-player-btn" data-player-id="${player.id}">Edit File</button>
                            <button class="btn btn-secondary delete-player-btn" style="background-color: #5d1a33; border-color: #FF0055; color: #FF0055;" data-player-id="${player.id}">Terminate</button>
                        </div>
                    </div>
                `;

      cardWrapper.innerHTML = svgMarkup + actionsHtml;
      registeredPlayersListDiv.appendChild(cardWrapper);
      cardWrapper
        .querySelector(".edit-player-btn")
        .addEventListener("click", () => loadPlayerForEditing(player.id));
      cardWrapper
        .querySelector(".delete-player-btn")
        .addEventListener("click", () => confirmDeletePlayer(player.id));
    });
  }

  function loadPlayerForEditing(playerId) {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    editingPlayerId = player.id;
    editingPlayerIdInput.value = player.id;
    playerNameInput.value = player.name;
    playerPositionSelect.value = player.position;

    STAT_NAMES.forEach((statName) => {
      document.getElementById(`stat-${statName}`).value =
        player.stats[statName];
    });

    if (player.imageUrl) {
      playerImagePreview.src = player.imageUrl;
      playerImagePreview.style.display = "block";
    } else {
      playerImagePreview.src = "#";
      playerImagePreview.style.display = "none";
    }
    playerImageInput.value = ""; // Clear file input when loading for edit

    updateStatDisplaysFromInputs();
    updateTotalStatSum();
    document.querySelector('#player-form button[type="submit"]').textContent =
      "Update Agent Data";
    switchTab("register-player-section");
    playerNameInput.focus();
  }

  function confirmDeletePlayer(playerId) {
    const playerToDelete = players.find((p) => p.id === playerId);
    if (!playerToDelete) return;

    modalMessageText.textContent = `TERMINATE AGENT FILE: ${playerToDelete.name}? This action is irreversible.`;

    modalButtonsContainer.innerHTML = "";
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "CONFIRM TERMINATION";
    confirmBtn.className = "btn";
    confirmBtn.style.backgroundColor = "var(--color-hot-pink)";
    confirmBtn.style.borderColor = "var(--color-vivid-purple)";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "ABORT";
    cancelBtn.className = "btn btn-secondary";

    confirmBtn.addEventListener(
      "click",
      () => {
        deletePlayerConfirmed(playerId);
        messageModal.classList.remove("active");
      },
      { once: true }
    );

    cancelBtn.addEventListener(
      "click",
      () => {
        messageModal.classList.remove("active");
      },
      { once: true }
    );

    modalButtonsContainer.appendChild(confirmBtn);
    modalButtonsContainer.appendChild(cancelBtn);
    messageModal.classList.add("active");
  }

  function deletePlayerConfirmed(playerId) {
    players = players.filter((p) => p.id !== playerId);
    savePlayers();
    renderRegisteredPlayersList();
    // Also remove player from teams if they were part of them
    teamA.playersData = teamA.playersData.filter((p) => p.id !== playerId);
    teamB.playersData = teamB.playersData.filter((p) => p.id !== playerId);
    renderTeam(teamA, pitchTeamA, teamATotalStatDisplay, "A");
    renderTeam(teamB, pitchTeamB, teamBTotalStatDisplay, "B");
    showMessage("Agent file terminated from system.");
  }

  function handleDividePlayers() {
    const selectedCheckboxes = document.querySelectorAll(
      ".player-select-checkbox:checked"
    );
    const selectedPlayerIds = Array.from(selectedCheckboxes).map(
      (cb) => cb.dataset.playerId
    );
    if (selectedPlayerIds.length < 2) {
      showMessage("Minimum 2 agents required for squad division.");
      return;
    }
    let selectedPlayersFullData = players.filter((p) =>
      selectedPlayerIds.includes(p.id)
    );
    // Reset any previous positional data when re-dividing
    selectedPlayersFullData = selectedPlayersFullData.map((p) => ({
      ...p,
      currentTop: null,
      currentLeft: null,
      assignedSlot: null,
    }));
    selectedPlayersFullData.sort(
      (a, b) => (b.averageStat || 0) - (a.averageStat || 0)
    );

    teamA.playersData = [];
    teamB.playersData = [];
    teamA.totalStat = 0;
    teamB.totalStat = 0;

    // Separate GKs and field players
    let gks = selectedPlayersFullData.filter((p) => p.position === "GK");
    let fieldPlayers = selectedPlayersFullData.filter(
      (p) => p.position !== "GK"
    );
    gks.sort((a, b) => (b.averageStat || 0) - (a.averageStat || 0)); // Sort GKs by rating

    // Distribute GKs first if available
    if (gks.length > 0) {
      const gkForA = gks.shift();
      teamA.playersData.push(gkForA);
      teamA.totalStat += gkForA.totalStat;
    }
    if (gks.length > 0) {
      const gkForB = gks.shift();
      teamB.playersData.push(gkForB);
      teamB.totalStat += gkForB.totalStat;
    }
    // Add remaining GKs (if any) back to field players to be distributed
    fieldPlayers.push(...gks);
    fieldPlayers.sort((a, b) => (b.averageStat || 0) - (a.averageStat || 0)); // Re-sort all field players

    // Distribute field players
    fieldPlayers.forEach((player) => {
      if (teamA.totalStat <= teamB.totalStat) {
        teamA.playersData.push(player);
        teamA.totalStat += player.totalStat;
      } else {
        teamB.playersData.push(player);
        teamB.totalStat += player.totalStat;
      }
    });
    teamA.formation = formationSelectTeamA.value || "4-4-2";
    teamB.formation = formationSelectTeamB.value || "4-4-2";
    renderTeam(teamA, pitchTeamA, teamATotalStatDisplay, "A");
    renderTeam(teamB, pitchTeamB, teamBTotalStatDisplay, "B");
    divisionMessageArea.textContent =
      "Squads Assembled. Adjust tactical matrix and agent positions as required.";
    switchTab("divide-teams-section");
    saveTeamData();
  }

  function getPlayerCategory(position) {
    for (const category in POSITION_CATEGORIES) {
      if (POSITION_CATEGORIES[category].includes(position)) return category;
    }
    return "FWD"; // Default category if not found (should not happen with defined positions)
  }

  function populateFormationDropdowns() {
    formationSelectTeamA.innerHTML = "";
    formationSelectTeamB.innerHTML = "";
    Object.keys(FORMATIONS).forEach((key) => {
      const optionA = document.createElement("option");
      optionA.value = key;
      optionA.textContent = key;
      formationSelectTeamA.appendChild(optionA);
      const optionB = document.createElement("option");
      optionB.value = key;
      optionB.textContent = key;
      formationSelectTeamB.appendChild(optionB);
    });
  }

  function handleFormationChange(teamLetter, formationKey) {
    if (teamLetter === "A") {
      teamA.formation = formationKey;
      renderTeam(teamA, pitchTeamA, teamATotalStatDisplay, "A");
    } else {
      teamB.formation = formationKey;
      renderTeam(teamB, pitchTeamB, teamBTotalStatDisplay, "B");
    }
    saveTeamData();
  }

  function renderTeam(
    teamDataObj,
    pitchElement,
    totalStatDisplayElement,
    teamLetter
  ) {
    pitchElement.innerHTML = ""; // Clear previous tokens
    let currentFormationLayout = FORMATIONS[teamDataObj.formation];
    if (!currentFormationLayout) {
      console.error(
        "Matrix (Formation) not found:",
        teamDataObj.formation,
        "Defaulting to 4-4-2."
      );
      currentFormationLayout = FORMATIONS["4-4-2"]; // Fallback
    }
    let calculatedTeamPowerLevel = 0;
    const availablePlayers = [...teamDataObj.playersData]; // Create a mutable copy
    const formationSlots = []; // To hold {id, top, left} for each slot in the formation

    // Populate formationSlots from the currentFormationLayout
    Object.keys(POSITION_CATEGORIES).forEach((roleCat) => {
      if (currentFormationLayout[roleCat]) {
        currentFormationLayout[roleCat].forEach((posDetails, index) => {
          formationSlots.push({
            id: `${roleCat}_${index}`, // Unique ID for the slot
            ...posDetails,
          });
        });
      }
    });

    const assignedPlayersToFormationSlots = {};

    // Prioritize players who were manually dragged or previously assigned to a specific slot
    availablePlayers.forEach((player) => {
      if (
        player.assignedSlot &&
        player.assignedSlot !== "MANUAL_DROP" &&
        formationSlots.find((s) => s.id === player.assignedSlot) &&
        !assignedPlayersToFormationSlots[player.assignedSlot]
      ) {
        assignedPlayersToFormationSlots[player.assignedSlot] = player;
      }
    });

    // Remove already assigned players from available pool
    let tempAvailablePlayers = availablePlayers.filter(
      (p) => !Object.values(assignedPlayersToFormationSlots).includes(p)
    );

    // Assign players to their 'natural' position categories first
    formationSlots.forEach((slot) => {
      if (assignedPlayersToFormationSlots[slot.id]) return; // Slot already filled

      const slotCategory = slot.id.split("_")[0];
      let bestPlayerForSlot = null;
      let bestPlayerIndex = -1;

      for (let i = 0; i < tempAvailablePlayers.length; i++) {
        const player = tempAvailablePlayers[i];
        const playerCategory = getPlayerCategory(player.position);
        if (playerCategory === slotCategory) {
          if (
            !bestPlayerForSlot ||
            (player.averageStat || 0) > (bestPlayerForSlot.averageStat || 0)
          ) {
            bestPlayerForSlot = player;
            bestPlayerIndex = i;
          }
        }
      }
      if (bestPlayerForSlot) {
        assignedPlayersToFormationSlots[slot.id] = bestPlayerForSlot;
        tempAvailablePlayers.splice(bestPlayerIndex, 1); // Remove assigned player
      }
    });

    // Fill remaining slots with remaining players
    formationSlots.forEach((slot) => {
      if (assignedPlayersToFormationSlots[slot.id]) return; // Slot already filled
      if (tempAvailablePlayers.length > 0) {
        // Assign the best remaining player, regardless of position, to fill the slot
        tempAvailablePlayers.sort(
          (a, b) => (b.averageStat || 0) - (a.averageStat || 0)
        );
        assignedPlayersToFormationSlots[slot.id] = tempAvailablePlayers.shift();
      }
    });

    // Render tokens
    formationSlots.forEach((slot) => {
      const player = assignedPlayersToFormationSlots[slot.id];
      if (player) {
        const token = document.createElement("div");
        token.className = "player-token";
        token.textContent = player.name.substring(0, 3).toUpperCase();
        token.title = `${player.name} (${player.position} - AVG ${player.averageStat})`;

        // Use stored position if available (from drag/drop or previous load), else use formation slot
        token.style.top = player.currentTop || slot.top;
        token.style.left = player.currentLeft || slot.left;

        token.dataset.playerId = player.id;
        token.dataset.team = teamLetter;
        token.dataset.originalSlotId = slot.id; // Store the original slot for reference
        token.draggable = true;
        token.addEventListener("dragstart", handleDragStart);
        pitchElement.appendChild(token);
        calculatedTeamPowerLevel += player.totalStat;

        // Update player object with current position if not manually set
        if (!player.currentTop) player.currentTop = slot.top;
        if (!player.currentLeft) player.currentLeft = slot.left;
        player.assignedSlot = slot.id; // Mark player as assigned to this slot
      }
    });
    teamDataObj.totalStat = calculatedTeamPowerLevel;
    totalStatDisplayElement.textContent = `Power Level: ${calculatedTeamPowerLevel}`;
  }

  let draggedPlayerElement = null;
  function handleDragStart(event) {
    draggedPlayerElement = event.target;
    event.dataTransfer.setData("text/plain", event.target.dataset.playerId);
    event.dataTransfer.setData("sourceTeam", event.target.dataset.team);
    event.dataTransfer.effectAllowed = "move";
    draggedPlayerElement.classList.add("dragging");
  }
  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }
  function handleDrop(event) {
    event.preventDefault();
    if (!draggedPlayerElement) return;

    const targetPitchElement = event.target.closest(".pitch");
    if (!targetPitchElement) {
      // Dropped outside a valid pitch
      draggedPlayerElement.classList.remove("dragging");
      draggedPlayerElement = null;
      return;
    }

    const playerId = event.dataTransfer.getData("text/plain");
    const sourceTeamLetter = event.dataTransfer.getData("sourceTeam");
    const targetTeamLetter = targetPitchElement.dataset.team;

    const rect = targetPitchElement.getBoundingClientRect();
    const tokenWidth = draggedPlayerElement.offsetWidth;
    const tokenHeight = draggedPlayerElement.offsetHeight;

    // Calculate position relative to the pitch, ensuring it's within bounds
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Convert to percentage, ensuring token center is used for calculation for better feel
    let newLeftPercent = ((x - tokenWidth / 2) / rect.width) * 100;
    let newTopPercent = ((y - tokenHeight / 2) / rect.height) * 100;

    // Clamp values to ensure token stays within pitch boundaries
    newLeftPercent = Math.max(
      0,
      Math.min(100 - (tokenWidth / rect.width) * 100, newLeftPercent)
    );
    newTopPercent = Math.max(
      0,
      Math.min(100 - (tokenHeight / rect.height) * 100, newTopPercent)
    );

    const newLeft = `${newLeftPercent}%`;
    const newTop = `${newTopPercent}%`;

    const sourceTeamData = sourceTeamLetter === "A" ? teamA : teamB;
    const targetTeamData = targetTeamLetter === "A" ? teamA : teamB;
    let playerObject;

    const playerIndexInSource = sourceTeamData.playersData.findIndex(
      (p) => p.id === playerId
    );

    if (playerIndexInSource > -1) {
      playerObject = sourceTeamData.playersData[playerIndexInSource];
      playerObject.currentTop = newTop; // Store new position
      playerObject.currentLeft = newLeft;
      playerObject.assignedSlot = "MANUAL_DROP"; // Indicate it was manually placed

      if (sourceTeamLetter !== targetTeamLetter) {
        // Move player data to the new team
        sourceTeamData.playersData.splice(playerIndexInSource, 1);
        targetTeamData.playersData.push(playerObject);
      }
    } else {
      console.error("Dragged player not found in source team data.");
      draggedPlayerElement.classList.remove("dragging");
      draggedPlayerElement = null;
      return;
    }

    // Re-render both teams to reflect changes
    renderTeam(teamA, pitchTeamA, teamATotalStatDisplay, "A");
    renderTeam(teamB, pitchTeamB, teamBTotalStatDisplay, "B");

    draggedPlayerElement.classList.remove("dragging");
    draggedPlayerElement = null;
    saveTeamData(); // Save changes after drag/drop
  }

  function saveTeamData() {
    const teamsToStore = {
      teamA: {
        playersData: teamA.playersData.map((p) => ({
          // Only store essential data for persistence
          id: p.id,
          currentTop: p.currentTop,
          currentLeft: p.currentLeft,
          assignedSlot: p.assignedSlot,
        })),
        formation: teamA.formation,
      },
      teamB: {
        playersData: teamB.playersData.map((p) => ({
          id: p.id,
          currentTop: p.currentTop,
          currentLeft: p.currentLeft,
          assignedSlot: p.assignedSlot,
        })),
        formation: teamB.formation,
      },
    };
    localStorage.setItem("cyberSquadTeamsRetro", JSON.stringify(teamsToStore));
  }

  function loadTeamData() {
    const storedTeams = localStorage.getItem("cyberSquadTeamsRetro");
    if (storedTeams && players.length > 0) {
      // Ensure players are loaded first
      const loaded = JSON.parse(storedTeams);

      // Function to merge loaded player position data with full player data
      const mergePlayerData = (loadedPlayersTeamData) => {
        return loadedPlayersTeamData
          .map((tp) => {
            const fullPlayer = players.find((p) => p.id === tp.id);
            return fullPlayer ? { ...fullPlayer, ...tp } : null; // Merge, tp overrides position/slot
          })
          .filter((p) => p !== null);
      };

      teamA.playersData = mergePlayerData(loaded.teamA.playersData);
      teamA.formation = loaded.teamA.formation || "4-4-2";

      teamB.playersData = mergePlayerData(loaded.teamB.playersData);
      teamB.formation = loaded.teamB.formation || "4-4-2";

      formationSelectTeamA.value = teamA.formation;
      formationSelectTeamB.value = teamB.formation;

      if (teamA.playersData.length > 0 || teamB.playersData.length > 0) {
        renderTeam(teamA, pitchTeamA, teamATotalStatDisplay, "A");
        renderTeam(teamB, pitchTeamB, teamBTotalStatDisplay, "B");
        divisionMessageArea.textContent =
          "Previous tactical data loaded from databanks.";
      }
    } else if (storedTeams && players.length === 0) {
      console.warn(
        "Team data found, but no players loaded yet. Team data will be processed after player initialization."
      );
    }
  }

  function confirmResetStorage() {
    modalMessageText.textContent =
      "SYSTEM ALERT: Full data purge initiated. All agent files and squad configurations will be wiped. Confirm command?";

    modalButtonsContainer.innerHTML = "";
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "CONFIRM PURGE";
    confirmBtn.className = "btn";
    confirmBtn.style.backgroundColor = "var(--color-hot-pink)";
    confirmBtn.style.borderColor = "var(--color-vivid-purple)";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "ABORT PURGE";
    cancelBtn.className = "btn btn-secondary";

    confirmBtn.addEventListener(
      "click",
      () => {
        localStorage.removeItem("cyberSquadPlayersRetro");
        localStorage.removeItem("cyberSquadTeamsRetro");
        localStorage.removeItem("activeTabCyberSquadRetro");
        players = [];
        teamA = { playersData: [], formation: "4-4-2", totalStat: 0 };
        teamB = { playersData: [], formation: "4-4-2", totalStat: 0 };
        clearPlayerForm();
        renderRegisteredPlayersList();
        renderTeam(teamA, pitchTeamA, teamATotalStatDisplay, "A");
        renderTeam(teamB, pitchTeamB, teamBTotalStatDisplay, "B");
        formationSelectTeamA.value = "4-4-2"; // Reset dropdown
        formationSelectTeamB.value = "4-4-2"; // Reset dropdown
        divisionMessageArea.textContent =
          "System memory wiped. Awaiting new directives.";
        messageModal.classList.remove("active");
        showMessage("System Reset Complete. All data purged.");
        switchTab("register-player-section");
      },
      { once: true }
    );

    cancelBtn.addEventListener(
      "click",
      () => {
        messageModal.classList.remove("active");
      },
      { once: true }
    );

    modalButtonsContainer.appendChild(confirmBtn);
    modalButtonsContainer.appendChild(cancelBtn);
    messageModal.classList.add("active");
  }

  function showMessage(message) {
    modalMessageText.textContent = message;
    modalButtonsContainer.innerHTML = ""; // Clear previous buttons
    const rogerButton = document.createElement("button");
    rogerButton.id = "modalCloseBtn"; // Ensure this ID is unique or re-bind event
    rogerButton.className = "btn";
    rogerButton.textContent = "ROGER";
    rogerButton.addEventListener("click", () =>
      messageModal.classList.remove("active")
    );
    modalButtonsContainer.appendChild(rogerButton);
    messageModal.classList.add("active");
  }

  init();
})();
