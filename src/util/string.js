export const RemoveAccentsString = function(str){
	let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
	let accentsOut = 'AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
	str = str.split('');
	str.forEach((letter, index) => {
		let i = accents.indexOf(letter);
		if (i != -1) {
			str[index] = accentsOut[i];
		}
	});
	return str.join('');
};
