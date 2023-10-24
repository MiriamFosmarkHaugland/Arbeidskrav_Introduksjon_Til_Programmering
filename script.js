// This code is written by Miriam.Fosmark.Haugland in english.

const output = document.getElementById("output");
const ashe_hp_bar = document.getElementById("ashe_hp_bar") // Archer
const garen_hp_bar = document.getElementById("garen_hp_bar") // Knight
const warwick_hp_bar = document.getElementById("warwick_hp_bar") // Cat
const baron_hp_bar = document.getElementById("baron_hp_bar") // Boss
const minion1_hp_bar = document.getElementById("minion1_hp_bar") // Slime / Meele minion
const minion2_hp_bar = document.getElementById("minion2_hp_bar") // Bat / Castor minion
const minion1 = document.getElementById("minion1"); // Slime / Meele minion
const minion2 = document.getElementById("minion2"); // Bat / Castor minion

// The max damage and healing both the champions and enemies does.
const damage_modifier = 25

let remove_text_timeout_id = 0
let ashe_hp = 100; // Archer
let garen_hp = 100; // Knight
let warwick_hp = 100; // Cat
let baron_hp = 100; // Boss
let minion1_hp = 100; // Slime / Meele minion
let minion2_hp = 100; // Bat / Castor minion
let ashe_arrow_number = 0;
let is_someone_fighting = false


