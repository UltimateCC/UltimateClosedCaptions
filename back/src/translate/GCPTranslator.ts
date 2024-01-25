import { Secret } from "../entity/Secret";
import { logger } from "../logger";
import { Result, TranscriptAlt } from "../types";
import { Translator } from "./Translator";

// https://cloud.google.com/translate/docs/reference/rest/v2/translate

export class GCPTranslator extends Translator {

	private key: string;

	ready() {
		return !!this.key;
	}

	/** Check if API key is working by translating an empty string */
	static async checkKey(key: string) {
		const params = new URLSearchParams({
			key,
			q: '',
			source: 'en',
			target: 'fr'
		});
		const res = await fetch(`https://translation.googleapis.com/language/translate/v2?${params}`);
		if(!res.ok) {
			const text = await res.text();
			return {
				message: `${res.status} ${res.statusText}`,
				text
			}
		}
	}

	async init() {
		// this.key = this.user.secrets.gcpKey!;
		const secret = await Secret.findOneByOrFail({ twitchId: this.user.twitchId, type: 'gcpKey' });
		this.key = await secret.getValue();
	}

	async getLangs() {
		return Object.entries(langs).map(([code, name])=>{ return { code, name } });
	}

	protected async translateOne(transcript: TranscriptAlt, target: string): Promise<Result<TranscriptAlt>> {

		const params = new URLSearchParams({
			q: transcript.text,
			source: transcript.lang,
			format: 'text',
			target: target,
			key: this.key
		});

		const res = await fetch(`https://translation.googleapis.com/language/translate/v2?${params}`, {
			method: 'POST'
		});

		if(res.ok) {
			const json = await res.json();
			return {
				isError: false,
				data: { text: json?.data?.translations[0]?.translatedText ?? '' , lang: target }
			};
		}else{
			const status = `${ res.status } ${ res.statusText }`;
			const text = await res.text();
			logger.debug('GCP translation error', status, text);

			// Status 403 = Key doesnt have required permissions to access API
			// Status 400 = Invalid request ...? Invalid API key etc
			// Mark as expired to avoid calling API again in this case
			if(res.status === 403 || res.status === 400) {
				this.expired = true;
			}
			return {
				isError: true,
				message: `Translation API error: ${ status }`
			}
		}
	}
}

const langs = {
	"af": "Afrikaans",
	"sq": "Albanian",
	"am": "Amharic",
	"ar": "Arabic",
	"hy": "Armenian",
	"as": "Assamese",
	"ay": "Aymara",
	"az": "Azerbaijani",
	"bm": "Bambara",
	"eu": "Basque",
	"be": "Belarusian",
	"bn": "Bengali",
	"bho": "Bhojpuri",
	"bs": "Bosnian",
	"bg": "Bulgarian",
	"ca": "Catalan",
	"ceb": "Cebuano",
	"zh-CN": "Chinese (Simplified)",
	"zh-TW": "Chinese (Traditional)",
	"co": "Corsican",
	"hr": "Croatian",
	"cs": "Czech",
	"da": "Danish",
	"dv": "Dhivehi",
	"doi": "Dogri",
	"nl": "Dutch",
	"en": "English",
	"eo": "Esperanto",
	"et": "Estonian",
	"ee": "Ewe",
	"fil": "Filipino (Tagalog)",
	"fi": "Finnish",
	"fr": "French",
	"fy": "Frisian",
	"gl": "Galician",
	"ka": "Georgian",
	"de": "German",
	"el": "Greek",
	"gn": "Guarani",
	"gu": "Gujarati",
	"ht": "Haitian Creole",
	"ha": "Hausa",
	"haw": "Hawaiian",
	"he": "Hebrew",
	"hi": "Hindi",
	"hmn": "Hmong",
	"hu": "Hungarian",
	"is": "Icelandic",
	"ig": "Igbo",
	"ilo": "Ilocano",
	"id": "Indonesian",
	"ga": "Irish",
	"it": "Italian",
	"ja": "Japanese",
	"jv": "Javanese",
	"kn": "Kannada",
	"kk": "Kazakh",
	"km": "Khmer",
	"rw": "Kinyarwanda",
	"gom": "Konkani",
	"ko": "Korean",
	"kri": "Krio",
	"ku": "Kurdish",
	"ckb": "Kurdish (Sorani)",
	"ky": "Kyrgyz",
	"lo": "Lao",
	"la": "Latin",
	"lv": "Latvian",
	"ln": "Lingala",
	"lt": "Lithuanian",
	"lg": "Luganda",
	"lb": "Luxembourgish",
	"mk": "Macedonian",
	"mai": "Maithili",
	"mg": "Malagasy",
	"ms": "Malay",
	"ml": "Malayalam",
	"mt": "Maltese",
	"mi": "Maori",
	"mr": "Marathi",
	"mni-Mtei": "Meiteilon (Manipuri)",
	"lus": "Mizo",
	"mn": "Mongolian",
	"my": "Myanmar (Burmese)",
	"ne": "Nepali",
	"no": "Norwegian",
	"ny": "Nyanja (Chichewa)",
	"or": "Odia (Oriya)",
	"om": "Oromo",
	"ps": "Pashto",
	"fa": "Persian",
	"pl": "Polish",
	"pt": "Portuguese (Portugal, Brazil)",
	"pa": "Punjabi",
	"qu": "Quechua",
	"ro": "Romanian",
	"ru": "Russian",
	"sm": "Samoan",
	"sa": "Sanskrit",
	"gd": "Scots Gaelic",
	"nso": "Sepedi",
	"sr": "Serbian",
	"st": "Sesotho",
	"sn": "Shona",
	"sd": "Sindhi",
	"si": "Sinhala (Sinhalese)",
	"sk": "Slovak",
	"sl": "Slovenian",
	"so": "Somali",
	"es": "Spanish",
	"su": "Sundanese",
	"sw": "Swahili",
	"sv": "Swedish",
	"tl": "Tagalog (Filipino)",
	"tg": "Tajik",
	"ta": "Tamil",
	"tt": "Tatar",
	"te": "Telugu",
	"th": "Thai",
	"ti": "Tigrinya",
	"ts": "Tsonga",
	"tr": "Turkish",
	"tk": "Turkmen",
	"ak": "Twi (Akan)",
	"uk": "Ukrainian",
	"ur": "Urdu",
	"ug": "Uyghur",
	"uz": "Uzbek",
	"vi": "Vietnamese",
	"cy": "Welsh",
	"xh": "Xhosa",
	"yi": "Yiddish",
	"yo": "Yoruba",
	"zu": "Zulu"
}
