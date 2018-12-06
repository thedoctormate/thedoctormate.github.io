      var playerCount = 0;
	  
	  //gets the number of players, making sure it is in 1-5, and an integer
	  var playerFirstCheck = 0;
	  var intCheck = false;
	  
	  do{
	    if (playerFirstCheck == 0){
		  playerCount = prompt("How many players are there?");
		  playerFirstCheck = 1;
		}
		else{
		  playerCount = prompt("Please enter an integer between 1 and 5.");
		}
		intCheck = (playerCount % 1 === 0);
	  }
	  while (playerCount < 1 || playerCount > 5 || isNaN(playerCount) || intCheck == false);
	  
	  //prints the introduction, showing that playerCount was read correctly
	  if (playerCount == 1){
	    document.write("Here are your random setup instructions, for " + playerCount + " player.<br>");
	  }
	  else{
	    document.write("Here are your random setup instructions, for " + playerCount + " players.<br>");
	  }
	  
	  //initialiser vars
	  var shards = 0;
	  var bystandersCheck = 0;
	  var masterStrikes = 5;
	  
	  //number of players table
	  var villainGroupsNo;
	  var henchmenGroupsNo;
	  var villainBystanders;
	  var heroDecksNo;
	  
	  if (playerCount == 1){
	    villainGroupsNo = 1;
		henchmenGroupsNo = 1;
		villainBystanders = 1;
		heroDecksNo = 3;
	  }
	  else if (playerCount == 2){
	    villainGroupsNo = 2;
		henchmenGroupsNo = 1;
		villainBystanders = 2;
		heroDecksNo = 5;
	  }
	  else if (playerCount == 3){
	    villainGroupsNo = 3;
		henchmenGroupsNo = 1;
		villainBystanders = 8;
		heroDecksNo = 5;
	  }
	  else if (playerCount == 4){
	    villainGroupsNo = 3;
		henchmenGroupsNo = 2;
		villainBystanders = 8;
		heroDecksNo = 5;
	  }
	  else if (playerCount == 5){
	    villainGroupsNo = 4;
		henchmenGroupsNo = 2;
		villainBystanders = 12;
		heroDecksNo = 6;
	  }
	  
	  //selects the starting team
	  var startingTeam = getStartingTeam();
	  
	  //selects the mastermind
	  var mastermind = getMastermind();
	  shards = shards + mastermind.MMshards;
	  
	  //selects the scheme
	  var scheme = getScheme(playerCount);
	  shards = shards + scheme.Sshards;
	  bystandersCheck = bystandersCheck + scheme.bystandersScheme;
	  henchmenGroupsNo = henchmenGroupsNo + scheme.needsHenchemenGroups;
	  heroDecksNo = heroDecksNo + scheme.needsHeroDecks;
	  
	  //selects the villain groups
      var villainGroups = new Array(villainGroupsNo);
	  var villainGCount = villainGroupsNo;
	  var vilCountUp = 0;
	  var newVillain;
	  
	  //do loop for getting random villains, alwaysLeads, scheme villains, making sure there are no duplicates
	  doLoopVillains:
      do{
	    //first villain should be any scheme villain
		if (vilCountUp == 0){
		  if (scheme.schemeVillainType == "v"){
		    villainGroups[vilCountUp] = scheme.schemeVillainGroup;
			scheme.schemeVillainType = "0";
		    villainGCount = villainGCount - 1;
		  }
		  //if not, should be alwaysLeads
		  else if (mastermind.alwaysLeadsType == "v"){
		    villainGroups[vilCountUp] = mastermind.alwaysLeads;
			mastermind.alwaysLeadsType = "0";
			villainGCount = villainGCount - 1;
		  }
		  //if not, random
		  else{
		    newVillain = getVillainGroup();
			villainGroups[vilCountUp] = newVillain.villainName;
			shards = shards + newVillain.Vshards;
			villainGCount = villainGCount - 1;
		  }
		}
		//second villain should be alwaysLeads if not already used
		else if (vilCountUp == 1){
		  if (mastermind.alwaysLeadsType == "v"){
		    //check for duplicate
			if (mastermind.alwaysLeads == villainGroups[0]){
			  mastermind.alwaysLeads = "0";
			  continue doLoopVillains;
			}
			else{
			  villainGroups[vilCountUp] = mastermind.alwaysLeads;
			  mastermind.alwaysLeads = "0";
			  villainGCount = villainGCount - 1;
			}
		  }
		  //random group
		  else{
		    newVillain = getVillainGroup();
			//check for duplicate
			if (newVillain.villainName == villainGroups[0]){
			  continue doLoopVillains;
			}
		    villainGroups[vilCountUp] = newVillain.villainName;
			shards = shards + newVillain.Vshards;
			villainGCount = villainGCount - 1;
		  }
		}
		//final villain assigner, which will be run until all VGs are selected
		else{
		  newVillain = getVillainGroup();
		  //check for duplicate
		  for (var i = 0; i < vilCountUp; i++){
		    if (newVillain.villainName == villainGroups[i]){
			  continue doLoopVillains;
			}
		  }
		  villainGroups[vilCountUp] = newVillain.villainName;
		  shards = shards + newVillain.Vshards;
		  villainGCount = villainGCount - 1;
		}
		
		//move to next position in array
        vilCountUp = vilCountUp + 1;
	  }
      while (villainGCount > 0);
      
	  //alphabetize villain groups, ignoring any 'The' at the start of the names
      villainGroups.sort(function (a, b){
        function getRaw(s){
          return s.replace(/The /, "").trim();
        }
        return getRaw(a).localeCompare(getRaw(b));
      });		
	  
	  //selects the henchmen groups
	  var henchmenGroups = new Array(henchmenGroupsNo);
	  var henchmenGCount = henchmenGroupsNo;
	  var henchCountUp = 0;
	  var newHenchmen;
	  
	  //do loop for getting random henchmen, alwaysLeads, scheme henchmen, making sure there are no duplicates
	  doLoopHenchmen:
      do{
	    //first henchmen should be any scheme henchmen
		if (henchCountUp == 0){
		  if (scheme.schemeVillainType == "h"){
		    henchmenGroups[henchCountUp] = scheme.schemeVillainGroup;
			scheme.schemeVillainType = "0";
		    henchmenGCount = henchmenGCount - 1;
		  }
		  //if not, should be alwaysLeads
		  else if (mastermind.alwaysLeadsType == "h"){
		    henchmenGroups[henchCountUp] = mastermind.alwaysLeads;
			mastermind.alwaysLeadsType = "0";
			henchmenGCount = henchmenGCount - 1;
		  }
		  //if not, random
		  else{
		    newHenchmen = getHenchmenGroup();
			henchmenGroups[henchCountUp] = newHenchmen.henchmenName;
			henchmenGCount = henchmenGCount - 1;
		  }
		}
		//second henchmen should be alwaysLeads if not already used
		else if (henchCountUp == 1){
		  if (mastermind.alwaysLeadsType == "h"){
		    //check for duplicate
			if (mastermind.alwaysLeads == henchmenGroups[0]){
			  mastermind.alwaysLeads = "0";
			  continue doLoopHenchmen;
			}
			else{
			  henchmenGroups[henchCountUp] = mastermind.alwaysLeads;
			  mastermind.alwaysLeads = "0";
			  henchmenGCount = henchmenGCount - 1;
			}
		  }
		  //random group
		  else{
		    newHenchmen = getHenchmenGroup();
			//check for duplicate
			if (newHenchmen.henchmenName == henchmenGroups[0]){
			  continue doLoopHenchmen;
			}
		    henchmenGroups[henchCountUp] = newHenchmen.henchmenName;
			henchmenGCount = henchmenGCount - 1;
		  }
		}
		//final henchmen assigner, which will be run until all HGs are selected
		else{
		  newHenchmen = getHenchmenGroup();
		  //check for duplicate
		  for (var i = 0; i < henchCountUp; i++){
		    if (newHenchmen.henchmenName == henchmenGroups[i]){
			  continue doLoopHenchmen;
			}
		  }
		  henchmenGroups[henchCountUp] = newHenchmen.henchmenName;
		  henchmenGCount = henchmenGCount - 1;
		}
		
		//move to next position in array
        henchCountUp = henchCountUp + 1;
	  }
      while (henchmenGCount > 0);
      
	  //alphabetize henchmen groups, ignoring any 'The' at the start of the names
      henchmenGroups.sort(function (a, b){
        function getRaw(s){
          return s.replace(/The /, "").trim();
        }
        return getRaw(a).localeCompare(getRaw(b));
      });		 
	  
	  //selects the hero decks
      var heroDecks = new Array(heroDecksNo);
	  var heroDCount = heroDecksNo;
	  var heroCountUp = 0;
	  var newHero;
	  
	  //do loop for getting random heroes, scheme heroes, making sure there are no duplicates
	  doLoopHeroes:
      do{
	    //first hero should be any scheme hero
		if (heroCountUp == 0){
		  if (scheme.schemeHero == 1){
		    heroDecks[heroCountUp] = scheme.schemeHeroName;
			scheme.schemeHero = 0;
		    heroDCount = heroDCount - 1;
		  }
		  //if not, random
		  else{
		    newHero = getHeroes();
			heroDecks[heroCountUp] = newHero.heroName;
			shards = shards + newHero.HeroShards;
			heroDCount = heroDCount - 1;
		  }
		}
		//final hero assigner, which will be run until all HDs are selected
		else{
		  newHero = getHeroes();
		  //check for duplicate
		  for (var i = 0; i < heroCountUp; i++){
		    if (newHero.heroName == heroDecks[i]){
			  continue doLoopHeroes;
			}
		  }
		  heroDecks[heroCountUp] = newHero.heroName;
		  shards = shards + newHero.HeroShards;
		  heroDCount = heroDCount - 1;
		}
		
		//move to next position in array
        heroCountUp = heroCountUp + 1;
	  }
      while (heroDCount > 0);
      
	  //alphabetize hero groups, ignoring any 'The' at the start of the names
      heroDecks.sort(function (a, b){
        function getRaw(s){
          return s.replace(/The /, "").trim();
        }
        return getRaw(a).localeCompare(getRaw(b));
      });		
	  
	  //prints the final setup instructions
	  document.write("<br>INITIAL SETUP<br><br>");
	  
	  //starting deck
	  if (playerCount == 1){
	    document.write("- The starting team is " + startingTeam.startingTeamName + ". You shuffle a personal deck of 8 " + startingTeam.teamAgents + " and 4 " + startingTeam.teamTroopers + ", and then draw 6 cards.<br>");
	  }
	  else{
	    document.write("- The starting team is " + startingTeam.startingTeamName + ". Each player shuffles a personal deck of 8 " + startingTeam.teamAgents + " and 4 " + startingTeam.teamTroopers + ", and then draws 6 cards.<br>");
	  }
	  
	  //standard board decks
	  document.write("- Put the S.H.I.E.L.D. Officers, Madame HYDRA, New Recruits, Sidekicks, Wounds, Bindings and Bystanders decks on the board in the appropriate spaces. Make sure to shuffle the Bystanders deck.<br>");
	  
	  //mastermind
	  document.write("- The Mastermind for this game is " + mastermind.mastermindName + ". Put " + mastermind.mastermindName + " on the board with the 4 Mastermind Tactics facedown underneath, shuffled.<br>");
	  
	  //shards
	  if (shards > 0){
	    document.write("- This game requires the Shards. Place them near the board.<br>");
	  }
	  
	  document.write("<br>VILLAIN DECK<br><br>");
	  
	  //scheme
	  if (scheme.schemeRules == "0"){
	    document.write("- The Scheme for this game is " + scheme.schemeName + ". Put " + scheme.schemeTwists + " Scheme Twists into the Villain Deck.<br>");
	  }
	  else{
	    document.write("- The Scheme for this game is " + scheme.schemeName + ". " + scheme.schemeRules + " Put " + scheme.schemeTwists + " Scheme Twists into the Villain Deck.<br>");
	  }
	  
	  //master strikes
	  document.write("- Add " + masterStrikes + " Master Strikes to the Villain Deck.<br>");
	  
	  //villain groups
	  document.write("- The Villain Groups for this game are ");
	  for (var i = 0; i < villainGroups.length; i++){
	    if (i == villainGroups.length - 1){
		  document.write(villainGroups[i] + ".<br>");
		}
		else if (i == villainGroups.length - 2){
		  document.write(villainGroups[i] + " and ");
		}
		else{
		  document.write(villainGroups[i] + ", ");
		}
	  }
	  
	  //henchmen groups
	  document.write("- The Henchmen Groups for this game are ");
	  for (var i = 0; i < henchmenGroups.length; i++){
	    if (i == henchmenGroups.length - 1){
		  document.write(henchmenGroups[i] + ".<br>");
		}
		else if (i == henchmenGroups.length - 2){
		  document.write(henchmenGroups[i] + " and ");
		}
		else{
		  document.write(henchmenGroups[i] + ", ");
		}
	  }
	  
	  //bystanders
	  if (bystandersCheck == 0){
	    if (playerCount == 1){
		  document.write("- Add " + villainBystanders + " Bystander to the Villain Deck. Shuffle it.<br>");
	    }
		else{
		  document.write("- Add " + villainBystanders + " Bystanders to the Villain Deck. Shuffle it.<br>");
		}
	  }
	  
	  document.write("<br>HERO DECK<br><br>");
	  
	  //heroes
	  document.write("- The Heroes for this game are ");
	  for (var i = 0; i < heroDecks.length; i++){
	    if (i == heroDecks.length - 1){
		  document.write(heroDecks[i] + ".<br>");
		}
		else if (i == heroDecks.length - 2){
		  document.write(heroDecks[i] + " and ");
		}
		else{
		  document.write(heroDecks[i] + ", ");
		}
	  }
	  
	  document.write("<br>You are ready to play!");
	  
	  //functions
	  
	  //gets a random integer between min and max
	  function getRndInteger(min, max){
	    min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	  }
	  
	  //gets the random starting deck
	  function getStartingTeam(){
	    var startingTeamNum = getRndInteger(1, 2);
		
		var startingTeamName;
		var teamAgents;
		var teamTroopers
		
		if (startingTeamNum == 1){
		  startingTeamName = "S.H.I.E.L.D.";
		  teamAgents = "S.H.I.E.L.D. Agents";
		  teamTroopers = "S.H.I.E.L.D. Troopers";
		}
		else if (startingTeamNum == 2){
		  startingTeamName = "HYDRA";
		  teamAgents = "HYDRA Operatives";
		  teamTroopers = "HYDRA Soldiers";
		}
		else{
		  document.write("Something went wrong when selecting the random number for the starting team.<br>");
		}
		
		return{
		  startingTeamName: startingTeamName,
		  teamAgents: teamAgents,
		  teamTroopers: teamTroopers
		};
	  }
	  
	  //gets the random mastermind
	  function getMastermind(){
	    var mastermindNum = getRndInteger(1, 4);
		
		var mastermindName;
		var alwaysLeads;
		var alwaysLeadsType;
		
		//needs shards
		var MMshards = 0;
		
		//base game masterminds
		if (mastermindNum == 1){
		  mastermindName = "Dr. Doom";
		  alwaysLeads = "Doombot Legion";
		  alwaysLeadsType = "h";
		}
		else if (mastermindNum == 2){
		  mastermindName = "Loki";
		  alwaysLeads = "Enemies of Asgard";
		  alwaysLeadsType = "v";
		}
		else if (mastermindNum == 3){
		  mastermindName = "Magneto";
		  alwaysLeads = "Brotherhood";
		  alwaysLeadsType = "v";
		}
		else if (mastermindNum == 4){
		  mastermindName = "Red Skull";
		  alwaysLeads = "HYDRA";
		  alwaysLeadsType = "v";
		}
		
		//dark city masterminds
		
		//fantastic four masterminds
		
		//paint the town red masterminds
		
		//villains masterminds
		
		//guardians of the galaxy masterminds
		
		//3d masterminds
		
		//fear itself masterminds
		
		//secret wars - volume 1 masterminds
		
		//secret wars - volume 2 masterminds
		
		//captain america 75th anniversary masterminds
		
		//civil war masterminds
		
		//deadpool masterminds
		
		//noir masterminds
		
		//x-men masterminds
		
		//spider-man: homecoming masterminds
		
		//champions masterminds
		
		//world war hulk masterminds
		
		//marvel studios phase 1 masterminds
		
		//ant-man masterminds
		
		//venom masterminds
		
		else{
		  document.write("Something went wrong when selecting the random number for the mastermind.<br>");
		}
		
		return{
		  mastermindName: mastermindName,
		  alwaysLeads: alwaysLeads,
		  alwaysLeadsType: alwaysLeadsType,
          MMshards: MMshards		  
		};
	  }
	
	  //gets the random scheme
	  function getScheme(playerCount){
	    var schemeNum = getRndInteger(1, 8);
		
		var schemeName;
		var schemeTwists;
		var schemeRules = "0";
		
		var Sshards = 0;  //needs shards
		var bystandersScheme = 0; //predetermines number of bystanders
		
		var needsVillainGroups = 0; //needs an additional villain group
		var needsHenchemenGroups = 0; //needs an additional henchmen group
		var needsHeroDecks = 0;  //needs an additional hero deck, or less
		
		var schemeVillainGroup;  //needs a specific villain or henchmen group
		var schemeVillainType;
		
		var schemeHero = 0; //needs a specific hero deck
		var schemeHeroName;
		
		//base game schemes
		if (schemeNum == 1){
		  schemeName = "The Legacy Virus";
		  schemeTwists = 8;
		  schemeRules = "The Wound stack holds " + 6 * playerCount + " Wounds.";
		}
		else if (schemeNum == 2){
		  schemeName = "Midtown Bank Robbery";
		  schemeTwists = 8;
		  schemeRules = "Add 12 total Bystanders to the Villain Deck.";
		  bystandersScheme = 1;
		}
		else if (schemeNum == 3){
		  schemeName = "Negative Zone Prison Breakout";
		  schemeTwists = 8;
		  needsHenchemenGroups = 1;
		}
		else if (schemeNum == 4){
		  schemeName = "Portals to the Dark Dimension";
		  schemeTwists = 7;
		}
		else if (schemeNum == 5){
		  schemeName = "Replace Earth's Leaders with Killbots";
		  schemeTwists = 5;
		  schemeRules = "Put 3 Scheme Twists next to this Scheme. Add 18 total Bystanders to the Villain Deck.";
		  bystandersScheme = 1;
		}
		else if (schemeNum == 6){
		  schemeName = "Secret Invasion of the Skrull Shapeshifters";
		  schemeTwists = 8;
		  needsHeroDecks = 1;
		  schemeVillainGroup = "Skrulls";
		  schemeVillainType = "v";
		  schemeRules = "Shuffle 12 random Heroes from the Hero Deck into the Villain Deck.";
		}
		else if (schemeNum == 7){
		  schemeName = "Super Hero Civil War";
		  if (playerCount < 4){
		    schemeTwists = 8;
		  }
		  else{
		    schemeTwists = 5;
		  }
		  if (playerCount < 3){
		    needsHeroDecks = -1;
		  }
		}
		else if (schemeNum == 8){
		  schemeName = "Unleash the Power of the Cosmic Cube";
		  schemeTwists = 8;
		}
		
		//dark city schemes
		
		//fantastic four schemes
		
		//paint the town red schemes
		
		//villains schemes
		
		//guardians of the galaxy schemes
		
		//3d schemes
		
		//fear itself schemes
		
		//secret wars - volume 1 schemes
		
		//secret wars - volume 2 schemes
		
		//captain america 75th anniversary schemes
		
		//civil war schemes
		
		//deadpool schemes
		
		//noir schemes
		
		//x-men schemes
		
		//spider-man: homecoming schemes
		
		//champions schemes
		
		//world war hulk schemes
		
		//marvel studios phase 1 schemes
		
		//ant-man schemes
		
		//venom schemes
		
		else{
		  document.write("Something went wrong when selecting the random number for the scheme.<br>");
		}
		
		return{
		  schemeName: schemeName,
		  schemeTwists: schemeTwists,
		  schemeRules: schemeRules,
          Sshards: Sshards,
          bystandersScheme: bystandersScheme,
          needsVillainGroups: needsVillainGroups,
		  needsHenchemenGroups: needsHenchemenGroups,
          needsHeroDecks: needsHeroDecks,
          schemeVillainGroup: schemeVillainGroup,
          schemeVillainType: schemeVillainType,
          schemeHero: schemeHero,
          schemeHeroName: schemeHeroName		  
		};
	  }
	
	  //gets the random villain groups
	  function getVillainGroup(){
	    var villainNum = getRndInteger(1, 7);
		
		var villainName;
		
		//needs shards
		var Vshards = 0;
		
		//base game villain groups
		if (villainNum == 1){
		  villainName = "Brotherhood";
		}
		else if (villainNum == 2){
		  villainName = "Enemies of Asgard";
		}
		else if (villainNum == 3){
		  villainName = "HYDRA";
		}
		else if (villainNum == 4){
		  villainName = "Masters of Evil";
		}
		else if (villainNum == 5){
		  villainName = "Radiation";
		}
		else if (villainNum == 6){
		  villainName = "Skrulls";
		}
		else if (villainNum == 7){
		  villainName = "Spider-Foes";
		}
		
		//dark city villain groups
		
		//fantastic four villain groups
		
		//paint the town red villain groups
		
		//villains villain groups
		
		//guardians of the galaxy villain groups
		
		//3d villain groups
		
		//fear itself villain groups
		
		//secret wars - volume 1 villain groups
		
		//secret wars - volume 2 villain groups
		
		//captain america 75th anniversary villain groups
		
		//civil war villain groups
		
		//deadpool villain groups
		
		//noir villain groups
		
		//x-men villain groups
		
		//spider-man: homecoming villain groups
		
		//champions villain groups
		
		//world war hulk villain groups
		
		//marvel studios phase 1 villain groups
		
		//ant-man villain groups
		
		//venom villain groups
		
		else{
		  document.write("Something went wrong when selecting a random number for the villain groups.<br>");
		}
		
		return{
		  villainName: villainName,
		  Vshards: Vshards		  
		};
	  }
	
	  //gets the random henchmen groups
	  function getHenchmenGroup(){
	    var henchmenNum = getRndInteger(1, 4);
		
		var henchmenName;
		
		//base game henchmen groups
		if (henchmenNum == 1){
		  henchmenName = "Doombot Legion";
		}
		else if (henchmenNum == 2){
		  henchmenName = "Hand Ninjas";
		}
		else if (henchmenNum == 3){
		  henchmenName = "Savage Land Mutates";
		}
		else if (henchmenNum == 4){
		  henchmenName = "Sentinel";
		}
		
		//dark city henchmen groups
		
		//fantastic four henchmen groups
		
		//paint the town red henchmen groups
		
		//villains henchmen groups
		
		//guardians of the galaxy henchmen groups
		
		//3d henchmen groups
		
		//fear itself henchmen groups
		
		//secret wars - volume 1 henchmen groups
		
		//secret wars - volume 2 henchmen groups
		
		//captain america 75th anniversary henchmen groups
		
		//civil war henchmen groups
		
		//deadpool henchmen groups
		
		//noir henchmen groups
		
		//x-men henchmen groups
		
		//spider-man: homecoming henchmen groups
		
		//champions henchmen groups
		
		//world war hulk henchmen groups
		
		//marvel studios phase 1 henchmen groups
		
		//ant-man henchmen groups
		
		//venom henchmen groups
		
		else{
		  document.write("Something went wrong when selecting a random number for the henchmen groups.<br>");
		}
		
		return{
		  henchmenName: henchmenName,	  
		};
	  }
	
	  //gets the random hero decks
	  function getHeroes(){
	    var heroNum = getRndInteger(1, 15);
		
		var heroName;
		
		//needs shards
		var HeroShards = 0;
		
		//base game hero decks
		if (heroNum == 1){
		  heroName = "Black Widow";
		}
		else if (heroNum == 2){
		  heroName = "Captain America";
		}
		else if (heroNum == 3){
		  heroName = "Cyclops";
		}
		else if (heroNum == 4){
		  heroName = "Deadpool";
		}
		else if (heroNum == 5){
		  heroName = "Emma Frost";
		}
		else if (heroNum == 6){
		  heroName = "Gambit";
		}
		else if (heroNum == 7){
		  heroName = "Hawkeye";
		}
		else if (heroNum == 8){
		  heroName = "Hulk";
		}
		else if (heroNum == 9){
		  heroName = "Iron Man";
		}
		else if (heroNum == 10){
		  heroName = "Nick Fury";
		}
		else if (heroNum == 11){
		  heroName = "Rogue";
		}
		else if (heroNum == 12){
		  heroName = "Spider-Man";
		}
		else if (heroNum == 13){
		  heroName = "Storm";
		}
		else if (heroNum == 14){
		  heroName = "Thor";
		}
		else if (heroNum == 15){
		  heroName = "Wolverine";
		}
		
		//dark city hero decks
		
		//fantastic four hero decks
		
		//paint the town red hero decks
		
		//villains hero decks
		
		//guardians of the galaxy hero decks
		
		//3d hero decks
		
		//fear itself hero decks
		
		//secret wars - volume 1 hero decks
		
		//secret wars - volume 2 hero decks
		
		//captain america 75th anniversary hero decks
		
		//civil war hero decks
		
		//deadpool hero decks
		
		//noir hero decks
		
		//x-men hero decks
		
		//spider-man: homecoming hero decks
		
		//champions hero decks
		
		//world war hulk hero decks
		
		//marvel studios phase 1 hero decks
		
		//ant-man hero decks
		
		//venom hero decks
		
		else{
		  document.write("Something went wrong when selecting a random number for the hero decks.<br>");
		}
		
		return{
		  heroName: heroName,
		  HeroShards: HeroShards		  
		};
	  }