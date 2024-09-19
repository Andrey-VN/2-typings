///////////Вместо импортов
function isFinite(number: number): boolean {
	return false;
}

function isSafeNumber(number: number): boolean {
	return false;
}

function makeOrdinal(words: string): string {
	return words;
}
//////////

const enum TenPower {
	TEN = 10,
	ONE_HUNDRED = 100,
	ONE_THOUSAND = 1_000,
	ONE_MILLION = 1_000_000,
	ONE_BILLION = 1_000_000_000,           //         1.000.000.000 (9)
	ONE_TRILLION = 1_000_000_000_000,       //     1.000.000.000.000 (12)
	ONE_QUADRILLION = 1_000_000_000_000_000, // 1.000.000.000.000.000 (15)           
}

const MAX : bigint = 9007199254740992n; // 9.007.199.254.740.992 (15)

const LESS_THAN_TWENTY: readonly string[] = [
	'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
	'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const TENTHS_LESS_THAN_HUNDRED: readonly string[] = [
	'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];


function toWords(number: string, asOrdinal: boolean): string {
	const num = parseInt(number, 10);

	if (!isFinite(num)) {
		throw new TypeError(
			'Not a finite number: ' + number + ' (' + typeof number + ')'
		);
	}
	if (!isSafeNumber(num)) {
		throw new RangeError(
			'Input is not a safe number, it’s either too large or too small.'
		);
	}

	const words = generateWords(num);
	return asOrdinal ? makeOrdinal(words) : words;
}

function generateWords(number: number, words: string[] = []): string {
	let word: string = '';
	let remainder: number = 0;

	// We’re done
	if (number === 0) {
		return !words ? 'zero' : words.join(' ').replace(/,$/, '');
	}

	// If negative, prepend “minus”
	if (number < 0) {
		words.push('minus');
		number = Math.abs(number);
	}

	if (number < 20) {
		remainder = 0;
		word = LESS_THAN_TWENTY[number];

	} else if (number < TenPower.ONE_HUNDRED) {
		remainder = number % TenPower.TEN;
		word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TenPower.TEN)];
		// In case of remainder, we need to handle it here to be able to add the “-”
		if (remainder) {
			word += '-' + LESS_THAN_TWENTY[remainder];
			remainder = 0;
		}

	} else if (number < TenPower.ONE_THOUSAND) {
		remainder = number % TenPower.ONE_HUNDRED;
		word = generateWords(Math.floor(number / TenPower.ONE_HUNDRED)) + ' hundred';

	} else if (number < TenPower.ONE_MILLION) {
		remainder = number % TenPower.ONE_THOUSAND;
		word = generateWords(Math.floor(number / TenPower.ONE_THOUSAND)) + ' thousand,';

	} else if (number < TenPower.ONE_BILLION) {
		remainder = number % TenPower.ONE_MILLION;
		word = generateWords(Math.floor(number / TenPower.ONE_MILLION)) + ' million,';

	} else if (number < TenPower.ONE_TRILLION) {
		remainder = number % TenPower.ONE_BILLION;
		word = generateWords(Math.floor(number / TenPower.ONE_BILLION)) + ' billion,';

	} else if (number < TenPower.ONE_QUADRILLION) {
		remainder = number % TenPower.ONE_TRILLION;
		word = generateWords(Math.floor(number / TenPower.ONE_TRILLION)) + ' trillion,';

	} else if (number <= MAX) {
		remainder = number % TenPower.ONE_QUADRILLION;
		word = generateWords(Math.floor(number / TenPower.ONE_QUADRILLION)) +
			' quadrillion,';
		words.push(word);
	}


	words.push(word);
	return generateWords(remainder, words);
}