//This function is called when a champion is clicked, because of the onClick we're able to use the event data to extract data from the clicked element.
function champion_click(event) {

    // The variable is_someone_fighting is set to true when a "round" of fighting is happening, aka when a champion is clicked, and is set to false again when the Baron has attacked back.
    if (is_someone_fighting === true) {
        return;
    }

    is_someone_fighting = true

    // I have added +1 in math.random, so the damage they deal never can be 0.
    let random_number = Math.floor(Math.random() * damage_modifier + 1);
    let chance_of_minion_spawning = Math.random();

    const champion_name = event.target.getAttribute("data-champion");
    const is_game_over = check_game_state();

    // If all heros are dead, say true and game is over. Don't run the code any furter.
    if (is_game_over === true) {
        return
    }


    champion_death();


    /* Here minion1 (meele minion = slime) and minion2 (caster minion = bat) has a 25% chance of spawning, 
        flex says that they will be displayed, they are by default hidden in the CSS-file.*/
    if (chance_of_minion_spawning < 0.25) {
        if (minion1.style.display !== "flex" && minion2.style.display !== "flex") {
            if (minion1_hp <= 0 && minion2_hp > 0) {
                minion2.style.display = "flex";
            } else if (minion1_hp > 0) {
                minion1.style.display = "flex";
            }
        }
    }

    // Archer
    // Ashe's attacks, do's and dont's are collected here in an if statements, with underlaying if statements.
    if (champion_name === "ashe") {
        if (ashe_hp <= 0) {
            output.innerHTML = `Ashe is dead <br> you can revive her!`
            clearTimeout(remove_text_timeout_id)
            is_someone_fighting = false
            return;
        }
        if (ashe_arrow_number === 0) {
            output.innerHTML = `Ashe has ${ashe_arrow_number} arrows. <br> You must click the arrow maker to recieve some!`
            clearTimeout(remove_text_timeout_id)
            is_someone_fighting = false
            return;

        } else if (minion1_hp > 0 && minion1.style.display === "flex") {
            // If the random_number is higher or equal to the meele minion's (slime) current health, Ashe (archer) will not be allowed to kill him. (This code is reused later)
            // The text will stay displayed on screen untill a new champion is clicked.
            // Baron will not attack back, because no attack against him has been casted. 
            if (random_number >= minion1_hp) {
                output.innerHTML = "Ashe can't be the one killing the meele minion <br> You must use Warwick!"
                clearTimeout(remove_text_timeout_id)
                is_someone_fighting = false
                return;
            }
            champion_attacks_minon(random_number);
            output.innerHTML = `Ashe shoots the meele minion! She deals <br> ${random_number} damage`

        } else if (minion2_hp > 0 && minion2.style.display === "flex") {
            if (random_number >= minion2_hp) {
                output.innerHTML = "Ashe can't be the one killing the caster minion <br> You must use Garen!"
                clearTimeout(remove_text_timeout_id)
                is_someone_fighting = false
                return;
            }
            champion_attacks_caster(random_number);
            output.innerHTML = `Ashe shoots the caster minion! She deals <br>${random_number} damage`

        } else {
            champion_attacks_baron(random_number);
            output.innerHTML = `Ashe shoots baron! She deals <br> ${random_number} damage`
        }

        // Says that for each click on Ashe (Archer), she has one less arrow.
        ashe_arrow_number = ashe_arrow_number - 1

        // Cat
        // Warwick's attacks, do's and dont's are collected here in an if statements, with underlaying if statements.
    } else if (champion_name === "warwick") {
        if (warwick_hp <= 0) {
            output.innerHTML = `Warwick is dead <br> you can revive him!`
            clearTimeout(remove_text_timeout_id)
            is_someone_fighting = false
            return;
        }

        if (minion1_hp > 0 && minion1.style.display === "flex") {
            champion_attacks_minon(random_number);
            output.innerHTML = `Warwick attacks the meele minion! He deals <br> ${random_number} damage`

        } else if (minion2_hp > 0 && minion2.style.display === "flex") {
            if (random_number >= minion2_hp) {
                output.innerHTML = "Warwick can't be the one killing the castor minion <br> You must use Garen!"
                clearTimeout(remove_text_timeout_id)
                is_someone_fighting = false
                return;
            }
            champion_attacks_caster(random_number);
            output.innerHTML = `Warwick attacks the caster minion! He deals <br> ${random_number} damage`

        } else {
            if (random_number >= baron_hp) {
                output.innerHTML = "Warwick can't be the one killing Baron <br> You must use Ashe!"
                clearTimeout(remove_text_timeout_id)
                is_someone_fighting = false
                return;
            }
            champion_attacks_baron(random_number);
            output.innerHTML = `Warwick attacks baron! He deals <br> ${random_number} damage`
        }

        // Knight
        // Garens's attacks, do's and dont's are collected here in an if statements, with underlaying if statements.
    } else if (champion_name === "garen") {
        if (garen_hp <= 0) {
            output.innerHTML = `Garen is dead <br> you can revive him!`
            clearTimeout(remove_text_timeout_id)
            is_someone_fighting = false
            return;
        }

        if (minion1_hp > 0 && minion1.style.display === "flex") {
            if (random_number >= minion1_hp) {
                output.innerHTML = "Garen can't be the one killing the meele minion <br> You must use Warwick!"
                clearTimeout(remove_text_timeout_id)
                is_someone_fighting = false
                return;
            }
            champion_attacks_minon(random_number);
            output.innerHTML = `Garen attacks the meele minion! He deals <br> ${random_number} damage`

        } else if (minion2_hp > 0 && minion2.style.display === "flex") {
            champion_attacks_caster(random_number);
            output.innerHTML = `Garen attacks the caster minion! He deals <br> ${random_number} damage`

        } else {
            if (random_number >= baron_hp) {
                output.innerHTML = "Garen can't be the one killing Baron <br> You must use Ashe!"
                clearTimeout(remove_text_timeout_id)
                is_someone_fighting = false
                return;
            }
            champion_attacks_baron(random_number);
            output.innerHTML = `Garen attacks baron! He deals <br> ${random_number} damage`
        }

        // Healer
    } else if (champion_name === "soraka") {
        output.innerHTML = `Soraka heals a champion for <br> ${random_number} hp`
        champion_heals_champion(random_number)

        // Lumberjack
        // I use a for-loop that loops 3 times where ashe (Archer) has a 50% chance of getting 1 arrow each loop, max she can get after 3 loops are 3 arrows.
        // If Ashe's (Archer) HP is 0, she can't recieve arrows. 
    } else if (champion_name === "jack_the_lumberjack") {
        if (ashe_hp <= 0) {
            output.innerHTML = `Ashe is dead <br> She can't recieve arrows`
            is_someone_fighting = false
            return;
        }

        let jack_made_arrows = 0
        for (let i = 0; i < 3; i++) {
            let chance_of_arrow_made = Math.random()
            if (chance_of_arrow_made >= 0.50) {
                jack_made_arrows = jack_made_arrows + 1
                ashe_arrow_number = ashe_arrow_number + 1
            }
        }
        output.innerHTML = `Ashe recieves ${jack_made_arrows} arrows from the arrow maker <br> She now has ${ashe_arrow_number}`
    }

    // Makes sure the minions (Slime & Bat) are hidden if they're HP is less or equal to 0.
    if (minion1_hp <= 0) {
        minion1.style.display = "none"
    }
    if (minion2_hp <= 0) {
        minion2.style.display = "none"
    }

    // When a hero is denied attacking, text is displayed, but without having a clearTimeout, i can no longer click anyone else, so this helps with that.
    clearTimeout(remove_text_timeout_id)

    // When a champion is clicked there will be a 1.5 sek countdown for the text that is displayed to dissapear.
    remove_text_timeout_id = setTimeout(() => {
        remove_text();
        baron_attacks_champion(champion_name);
    }, 1500);
}


