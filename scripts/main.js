$('#winning').hide();
$('#losing').hide();

var gameData = {};
gameData.maxTrials = 8;
gameData.trials = 0;
gameData.remainingTrials = gameData.maxTrials;
gameData.word = '';
gameData.lettersCount = 0;
gameData.replacementString = '';
gameData.alphabet = 'abcdefghijklmnopqrstuvwxyz';
gameData.triedLetters = ''
gameData.states = ['playing', 'winning', 'losing']
gameData.state = gameData.states[0];


$.get('/api/index.php', function(word){
	gameData.word = word;
	gameData.lettersCount = word.length;
	gameData.replacementString = word.replace(/./g,'*');
	render();
	//select();
});


$('form').on('submit', function(e){
	e.preventDefault();
	/* code à exécuter quand on soumet une lettre */
	let triedLetter = $('#select-letter option:selected').val();
	// retirer de la liste => mettre a jour l'alphabet
	gameData.alphabet = gameData.alphabet.replace(triedLetter,'');
	gameData.triedLetters += triedLetter;
	// verifier si la lettre est dans le mot 
	let replacementString = '';
	let letterFound = false;
	for(let i = 0; i<= gameData.lettersCount; i++){
		if(gameData.word.charAt(i) === triedLetter.toUpperCase()){
			replacementString += triedLetter
			letterFound = true;
		}else{
			replacementString += gameData.replacementString.charAt(i);
		}
	};
	gameData.replacementString = replacementString;

	if(!letterFound){
		gameData.trials +=1;
		gameData.remainingTrials = gameData.maxTrials - gameData.trials;
		if(gameData.remainingTrials === 0){
			//afficher le msg de defaite
			gameData.state = gameData.states[2];
		}
	}else{
		console.log(gameData);
		if(gameData.replacementString.toUpperCase() === gameData.word){
			alert('tu as gagné !')
			//afficheer le msg de succes 
			gameData.state = gameData.states[1];
		}
	}

	render();
});


function render(){
	$('#max-trials').text(gameData.maxTrials);
	$('#letters-count').text(gameData.lettersCount);
	$('#replacement-string').text(gameData.replacementString);
	$('#select-letter').find('option').remove();
	$('#tried-letters').text(gameData.triedLetters);	
	// créer les option (utiliser split et foreach)
	gameData.alphabet.split("").forEach(letter => 
		$('#select-letter').append(`<option value="${letter}">${letter}</option>`)
	);	
	
	gameData.states.forEach(function(state){
		if(gameData.state === state){
			$(`#${state}`).show();
		}else{
			$(`#${state}`).hide();
		}
	})

	$('#remaining-trials').text(gameData.remainingTrials);
	$('#image-file').attr('src',`images/pendu${gameData.trials}.gif`);
	$('word').text(gameData.word);
}
	

// on a 3 etats possible [winning, losing , playing]
// mais il n'y a qu'un etat actif a la fois - playing
// -> cacher les etats inactif .hide()
// -> afficher l'etat actif .show()