// This function will set the sting to nothing, there will therefor be no text displayed.
function remove_text() {
    output.innerHTML = ""
}


function baron_attacks_champion() {

    clearTimeout(remove_text_timeout_id)

    // Here we check if gamestate is true (game is over) and if Baron's (boss) hp is 0 or less, he will not be able to do a last attack back.
    const is_game_over = check_game_state();
    if (is_game_over === true) {
        return
    }

    // Gives a random number between 1-25, that Baron (Boss) can attack with.
    // Randomises what hero Baron (Boss) shall attack.
    let random_number = Math.floor(Math.random() * damage_modifier + 1);
    let random_champion_picker = Math.floor(Math.random() * 3 + 1)

    /* If a champions hp is less or equal to 0, then the Baron (boss) can not attack them. 
        Else do the damage and change the hp and hp bar to the new current number.*/
    if (random_champion_picker === 1) {
        if (ashe_hp <= 0) {
            return;
        }
        ashe_hp = ashe_hp - random_number
        ashe_hp_bar.value = ashe_hp
        output.innerHTML = `Baron attacks back! He deals <br> ${random_number} damage`

    } else if (random_champion_picker === 2) {
        if (warwick_hp <= 0) {
            return;
        }
        warwick_hp = warwick_hp - random_number
        warwick_hp_bar.value = warwick_hp
        output.innerHTML = `Baron attacks back! He deals <br> ${random_number} damage`

    } else if (random_champion_picker === 3) {
        if (garen_hp <= 0) {
            return;
        }
        garen_hp = garen_hp - random_number
        garen_hp_bar.value = garen_hp
        output.innerHTML = `Baron attacks back! He deals <br> ${random_number} damage`
    }

    // After code is run, text is displayed for 1 sec and we check the game state again and if someone is fighting still. 
    remove_text_timeout_id = setTimeout(() => {
        remove_text();
        check_game_state();
        is_someone_fighting = false;
    }, 1000);

}


// Function will check the state of the game, if all heros or Baron (Boss) is dead, display text and prevent from clicking anything.
// Boolean true or false says if the string shall be displayed and game ends or if the game contineues and rest of the code runs.
function check_game_state() {
    if (ashe_hp <= 0 && warwick_hp <= 0 && garen_hp <= 0) {
        // If ashe, warwick and soraka are dead.
        output.innerHTML = "DEFEAT <br> Try again!"
        return true

    } else if (baron_hp <= 0) {
        output.innerHTML = "VICTORY <br> Baron is dead!"
        return true
    }

    return false
}


/* The function has a parameter which it uses to calculate the barons HP, 
the parameter is called random_number and is a variable that is stored/generated in another function.*/
function champion_attacks_baron(random_number) {
    baron_hp = baron_hp - random_number;
    baron_hp_bar.value = baron_hp;
}


function champion_attacks_minon(random_number) {
    minion1_hp = minion1_hp - random_number
    minion1_hp_bar.value = minion1_hp
}


function champion_attacks_caster(random_number) {
    minion2_hp = minion2_hp - random_number
    minion2_hp_bar.value = minion2_hp
}


// Soraka (healer) will heal all champions and we make sure their max hp won't go over 100. 
function champion_heals_champion() {
    let random_healing_number = Math.floor(Math.random() * 15 + 1);
    if (ashe_hp + random_healing_number > 100) {
        ashe_hp = 100;
    } else {
        ashe_hp = ashe_hp + random_healing_number;
    }
    ashe_hp_bar.value = ashe_hp;

    if (warwick_hp + random_healing_number > 100) {
        warwick_hp = 100
    } else {
        warwick_hp = warwick_hp + random_healing_number;
    }
    warwick_hp_bar.value = warwick_hp;

    if (garen_hp + random_healing_number > 100) {
        garen_hp = 100
    } else {
        garen_hp = garen_hp + random_healing_number;
    }
    garen_hp_bar.value = garen_hp;
}


/* This makes sure champion hp is set to 0 if it ever goes below, 
    if not when a champion is healed it might start from - 15 and go up.*/
function champion_death() {
    if (ashe_hp <= 0) {
        ashe_hp = 0;
        ashe_hp_bar.value = 0;
        output.innerHTML = `Ashe is dead <br> you can revive her!`
        is_someone_fighting = false
        return;
    } else if (warwick_hp <= 0) {
        warwick_hp = 0
        warwick_hp_bar.value = 0;
        output.innerHTML = `Warwick is dead <br> you can revive him!`
        is_someone_fighting = false
        return;
    } else if (garen_hp <= 0) {
        garen_hp = 0
        garen_hp_bar.value = 0;
        output.innerHTML = `Garen is dead <br> you can revive him!`
        is_someone_fighting = false
        return;
    }
}